# TSL E-Shelf

This project is a Next.js application for an e-shelf, designed to provide a rich e-book reading experience.

## Features

*   **Epub Reader:** Core feature for reading pre-loaded epub files.
*   **Reader Customization:** Adjustable font size, line/character/word spacing.
*   **Theme Toggling:** Light and dark mode support.
*   **Table of Contents:** View the book's table of contents.
*   **Book Navigation:** Next/previous page controls.
*   **Recently Visited Books:** Displays a list of recently opened books.
*   **Book Search:** Search for books within the shelf.
*   **Annotations:** Users can add bookmarks, highlights, and notes.
*   **Image Previews:** Implemented image previews in the reader (custom Tailwind CSS dialog).
*   **Book Images Section:** A section in the reader controls drawer listing all images with descriptions, chapter titles, and page numbers. Clicking an image navigates to its location in the book.

## Tech Stack

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **UI:** React, Radix UI, Tailwind CSS
*   **State Management:** Jotai
*   **E-Reader:** epub.js

## Getting Started

To set up and run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tsl-e-shelf
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4.  **Build for production:**
    ```bash
    pnpm build
    ```

5.  **Start the production server:**
    ```bash
    pnpm start
    ```

## Project Structure

The core application logic resides in the `src` directory:

*   `src/app`: Next.js application routes and API endpoints.
*   `src/atoms`: Jotai atoms for global state management.
*   `src/components`: Reusable React components, with `src/components/ui` specifically for shadcn components.
*   `src/hooks`: Custom React hooks, including `useEpubReader` for all e-reader functionality.
*   `src/lib`: Utility functions and helper modules.

## Development Guidelines

*   **State Management:** All global state must be managed in Jotai atoms located in the `src/atoms` directory.
*   **Component Structure:** The `src/components/ui` folder is exclusively for shadcn components. All other custom components should be placed directly in the `src/components` folder.
*   **File Naming:** File names must follow the kebab-case convention (e.g., `example-file.ts`).
*   **Reader Development:** The `useEpubReader` hook (`src/hooks/use-epub-reader.ts`) is the headless API for all e-reader functionality. All reader-related logic (navigation, annotations, search, etc.) MUST be implemented within this hook. New reader features MUST be added to this hook and exposed through its return value. The `EpubReader` component (`src/components/epub-reader.tsx`) is the primary client that consumes this hook and should contain minimal logic, primarily responsible for rendering the UI.

## Pre-commit Checks

*   **ALWAYS** run `pnpm lint` and `pnpm type-check` before every commit to ensure code quality. This step is mandatory.

## Commit Messages

Commit messages must follow the format: `type(scope): description`.

*   **type**: `feat`, `fix`, or `refactor`.
*   **scope**: `reader`, `reader-api`, `settings`, etc.
