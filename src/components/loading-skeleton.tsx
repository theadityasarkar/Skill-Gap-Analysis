import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 w-full animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="flex flex-col items-center justify-center p-6 bg-card border-muted/40 shadow-sm">
            <Skeleton className="w-[180px] h-[180px] rounded-full" />
            <Skeleton className="w-32 h-4 mt-6" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="shadow-sm border-muted/40 h-full">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <Skeleton className="w-40 h-6" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={j} className="w-24 h-6 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-muted/40">
        <CardHeader className="bg-muted/20 border-b pb-4">
          <Skeleton className="w-48 h-6" />
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-[80%] h-4" />
          <Skeleton className="w-full h-4 mt-6" />
          <Skeleton className="w-[90%] h-4" />
        </CardContent>
      </Card>
    </div>
  );
}
