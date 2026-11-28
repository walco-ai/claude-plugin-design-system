import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/cx";
import { useTonePulse } from "../../internal/useTonePulse";
import type { Tone } from "../../internal/tone";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** waiting: the user has to act; info: someone else is working; success: done; neutral: closed or idle; danger: failed. */
  tone: Tone;
  children: ReactNode;
}

/** The status of an item or of a view, such as "Waiting for you" or "Confirmed". */
export function StatusBadge({ tone, className, children, ...rest }: StatusBadgeProps) {
  const pulse = useTonePulse(tone);
  return (
    <span className={cx("cpds-status-badge", `cpds-tone--${tone}`, pulse, className)} {...rest}>
      {children}
    </span>
  );
}
