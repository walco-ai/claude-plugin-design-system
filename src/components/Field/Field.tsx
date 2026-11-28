import { type ReactElement, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cx } from "../../internal/cx";
import { Icon } from "../Icon/Icon";
import { iconCircleAlert } from "../Icon/icons";

/** What a labelled field receives from its frame: its id and the ids of the texts that describe it. */
export interface FieldControl {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

interface FieldProps {
  id: string;
  label: ReactNode;
  hint: ReactNode | undefined;
  error: ReactNode | undefined;
  className: string | undefined;
  children: (control: FieldControl) => ReactElement;
}

/** The frame shared by the text fields: a label above, the control, then a hint or an error below. */
export function Field({ id, label, hint, error, className, children }: FieldProps) {
  // A cleared error stays mounted, no longer describing the control, until its exit animation ends.
  const [previous, setPrevious] = useState(error);
  const [leaving, setLeaving] = useState<ReactNode>(undefined);
  if (error !== previous) {
    setPrevious(error);
    setLeaving(error === undefined ? previous : undefined);
  }
  const isLeaving = error === undefined && leaving !== undefined;
  const message = isLeaving ? leaving : error;
  const errorBox = useRef<HTMLParagraphElement>(null);
  // Without an exit animation, as under reduced motion, the error goes at once.
  useLayoutEffect(() => {
    const box = errorBox.current;
    if (isLeaving && (box === null || getComputedStyle(box).animationName === "none")) setLeaving(undefined);
  }, [isLeaving]);

  const hintId = hint === undefined ? undefined : `${id}-hint`;
  const errorId = error === undefined ? undefined : `${id}-error`;
  const describedBy = [errorId, hintId].filter((value) => value !== undefined).join(" ") || undefined;
  return (
    <div className={cx("cpds-field", className)}>
      <label className="cpds-field__label" htmlFor={id}>
        {label}
      </label>
      {children({ id, describedBy, invalid: error !== undefined })}
      {message !== undefined && (
        <p
          ref={errorBox}
          className={cx("cpds-field__error", isLeaving && "cpds-field__error--leaving")}
          id={errorId}
          aria-hidden={isLeaving || undefined}
          onAnimationEnd={(event) => {
            if (isLeaving && event.animationName === "cpds-field-error-out") setLeaving(undefined);
          }}
        >
          <Icon icon={iconCircleAlert} size="sm" />
          <span>{message}</span>
        </p>
      )}
      {hint !== undefined && (
        <p className="cpds-field__hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
}
