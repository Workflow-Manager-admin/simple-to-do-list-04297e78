# Supabase Integration Instructions

This application uses a Supabase backend for storing todos. To function correctly, Supabase must be configured with the following:

## Required Table

### Table: `todos`

| Column       | Type      | Required | Default | Description            |
|--------------|-----------|----------|---------|------------------------|
| id           | integer   | Yes      | auto-increment | Unique identifier    |
| task         | text      | Yes      |         | Task description       |
| is_complete  | boolean   | Yes      | false   | Completion status      |
| inserted_at  | timestamp | No       | now()   | (Optional for auditing)|
| updated_at   | timestamp | No       | now()   | (Optional for auditing)|

- `id` is the primary key, auto-incremented.
- `task` is the user-entered todo text.
- `is_complete` indicates whether the task is completed.

## Environment Variables

To connect to Supabase, the following environment variables must be present in your `.env`:

```
REACT_APP_SUPABASE_URL=<your-supabase-url>
REACT_APP_SUPABASE_KEY=<your-anon-key>
```

## How to Set Up

1. Go to your Supabase project.
2. Create a table called `todos` as defined above.
3. Get your `URL` and `anon` public key from Project > Settings > API.
4. Set the above environment variables in your frontend `.env`.
5. Deploy and run the app.

## Usage Notes

- All todo operations (add, update, delete, toggle complete) are done through the `todos` table.
- The frontend will fetch all tasks on load, and after every change.

No user authentication is required.
