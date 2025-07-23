# Supabase Integration Instructions

This application uses a Supabase backend for storing todos. The Supabase project has been configured as follows for this frontend:

## Configured Table

### Table: `todos`

| Column       | Type                  | Required | Default          | Description            |
|--------------|-----------------------|----------|------------------|------------------------|
| id           | integer (PK)          | Yes      | auto-increment   | Unique identifier      |
| task         | text                  | Yes      |                  | Task description       |
| is_complete  | boolean               | Yes      | false            | Completion status      |
| inserted_at  | timestamp with tz     | No       | now()            | (Optional audit)       |
| updated_at   | timestamp with tz     | No       | now()            | (Optional audit)       |

- `id` is the primary key, auto-incremented (using a sequence, set as default).
- `task` is the user-entered todo text.
- `is_complete` indicates whether the task is completed.
- `inserted_at` and `updated_at` default to the current timestamp.

## Row-Level Security (RLS) and Permissions

- **Row Level Security is ENABLED** on the `todos` table.
- A policy **"Allow full access to todos"** is configured:
  - Anyone (including unauthenticated/public users) can `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rows in the `todos` table.
  - **No authentication is required** for any database operation on todos.

> If you want to restrict access in the future, update/remove the RLS policy accordingly.

## Environment Variables

To connect to Supabase, the following environment variables must be present in your `.env` (already referenced by the frontend at build time):

```
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_KEY=<your-anon-key>
```

## How to Set Up (summarized)

1. Supabase is configured (see above). If recreating, follow the schema and RLS notes.
2. Get your `URL` and `anon` public key from Project > Settings > API.
3. Set the above environment variables in your frontend `.env`.
4. Deploy and run the app.

## Usage Notes

- All todo operations (add, update, delete, toggle complete) are done through the `todos` table.
- The frontend will fetch all tasks on load, and after every change.
- **No user authentication or API keys beyond the anon public key are required.**

---
_Last configured and validated: backend, table schema and permissions for public CRUD with Supabase. 2024/06_
