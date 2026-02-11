from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
from datetime import datetime
import json
import asyncio

from app.models import AnalysisRequest, AnalysisResult, UserAnalysis
from app.services.file_service import file_service
from app.services.analysis_service import analysis_service
from app.services.llm_service import llm_service


router = APIRouter()


@router.post("/analyze")
async def analyze_resume(
    job_description: str = Form(...),
    resume_text: Optional[str] = Form(None),
    resume_file: Optional[UploadFile] = File(None)
):
    """
    Analyze resume against job description with real-time progress updates
    """
    
    async def generate_progress():
        try:
            # Validate input
            if not resume_text and not resume_file:
                yield f"data: {json.dumps({'error': 'Either resume_text or resume_file must be provided'})}\n\n"
                return
            
            yield f"data: {json.dumps({'progress': 5, 'message': 'Starting analysis...'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Extract resume text
            final_resume_text = resume_text
            file_path = None
            
            if resume_file:
                yield f"data: {json.dumps({'progress': 10, 'message': 'Processing uploaded file...'})}\n\n"
                try:
                    # SECURITY FIX: Validate file size before processing
                    content = await resume_file.read()
                    file_size = len(content)
                    max_size = 10 * 1024 * 1024  # 10MB
                    
                    if file_size > max_size:
                        yield f"data: {json.dumps({'error': 'File size exceeds maximum allowed size of 10MB'})}\n\n"
                        return
                    
                    if file_size == 0:
                        yield f"data: {json.dumps({'error': 'Uploaded file is empty'})}\n\n"
                        return
                    
                    # Reset file pointer after reading
                    await resume_file.seek(0)
                    
                    file_path = await file_service.save_upload_file(resume_file)
                    final_resume_text = await file_service.extract_text_from_file(file_path)
                    yield f"data: {json.dumps({'progress': 20, 'message': 'File processed successfully'})}\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'error': f'Error processing file: {str(e)}'})}\n\n"
                    return
                finally:
                    if file_path:
                        await file_service.cleanup_file(file_path)
            else:
                yield f"data: {json.dumps({'progress': 20, 'message': 'Resume text received'})}\n\n"
            
            if not final_resume_text or len(final_resume_text.strip()) < 50:
                yield f"data: {json.dumps({'error': 'Resume text is too short or empty'})}\n\n"
                return
            
            # Perform analysis with progress updates
            yield f"data: {json.dumps({'progress': 30, 'message': 'Extracting skills from resume...'})}\n\n"
            await asyncio.sleep(0.1)
            
            yield f"data: {json.dumps({'progress': 45, 'message': 'Analyzing job requirements...'})}\n\n"
            result = await analysis_service.analyze(final_resume_text, job_description)
            
            yield f"data: {json.dumps({'progress': 65, 'message': 'Calculating skill match...'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Generate AI suggestions (only for top 3 missing skills for speed)
            missing_skill_names = [skill.skill for skill in result.missing_skills[:3]]
            if missing_skill_names:
                yield f"data: {json.dumps({'progress': 75, 'message': 'Generating AI recommendations...'})}\n\n"
                try:
                    resume_suggestions = await llm_service.generate_resume_rewrite_suggestions(
                        final_resume_text[:1500],  # Limit text length for faster processing
                        job_description[:1500],
                        missing_skill_names
                    )
                    result.resume_rewrite_suggestions = resume_suggestions
                except Exception as llm_error:
                    print(f"LLM suggestion error: {llm_error}")
                    result.resume_rewrite_suggestions = "AI suggestions temporarily unavailable"
            
            yield f"data: {json.dumps({'progress': 90, 'message': 'Saving results...'})}\n\n"
            
            # Save to database (non-blocking)
            try:
                user_analysis = UserAnalysis(
                    resume_text=final_resume_text,
                    job_description=job_description,
                    analysis_result=result.dict(),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                await user_analysis.insert()
            except Exception as db_error:
                print(f"DB save error: {db_error}")
            
            # Send final result
            yield f"data: {json.dumps({'progress': 100, 'message': 'Analysis complete!', 'result': result.dict()})}\n\n"
            
        except Exception as e:
            print(f"Analysis error: {e}")
            yield f"data: {json.dumps({'error': f'Analysis failed: {str(e)}'})}\n\n"
    
    return StreamingResponse(generate_progress(), media_type="text/event-stream")


@router.get("/history")
async def get_analysis_history(limit: int = 10, skip: int = 0):
    """Get analysis history"""
    try:
        analyses = await UserAnalysis.find_all().skip(skip).limit(limit).to_list()
        return {
            "total": await UserAnalysis.count(),
            "analyses": [
                {
                    "id": str(analysis.id),
                    "created_at": analysis.created_at,
                    "skill_match_percentage": analysis.analysis_result.get("skill_match_percentage"),
                    "profile_fit_score": analysis.analysis_result.get("profile_fit_score")
                }
                for analysis in analyses
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching history: {str(e)}"
        )


@router.get("/history/{analysis_id}")
async def get_analysis_by_id(analysis_id: str):
    """Get specific analysis by ID"""
    try:
        from beanie import PydanticObjectId
        analysis = await UserAnalysis.get(PydanticObjectId(analysis_id))
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching analysis: {str(e)}"
        )
