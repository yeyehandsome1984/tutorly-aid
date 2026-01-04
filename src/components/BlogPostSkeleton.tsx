import { Skeleton } from "@/components/ui/skeleton";

const BlogPostSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs skeleton */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Header skeleton */}
      <section className="gradient-hero py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-32 mb-4 bg-white/20" />
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-6 w-20 bg-white/20" />
              <Skeleton className="h-4 w-16 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </div>
            <Skeleton className="h-10 w-full max-w-2xl mb-2 bg-white/20" />
            <Skeleton className="h-10 w-3/4 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-48 w-full my-6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostSkeleton;
