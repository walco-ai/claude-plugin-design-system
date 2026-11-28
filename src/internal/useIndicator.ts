import { type RefObject, useLayoutEffect, useRef } from "react";

/**
 * Measures the element of `container` that matches `selector` and writes its box on the container as the custom
 * properties --cpds-indicator-x, -y, -w and -h, so that one block drawn by the container can sit behind it.
 * The container must be the offset parent of the element. It gets `data-indicator-ready` one frame after its first
 * measure, so that the block is placed at once on the first render and slides only afterwards. A change of width
 * measures again.
 */
export function useIndicator(container: RefObject<HTMLElement | null>, selector: string, dependency: unknown) {
  const ready = useRef(false);
  useLayoutEffect(() => {
    const host = container.current;
    if (host === null) return;
    let frame = 0;
    const measure = () => {
      const target = host.querySelector<HTMLElement>(selector);
      if (target === null) return;
      host.style.setProperty("--cpds-indicator-x", `${String(target.offsetLeft)}px`);
      host.style.setProperty("--cpds-indicator-y", `${String(target.offsetTop)}px`);
      host.style.setProperty("--cpds-indicator-w", `${String(target.offsetWidth)}px`);
      host.style.setProperty("--cpds-indicator-h", `${String(target.offsetHeight)}px`);
      if (!ready.current && frame === 0) {
        frame = requestAnimationFrame(() => {
          ready.current = true;
          host.dataset["indicatorReady"] = "";
        });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [container, selector, dependency]);
}
