import { ReactNode } from "react";
import { useLazyLoad } from "@/hooks/use-lazy-load";
import { cn } from "@/lib/utils";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

const LazySection = ({
  children,
  className,
  fallback,
  rootMargin = "200px",
  threshold = 0.1,
}: LazySectionProps) => {
  const [ref, isVisible] = useLazyLoad<HTMLDivElement>({
    rootMargin,
    threshold,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <div className="animate-fade-in">{children}</div>
      ) : (
        fallback || (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )
      )}
    </div>
  );
};

export default LazySection;
