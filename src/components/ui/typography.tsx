import React from "react";
import clsx from "clsx";

export type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "overline";

const variantMapping: Record<TypographyVariant, keyof HTMLElementTagNameMap> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subtitle1: "h6",
  subtitle2: "h6",
  body1: "p",
  body2: "p",
  caption: "span",
  overline: "span",
};

const variantClass: Record<TypographyVariant, string> = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
  subtitle1: "text-lg font-medium text-muted-foreground",
  subtitle2: "text-base font-medium text-muted-foreground",
  body1: "text-base leading-relaxed",
  body2: "text-sm leading-relaxed text-muted-foreground",
  caption: "text-xs text-muted-foreground",
  overline: "text-xs uppercase tracking-widest text-muted-foreground",
};

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  component?: keyof HTMLElementTagNameMap;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(({ variant = "body1", component, className, children, ...props }, ref) => {
  const Tag = component || variantMapping[variant] || "span";
  return React.createElement(Tag, { ref, className: clsx(variantClass[variant], className), ...props }, children);
});
Typography.displayName = "Typography";
