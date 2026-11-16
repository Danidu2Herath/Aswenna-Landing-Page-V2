import { useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { useRevealOnce } from "../hooks";

type Props = {
  children: ReactNode;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
  as?: ElementType;
};

/** Fades its child in the first time it is scrolled to. */
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useRevealOnce(ref);
  return (
    <Tag
      ref={ref}
      className={`reveal${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
