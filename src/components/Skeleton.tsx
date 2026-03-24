/**
 * #7: Skeleton Loading Components
 * 
 * 提供更好的加载状态体验，替代纯文本 "Loading..."
 */

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-surface-container-high rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Cover image skeleton */}
      <Skeleton className="aspect-[16/10] w-full rounded-lg" />
      
      {/* Category skeleton */}
      <Skeleton className="h-3 w-20" />
      
      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4" />
      
      {/* Excerpt skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Meta skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      
      {/* Cover image skeleton */}
      <Skeleton className="aspect-[21/9] w-full rounded-lg" />
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function ArchiveSkeleton() {
  return (
    <div className="space-y-8">
      {[2024, 2023].map((year) => (
        <div key={year} className="space-y-4">
          <Skeleton className="h-8 w-20" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-12 w-32" />
    </div>
  );
}