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

## Documentation

*   **`useEpubReader` API Documentation:** The detailed API documentation for the `useEpubReader` hook is located at `docs/api/use-epub-reader.md`. This document should be kept up-to-date with any changes or additions to the `useEpubReader` hook. I must refer to this documentation whenever I need information for implementing new features related to the e-reader functionality.

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
*   **Book Location API:** GET and PUT endpoints for managing book locations.
*   **Highlights API:** GET for getting highlights, POST for adding highlights, PUT for updating highlights, and DELETE for deleting highlights.

## User Preferences

*   **Neovim Config Path:** `~/.config/nvim`

## Roadmap

### Phase 1: Bug Fixes and UI Improvements

*   **TODO (2025-07-17):** Handle book title, page number, and chapter display on mobile devices (`src/components/epub-reader.tsx`).
*   **TODO (2025-07-17):** Fit the cover page with no padding (`src/hooks/use-epub-reader.ts`).
*   **TODO (2025-07-17):** Refactor `src/components/reader-controls-drawer.tsx`: Position button on bottom right, change popover content to a list layout (mobile-specific, similar to Apple Books mobile app).
*   **TODO (2025-07-17):** Implement mobile-specific `onclick` event on the reader: Show the drawer popout button when the user taps the reader; otherwise, hide it.
*   **TODO (2025-07-17):** Implement mobile-specific display for book title, current page, and chapter name when the user taps the reader.
*   **TODO (2025-07-17):** Add swipe next/prev page navigation when on mobile.
*   **TODO (2025-07-22):** Fix delete note when editing.
*   **TODO (2025-07-22):** Refactor `src/components/reader-controls-drawer.tsx` to make it readable and maintainable, create internal reusable components for repeated sections.


### Phase 2: API and Database Integration

*   **Design and Implement a Book API:** Create a robust API for managing books and user data.
*   **Database Schema:** Design and create a database schema for books, users, and annotations.
*   **Migrate Local Storage to API:** Refactor the application to use the new API for all data persistence.

### Phase 3: New Features

*   **User Authentication:** Implement user accounts for data synchronization.
*   **Cloud Storage for Books:** Integrate with a cloud storage service for epub files.
*   **Offline Access:** Implement offline reading capabilities.
*   **Social Features:** Allow users to share annotations and book recommendations.


## Testing Guidelines

### Test Suite Stack

*   **Jest**: The core JavaScript testing framework for running tests.
*   **React Testing Library**: For testing React components in a user-centric way.
*   **Babel**: Used by Jest to transpile TypeScript and JSX code.

### Pre-commit Checks for Tests

*   **ALWAYS** run `pnpm lint` and `pnpm type-check` before every commit. This is mandatory for all code, including tests.
*   **Linting (`pnpm lint`)**: Ensures code style and catches potential errors.
    *   **`@typescript-eslint/no-explicit-any`**: Avoid `any` type in tests. Use specific types or `unknown` with type assertions (`as unknown as Type`) when necessary.
*   **Type Checking (`pnpm type-check`)**: Ensures type safety.
    *   **Jest Global Types**: If `describe`, `it`, `expect`, `jest`, `beforeEach` are not recognized, ensure `@types/jest` is installed (`pnpm add -D @types/jest`) and `"jest"` is included in the `types` array in `tsconfig.json`.
    *   **`@testing-library/jest-dom` Matchers**: For custom matchers like `toBeInTheDocument()`, ensure `/// <reference types="@testing-library/jest-dom" />` is added at the top of your test files.
    *   **Mocking Complex Objects**: When mocking external libraries (e.g., `epubjs` `Book` object), define specific interfaces for your mocks to ensure type compatibility. Use `as unknown as OriginalType` for type assertions if the mock doesn't fully implement the original type.

### Writing Tests

*   **Test File Naming**: Test files should be placed in a `__tests__` directory alongside the code they are testing (e.g., `src/lib/__tests__/epub-utils.test.ts`, `src/components/__tests__/notes-list-popover.test.tsx`).
*   **Test Descriptions**: Use clear and descriptive `describe` and `it` (or `test`) blocks to explain what is being tested.

#### Unit Tests

*   **Purpose**: To test individual functions or modules in isolation.
*   **Isolation**: Mock external dependencies to control their behavior and ensure only the unit under test is being evaluated. Use `jest.fn()` for mocking functions and define mock objects with specific return values.
*   **Setup**: Use `beforeEach` to set up a fresh state for each test, preventing test interference.
*   **Assertions**: Focus on verifying the output of the function or the side effects it produces.

#### Component Tests

*   **Purpose**: To test React components, focusing on their rendered output and how they respond to user interactions.
*   **User-Centric Approach**: Use `@testing-library/react` to test components from the user's perspective. Avoid testing internal state or implementation details.
*   **Rendering**: Use `render` to mount the component into a simulated DOM.
*   **Queries**: Use `screen` queries (e.g., `getByText`, `getByLabelText`, `getByRole`) to find elements as a user would. Use `within(element)` to scope queries to a specific part of the DOM.
*   **Interactions**: Use `fireEvent` to simulate user interactions (e.g., `fireEvent.click`, `fireEvent.change`).
*   **Asynchronous Operations**: Use `waitFor` for assertions that depend on asynchronous updates (e.g., state changes after a click).
*   **Mocking Child Components**: Mock complex child components or external modules to isolate the component under test and speed up tests.

### Reminder for New Features and Refactors

*   **ALWAYS** write tests for new features and refactors.
*   When implementing new features or refactoring existing code, I will **REMIND YOU** to write tests for those changes.
*   Ensure new tests adhere to the guidelines outlined above.
*   Run `pnpm lint` and `pnpm type-check` after writing tests and before committing.
*   Run `pnpm test` to verify that all tests pass.

