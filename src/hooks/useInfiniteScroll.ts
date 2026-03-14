import { useEffect, useRef } from "react";

type UseInfiniteScrollParams = {
  onLoadMore: () => void;
  hasMore: boolean;
  disabled?: boolean;
  rootMargin?: string;
  threshold?: number;
};

const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  disabled = false,
  rootMargin = "400px 0px",
  threshold = 0,
}: UseInfiniteScrollParams) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled || !hasMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, disabled, rootMargin, threshold]);

  return { sentinelRef };
};

export default useInfiniteScroll;
