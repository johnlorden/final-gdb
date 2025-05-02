
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const VerseCardSkeleton: React.FC = () => (
  <div className="w-full max-w-2xl animate-pulse">
    <div className="p-6 bg-card border rounded-xl shadow-sm">
      <Skeleton className="h-5 w-20 mb-4" />
      <Skeleton className="h-24 w-full mb-4" />
      <Skeleton className="h-5 w-32" />
    </div>
  </div>
);

export const ShareButtonsSkeleton: React.FC = () => (
  <div className="flex flex-wrap justify-center gap-2">
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="h-10 w-24" />
    ))}
  </div>
);

export const SearchSkeleton: React.FC = () => (
  <div className="w-full mb-4">
    <Skeleton className="h-10 w-full mb-2" />
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-8 w-24" />
      ))}
    </div>
  </div>
);

export const HeaderSkeleton: React.FC = () => (
  <div className="h-16 w-full bg-background/80 backdrop-blur-sm border-b dark:border-gray-800 fixed top-0 z-10">
    <div className="container px-4 h-full flex items-center justify-between">
      <Skeleton className="h-6 w-40" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="mt-16 px-4 max-w-4xl mx-auto">
    <SearchSkeleton />
    <VerseCardSkeleton />
    <div className="mt-4">
      <ShareButtonsSkeleton />
    </div>
  </div>
);
