import { useEffect, useRef, type ReactNode } from "react";

type RecordRevealProps = {
  children: ReactNode;
  recordId: string | undefined;
};

const RecordReveal = ({ children, recordId }: RecordRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    element.classList.add("record-reveal-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.classList.remove("record-reveal-pending");
        element.classList.add("record-reveal-visible");
        observer.unobserve(element);
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-record-anchor={recordId} data-record-variant="desktop">
      {children}
    </div>
  );
};

export default RecordReveal;
