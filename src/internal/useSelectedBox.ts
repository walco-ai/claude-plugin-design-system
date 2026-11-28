import { type RefObject, useLayoutEffect, useRef } from "react";

/**
 * Measures the element matching `selector` inside the container and writes its box as custom properties on its
 * offset parent (--indicator-x, --indicator-y, --indicator-w, --indicator-h), so that one pseudo-element can slide to
 * it. It measures again when `dependency` changes and when the container is resized.
 * The container gets `data-indicator-ready` one frame after the first measure, so that the indicator is placed
 * without sliding in from 0.
 */
export function useSelectedBox(container: RefObject<HTMLElement | null>, selector: string, dependency: unknown) {
  const ready = useRef(false);
  useLayoutEffect(() => {
    const box = container.current;
    if (box === null) return;
    const measure = () => {
      const target = box.querySelector<HTMLElement>(selector);
      if (target === null) return;
      const host = target.offsetParent instanceof HTMLElement ? target.offsetParent : box;
      const hostRect = host.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      host.style.setProperty("--indicator-x", `${String(rect.left - hostRect.left - host.clientLeft + host.scrollLeft)}px`);
      host.style.setProperty("--indicator-y", `${String(rect.top - hostRect.top - host.clientTop)}px`);
      host.style.setProperty("--indicator-w", `${String(rect.width)}px`);
      host.style.setProperty("--indicator-h", `${String(rect.height)}px`);
      if (!ready.current) {
        ready.current = true;
        requestAnimationFrame(() => {
          box.dataset["indicatorReady"] = "";
        });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => {
      observer.disconnect();
    };
  }, [container, selector, dependency]);
}
