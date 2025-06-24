import {
  IReaderOverrides,
  IReaderPreferenceConfig,
} from "@/atoms/reader-preferences";

export const getReaderTheme = (
  isDark: boolean, // no longer needed since we use theme config
  preferences: IReaderPreferenceConfig & IReaderOverrides,
) => {
  const {
    backgroundColor,
    textColor,
    textAlign,
    fontFamily,
    fontSize,
    lineHeight,
    isBold,
    characterSpacing,
    wordSpacing,
    margin,
    columns,
  } = preferences;
  console.log("prefs", preferences);

  return {
    body: {
      background: isDark ? backgroundColor.dark : backgroundColor.light,
      color: isDark ? textColor?.dark : textColor.light,
      "font-family": fontFamily,
      "font-size": `${Number(fontSize) || 16}px`, // Ensure number conversion
      "line-height": Number(lineHeight) || 1.5, // Ensure number conversion
      "text-align": textAlign ?? "left",
      padding: "1.5rem 1rem",
      fontWeight: isBold ? "bold" : "normal",
      "letter-spacing": characterSpacing
        ? `${Number(characterSpacing)}px`
        : undefined,
      "word-spacing": wordSpacing ? `${Number(wordSpacing)}px` : undefined,
      columnCount: columns
        ? typeof columns === "string"
          ? parseInt(columns)
          : Number(columns)
        : 1,
      columnGap: columns && Number(columns) > 1 ? "2rem" : undefined,
      margin: margin ? `${margin}px` : undefined,
    },

    // Headings
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

    h3: {
      "font-size": "1.3rem",
      "font-weight": "600",
      "margin-top": "1rem",
      "margin-bottom": "0.5rem",
    },

    // Empty elements
    "p:empty, div:empty": {
      display: "none",
    },

    // Code blocks
    pre: {
      "white-space": "pre-wrap",
      "font-family": "monospace",
      padding: "0.5rem",
      "background-color": isDark ? "#1e1e1e" : "#f5f5f5",
      "border-radius": "4px",
    },

    // Inherited text color
    div: {
      color: "inherit !important",
    },
    span: {
      color: "inherit !important",
    },

    // Links
    a: {
      color: isDark ? "#87b4ff !important" : "#007aff !important",
      "text-decoration": "underline",
      "text-underline-offset": "2px",
    },

    // Tables
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

    // Images
    img: {
      "max-width": "100%",
      height: "auto",
      display: "block",
      margin: "0 auto",
    },

    // Horizontal Rule
    hr: {
      "break-before": "page",
      border: "none",
      "border-top": `1px solid ${isDark ? "#444" : "#ccc"}`,
      margin: "1.5rem 0",
    },

    // Poems
    ".poem": {
      "font-style": "italic",
      "white-space": "pre-wrap",
      "margin-left": "2rem",
    },

    // Blockquote
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

    // Sidenotes
    ".sidenote": {
      border: `1px solid ${isDark ? "#555" : "#ddd"}`,
      padding: "0.5rem",
      "background-color": isDark ? "#1a1a1a" : "#f9f9f9",
      "border-radius": "4px",
      "font-size": "0.95rem",
      color: "inherit",
    },

    // Gutenberg separators
    "#pg-start-separator": {
      margin: "2rem 0",
      "text-align": "center",
      "font-weight": "bold",
    },
  };
};
