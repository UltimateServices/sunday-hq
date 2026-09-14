"use client";

import { useEffect, useRef, type ReactNode } from "react";

function focusable(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

/** Keyboard trap for modal drawers. Escape closes. Tab cycles. Does not invent content. */
export function FocusTrap({
  children,
  onEscape,
  className,
}: {
  children: ReactNode;
  onEscape: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preferred = root.querySelector<HTMLElement>("[data-autofocus]");
    const prev = document.activeElement as HTMLElement | null;
    (preferred ?? focusable(root)[0])?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        escapeRef.current();
        return;
      }
      if (event.key !== "Tab" || !root) return;
      const items = focusable(root);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
