import { IReaderPreferences } from "@/atoms/reader-preferences";

export const getReaderTheme = (
  isDark: boolean,
  preferences: IReaderPreferences,
) => ({
  body: {
    background: isDark ? "#0f0f0f" : "#ffffff",
    color: isDark ? "#f1f1f1" : "#1c1c1e",
    "font-family": preferences.fontFamily,
    "line-height": preferences.lineHeight,
    "font-size": `${preferences.fontSize}px`,
    padding: "1.5rem 1rem",
  },

  // HEADINGS
  h1: {
    "font-size": "2rem",
    "font-weight": "bold",
    "margin-top": "1.2rem",
    "margin-bottom": "0.8rem",
  },
  h2: {
    "break-before": "page",
    "font-size": "1.6rem",
    "font-weight": "bold",
    "margin-top": "0 !important",
    "margin-bottom": "0.75rem !important",
    "padding-top": "0",
    "text-align": "center",
  },
  "h2 a": {
    display: "inline !important",
    height: "0 !important",
    margin: "0 !important",
    padding: "0 !important",
  },
  "body > *:first-child": {
    "margin-top": "0 !important",
    "padding-top": "0 !important",
  },
  "h2:first-child": {
    "margin-top": "0 !important",
    "padding-top": "0 !important",
  },
  "br + h2": {
    "margin-top": "0 !important",
    "padding-top": "0 !important",
  },
  "p:empty, div:empty": {
    display: "none",
  },
  h3: {
    "font-size": "1.3rem",
    "font-weight": "600",
    "margin-top": "1rem",
    "margin-bottom": "0.5rem",
  },

  // TEXT ELEMENTS
  pre: {
    "white-space": "pre-wrap",
    "font-family": "monospace",
    padding: "0.5rem",
    "background-color": isDark ? "#1e1e1e" : "#f5f5f5",
    "border-radius": "4px",
  },
  div: {
    color: "inherit !important",
  },
  span: {
    color: "inherit !important",
  },

  // LINKS
  a: {
    color: isDark ? "#87b4ff !important" : "#007aff !important",
    "text-decoration": "underline",
    "text-underline-offset": "2px",
  },

  // TABLES (prevent overflow, center inside page)
  table: {
    width: "100%",
    "table-layout": "fixed",
    "border-collapse": "collapse",
  },
  td: {
    "vertical-align": "top",
    "text-align": "center",
    padding: "0.5rem",
  },
  img: {
    "max-width": "100%",
    height: "auto",
    display: "block",
    margin: "0 auto",
  },

  // HORIZONTAL RULE
  hr: {
    "break-before": "page",
    border: "none",
    "border-top": `1px solid ${isDark ? "#444" : "#ccc"}`,
    margin: "1.5rem 0",
  },

  // CUSTOM CLASSES

  // Poems and literary structure
  ".poem": {
    "font-style": "italic",
    "white-space": "pre-wrap",
    "margin-left": "2rem",
  },
  ".blockquot": {
    margin: "1rem 2rem",
    "font-style": "italic",
    "border-left": `2px solid ${isDark ? "#555" : "#ccc"}`,
    "padding-left": "1rem",
  },
  ".quotdate": {
    "text-align": "right",
    "font-style": "italic",
    "margin-top": "0.5rem",
  },
  ".stanza": {
    "margin-bottom": "1rem",
  },

  // Side note
  ".sidenote": {
    border: `1px solid ${isDark ? "#555" : "#ddd"}`,
    padding: "0.5rem",
    "background-color": isDark ? "#1a1a1a" : "#f9f9f9",
    "border-radius": "4px",
    "font-size": "0.95rem",
    color: "inherit",
  },

  // Gutenberg header/footer elements
  "#pg-start-separator": {
    margin: "2rem 0",
    "text-align": "center",
    "font-weight": "bold",
  },
});
