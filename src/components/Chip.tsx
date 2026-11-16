import type { ReactNode } from "react";

export type ChipTone = "measured" | "estimated" | "neutral" | "note" | "live" | "info";

export default function Chip({
  tone,
  children,
  className = "",
}: {
  tone: ChipTone | string;
  children: ReactNode;
  className?: string;
}) {
  return <span className={`chip chip--${tone}${className ? ` ${className}` : ""}`}>{children}</span>;
}
