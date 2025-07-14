# TSL-E-Shelf Project

This project is a Next.js application for an e-shelf.

## Commands

*   `pnpm dev`: Starts the development server with Turbopack.
*   `pnpm build`: Builds the application for production.
*   `pnpm start`: Starts the production server.
*   `pnpm lint`: Lints the codebase.

## Pre-commit Checks

*   **ALWAYS** run `pnpm lint` and `pnpm type-check` before every commit to ensure code quality. This step is mandatory.
*   Scan the project for TODOs and FIXMEs and update the roadmap in this file.
*   Always wait for explicit instruction on which TODO, FIX, or roadmap item to implement.
*   Do NOT remove any TODO, FIX, or roadmap item from this file without explicit user confirmation.
*   **REMEMBER:** Update `README.md` with new features and development guidelines as they are added.

## Commit Messages

Commit messages must follow the format: `type(scope): description`.

*   **type**: `feat`, `fix`, or `refactor`.
*   **scope**: `reader`, `reader-api`, `settings`, etc.

## Architecture and Naming

*   **State Management:** All global state must be managed in Jotai atoms located in the `src/atoms` directory.
*   **Component Structure:** The `src/components/ui` folder is exclusively for shadcn components. All other custom components should be placed directly in the `src/components` folder.
*   **File Naming:** File names must follow the kebab-case convention (e.g., `example-file.ts`).

## Reader Development Guidelines

*   **Headless API (`useEpubReader`):** The hook at `src/hooks/use-epub-reader.ts` is the headless API for all e-reader functionality.
    *   All reader-related logic (navigation, annotations, search, etc.) MUST be implemented within this hook.
    *   New reader features MUST be added to this hook and exposed through its return value.
*   **Default Client (`EpubReader`):** The component at `src/components/epub-reader.tsx` is the primary client that consumes the `useEpubReader` hook.
    *   This component should contain minimal logic and primarily be responsible for rendering the UI based on the data from the `useEpubReader` hook.
*   **Component Reusability:** Any new UI sections added to the reader MUST be created as reusable React components, following best practices.

## Tech Stack

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **UI:** React, Radix UI, Tailwind CSS
*   **State Management:** Jotai
*   **E-Reader:** epub.js

## Completed Features

*   **Epub Reader:** Core feature for reading pre-loaded epub files.
*   **Reader Customization:** Adjustable font size, line/character/word spacing.
*   **Theme Toggling:** Light and dark mode support.
*   **Table of Contents:** View the book's table of contents.
*   **Book Navigation:** Next/previous page controls.
*   **Recently Visited Books:** Displays a list of recently opened books.
*   **Book Search:** Search for books within the shelf.
*   **Annotations:** Users can add bookmarks, highlights, and notes.

## User Preferences

*   **Neovim Config Path:** `~/.config/nvim`

## Roadmap

### Phase 1: Bug Fixes and UI Improvements


*   **TODO:** Handle book title, page number, and chapter display on mobile devices (`src/components/epub-reader.tsx`).
*   **TODO:** Fit the cover page with no padding (`src/hooks/use-epub-reader.ts`).
*   **TODO:** Refactor `src/components/reader-controls-drawer.tsx`: Position button on bottom right, change popover content to a list layout (mobile-specific, similar to Apple Books mobile app).
*   **TODO:** Implement mobile-specific `onclick` event on the reader: Show the drawer popout button when the user taps the reader; otherwise, hide it.
*   **TODO:** Implement mobile-specific display for book title, current page, and chapter name when the user taps the reader.
*   **TODO:** Add swipe next/prev page navigation when on mobile.
*   **TODO:** Add a main application drawer for navigation (e.g., home, profile) (`src/components/epub-reader.tsx`).
*   **TODO:** When a note is clicked, the edit note dialog should open, and let the user to update the note

### Phase 2: API and Database Integration

*   **Design and Implement a Book API:** Create a robust API for managing books and user data.
*   **Database Schema:** Design and create a database schema for books, users, and annotations.
*   **Migrate Local Storage to API:** Refactor the application to use the new API for all data persistence.

### Phase 3: New Features

*   **User Authentication:** Implement user accounts for data synchronization.
*   **Cloud Storage for Books:** Integrate with a cloud storage service for epub files.
*   **Offline Access:** Implement offline reading capabilities.
*   **Social Features:** Allow users to share annotations and book recommendations.
