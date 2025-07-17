# Backend API Specification for TSL E-Shelf

This document outlines the RESTful API endpoints required from the backend team to support the TSL E-Shelf application. All data currently stored in local storage will be migrated to a database and accessed via these APIs. All endpoints should be secured and require user authentication.

### API Base URL
`https://api.yourdomain.com` (or similar)

### 1. Books (Metadata)

*   **Resource:** `/books`
*   **Description:** Manages book metadata.

    *   **`GET /api/books`**
        *   **Purpose:** Retrieve a list of all available books.
        *   **Response:** `200 OK`
            ```json
            [
              {
                "id": "string",
                "title": "string",
                "author": "string",
                "coverUrl": "string",
                "filename": "string"
              }
            ]
            ```

    *   **`GET /api/books/{bookId}`**
        *   **Purpose:** Retrieve details for a specific book.
        *   **Response:** `200 OK`
            ```json
            {
              "id": "string",
              "title": "string",
              "author": "string",
              "coverUrl": "string",
              "filename": "string"
            }
            ```

### 2. User-Specific Book Data

*   **Description:** These endpoints manage user-specific data associated with a particular book. The user context is assumed to be handled by authentication (e.g., via JWT).

#### 2.1. Book Location/Progress

*   **Resource:** `/books/{bookId}/location`
*   **Description:** Manages the user's current reading location and progress for a book.

    *   **`GET /api/books/{bookId}/location`**
        *   **Purpose:** Retrieve the current reading location and progress for the authenticated user and specified book.
        *   **Response:** `200 OK`
            ```json
            {
              "cfi": "string",
              "progress": 0.0 // Percentage, e.g., 0.5 for 50%
            }
            ```
        *   **Note:** If no location is found, return `200 OK` with `null` or an empty object, or `404 Not Found`.

    *   **`PUT /api/books/{bookId}/location`**
        *   **Purpose:** Update the current reading location and progress for the authenticated user and specified book.
        *   **Request Body:**
            ```json
            {
              "cfi": "string",
              "progress": 0.0
            }
            ```
        *   **Response:** `200 OK` (or `204 No Content`)

#### 2.2. Highlights

*   **Resource:** `/books/{bookId}/highlights`
*   **Description:** Manages highlights made by the user in a specific book.

    *   **`GET /api/books/{bookId}/highlights`**
        *   **Purpose:** Retrieve all highlights for the authenticated user and specified book.
        *   **Response:** `200 OK`
            ```json
            [
              {
                "id": "string", // Backend-generated unique ID for the highlight
                "cfi": "string",
                "text": "string",
                "type": "highlight" | "underline",
                "color": "string", // e.g., "#FFDE63"
                "createdAt": "string" // ISO 8601 timestamp
              }
            ]
            ```

    *   **`POST /api/books/{bookId}/highlights`**
        *   **Purpose:** Add a new highlight for the authenticated user and specified book.
        *   **Request Body:**
            ```json
            {
              "cfi": "string",
              "text": "string",
              "type": "highlight" | "underline",
              "color": "string" // Optional
            }
            ```
        *   **Response:** `201 Created` with the newly created highlight object, including its `id`.

    *   **`PUT /api/books/{bookId}/highlights/{highlightId}`**
        *   **Purpose:** Update an existing highlight (e.g., change color).
        *   **Request Body:**
            ```json
            {
              "color": "string"
            }
            ```
        *   **Response:** `200 OK` (or `204 No Content`)

    *   **`DELETE /api/books/{bookId}/highlights/{highlightId}`**
        *   **Purpose:** Delete a specific highlight.
        *   **Response:** `204 No Content`

    *   **`DELETE /api/books/{bookId}/highlights`**
        *   **Purpose:** Delete all highlights for a specific book and user.
        *   **Response:** `204 No Content`

#### 2.3. Bookmarks

*   **Resource:** `/books/{bookId}/bookmarks`
*   **Description:** Manages bookmarks made by the user in a specific book.

    *   **`GET /api/books/{bookId}/bookmarks`**
        *   **Purpose:** Retrieve all bookmarks for the authenticated user and specified book.
        *   **Response:** `200 OK`
            ```json
            [
              {
                "id": "string", // Backend-generated unique ID
                "cfi": "string",
                "label": "string", // Optional
                "createdAt": "string", // ISO 8601 timestamp
                "chapter": "string", // Chapter title
                "page": 0 // Page number
              }
            ]
            ```

    *   **`POST /api/books/{bookId}/bookmarks`**
        *   **Purpose:** Add a new bookmark for the authenticated user and specified book.
        *   **Request Body:**
            ```json
            {
              "cfi": "string",
              "label": "string", // Optional
              "chapter": "string",
              "page": 0
            }
            ```
        *   **Response:** `201 Created` with the newly created bookmark object, including its `id`.

    *   **`DELETE /api/books/{bookId}/bookmarks/{bookmarkId}`**
        *   **Purpose:** Delete a specific bookmark.
        *   **Response:** `204 No Content`

    *   **`DELETE /api/books/{bookId}/bookmarks`**
        *   **Purpose:** Delete all bookmarks for a specific book and user.
        *   **Response:** `204 No Content`

#### 2.4. Notes

*   **Resource:** `/books/{bookId}/notes`
*   **Description:** Manages notes made by the user in a specific book.

    *   **`GET /api/books/{bookId}/notes`**
        *   **Purpose:** Retrieve all notes for the authenticated user and specified book.
        *   **Response:** `200 OK`
            ```json
            [
              {
                "id": "string", // Backend-generated unique ID
                "cfi": "string",
                "text": "string", // The text the note is associated with
                "note": "string", // The actual note content
                "createdAt": "string" // ISO 8601 timestamp
              }
            ]
            ```

    *   **`POST /api/books/{bookId}/notes`**
        *   **Purpose:** Add a new note for the authenticated user and specified book.
        *   **Request Body:**
            ```json
            {
              "cfi": "string",
              "text": "string",
              "note": "string"
            }
            ```
        *   **Response:** `201 Created` with the newly created note object, including its `id`.

    *   **`PUT /api/books/{bookId}/notes/{noteId}`**
        *   **Purpose:** Update an existing note.
        *   **Request Body:**
            ```json
            {
              "note": "string"
            }
            ```
        *   **Response:** `200 OK` (or `204 No Content`)

    *   **`DELETE /api/books/{bookId}/notes/{noteId}`**
        *   **Purpose:** Delete a specific note.
        *   **Response:** `204 No Content`

    *   **`DELETE /api/books/{bookId}/notes`**
        *   **Purpose:** Delete all notes for a specific book and user.
        *   **Response:** `204 No Content`

### 5. User Preferences

*   **Description:** These endpoints manage general user preferences that are not tied to a specific book. The user context is assumed to be handled by authentication.

#### 5.1. Reader Styles

*   **Resource:** `/user/preferences/reader-styles`
*   **Description:** Manages the authenticated user's preferred reader display styles.

    *   **`GET /api/user/preferences/reader-styles`**
        *   **Purpose:** Retrieve the authenticated user's saved reader style preferences.
        *   **Response:** `200 OK`
            ```json
            {
              "presetName": "string", // e.g., "default", "serif", "sans-serif", "custom"
              "fontSize": "string",   // e.g., "16px", "medium"
              "lineHeight": "string", // e.g., "1.5", "normal"
              "wordSpacing": "string",// e.g., "0px", "normal"
              "letterSpacing": "string" // e.g., "0px", "normal"
            }
            ```
        *   **Note:** If no preferences are found, return `200 OK` with default values or an empty object, or `404 Not Found`.

    *   **`PUT /api/user/preferences/reader-styles`**
        *   **Purpose:** Update the authenticated user's reader style preferences. This should replace all existing preferences with the provided ones.
        *   **Request Body:**
            ```json
            {
              "presetName": "string", // e.g., "default", "serif", "sans-serif", "custom"
              "fontSize": "string",
              "lineHeight": "string",
              "wordSpacing": "string",
              "letterSpacing": "string"
            }
            ```
        *   **Response:** `200 OK` (or `204 No Content`)

### Authentication & Authorization

*   All endpoints should require authentication. A common approach is to use JWT (JSON Web Tokens) passed in the `Authorization` header (e.g., `Authorization: Bearer <token>`).
*   The backend should ensure that users can only access and modify their own data.

### Error Handling

*   Standard HTTP status codes should be used for responses (e.g., `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).
*   Error responses should include a clear message and potentially an error code.
