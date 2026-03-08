import { useLayoutEffect, useState, type FC } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const EDGE_TOLERANCE_PX = 12;

const VerticalScrollButton: FC = () => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    let rafId = 0;

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (maxScroll <= EDGE_TOLERANCE_PX) {
        setCanScrollUp(false);
        setCanScrollDown(false);
        setIsReady(true);
        return;
      }

      setCanScrollUp(currentScroll > EDGE_TOLERANCE_PX);
      setCanScrollDown(currentScroll < maxScroll - EDGE_TOLERANCE_PX);
      setIsReady(true);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollState);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  if (!isReady || (!canScrollUp && !canScrollDown)) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-6 z-40 flex flex-col gap-2">
      {canScrollUp ? (
        <button
          type="button"
          onClick={scrollToTop}
          title="Subir"
          aria-label="Subir"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
        >
          <FaChevronUp />
        </button>
      ) : null}

      {canScrollDown ? (
        <button
          type="button"
          onClick={scrollToBottom}
          title="Bajar"
          aria-label="Bajar"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
        >
          <FaChevronDown />
        </button>
      ) : null}
    </div>
  );
};

export default VerticalScrollButton;
