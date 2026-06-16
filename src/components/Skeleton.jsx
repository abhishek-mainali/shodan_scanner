import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`bg-border/40 animate-pulse rounded ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
    </div>
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  </div>
);

export const ResultsSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-end border-b border-border pb-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-24" />)}
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  </div>
);

export default Skeleton;
