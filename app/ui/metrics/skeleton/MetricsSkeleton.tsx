import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function MetricsSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-y-10">
      <div className="flex items-center gap-x-4 h-40">
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="flex-1 h-full" />
      </div>
      <div className="flex items-center gap-x-4 h-full">
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="flex-1 h-full" />
      </div>
    </div>
  );
}
