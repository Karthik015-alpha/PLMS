# PLMS Database Tables

Supabase project URL: `https://btcojfdnjizylgzyccgc.supabase.com`

## Public schema tables

---

## `public.users`

Application-level users table.

### Columns

- `id` uuid PRIMARY KEY
- `email` text UNIQUE
- `display_name` text
- `avatar_url` text
- `metadata` jsonb DEFAULT '{}'
- `created_at` timestamptz DEFAULT now()
- `updated_at` timestamptz DEFAULT now()

### Indexes

- `lower(email)`

### Trigger

- `users_set_timestamp`

---

## `public.subjects`

Learning subjects created by users.

### Columns

- `id` uuid PRIMARY KEY
- `owner` uuid REFERENCES `public.users(id)`
- `name` text NOT NULL
- `slug` text NOT NULL
- `description` text
- `metadata` jsonb DEFAULT '{}'
- `created_at` timestamptz DEFAULT now()
- `updated_at` timestamptz DEFAULT now()
- `deleted_at` timestamptz

### Constraints

- Unique: `(owner, slug)`

### Indexes

- `owner`
- `lower(slug)`
- `metadata gin`
- `name gin_trgm_ops`

### Trigger

- `subjects_set_timestamp`

---

## `public.topics`

Topics/modules inside a subject.

### Columns

- `id` uuid PRIMARY KEY
- `subject_id` uuid NOT NULL REFERENCES `public.subjects(id)`
- `name` text NOT NULL
- `slug` text NOT NULL
- `description` text
- `position` integer DEFAULT 0
- `metadata` jsonb DEFAULT '{}'
- `created_at` timestamptz DEFAULT now()
- `updated_at` timestamptz DEFAULT now()

### Constraints

- Unique: `(subject_id, slug)`

### Indexes

- `subject_id`
- `(subject_id, position)`
- `metadata gin`
- `name gin_trgm_ops`
- `lower(slug)`

### Trigger

- `topics_set_timestamp`

---

## `public.tasks`

Planner tasks and study goals.

### Columns

- `id` uuid PRIMARY KEY
- `subject_id` uuid REFERENCES `public.subjects(id)`
- `topic_id` uuid REFERENCES `public.topics(id)`
- `title` text NOT NULL
- `short` text
- `details` text
- `status` `task_status` DEFAULT 'todo'
- `priority` `priority_level` DEFAULT 'medium'
- `estimate_minutes` integer CHECK >= 0
- `due_date` date
- `order_key` numeric DEFAULT 0
- `tags` text[] DEFAULT []
- `metadata` jsonb DEFAULT '{}'
- `created_at` timestamptz DEFAULT now()
- `updated_at` timestamptz DEFAULT now()
- `search_vector` tsvector GENERATED ALWAYS AS combined text search

### Indexes

- `subject_id`
- `topic_id`
- `(status, priority, due_date)`
- `(topic_id, order_key)`
- `tags gin`
- `search_vector gin`
- `metadata gin`
- `due_date WHERE due_date IS NOT NULL`

### Trigger

- `tasks_set_timestamp`

---

## `public.notes_metadata`

Metadata for TXT, Markdown, and PDF notes.

### Columns

- `id` uuid PRIMARY KEY
- `owner` uuid REFERENCES `public.users(id)`
- `title` text
- `bucket` text NOT NULL
- `path` text NOT NULL
- `filename` text
- `filesize` bigint
- `content_type` text
- `linked_subject` uuid REFERENCES `public.subjects(id)`
- `linked_topic` uuid REFERENCES `public.topics(id)`
- `linked_task` uuid REFERENCES `public.tasks(id)`
- `metadata` jsonb DEFAULT '{}'
- `created_at` timestamptz DEFAULT now()
- `updated_at` timestamptz DEFAULT now()

### Constraints

- Unique: `(bucket, path)`

### Indexes

- `owner`
- `linked_task`
- `metadata gin`
- `title search`
- `linked_subject`
- `linked_topic`
- `filename gin_trgm_ops`
- `path gin_trgm_ops`

### Trigger

- `notes_metadata_set_timestamp`

---

## `public.progress`

Tracks subject/task progress for users.

### Columns

- `id` uuid PRIMARY KEY
- `user_id` uuid NOT NULL REFERENCES `public.users(id)`
- `task_id` uuid REFERENCES `public.tasks(id)`
- `subject_id` uuid REFERENCES `public.subjects(id)`
- `value` numeric CHECK 0..100
- `is_completed` boolean DEFAULT false
- `note_id` uuid REFERENCES `public.notes_metadata(id)`
- `started_at` timestamptz
- `updated_at` timestamptz DEFAULT now()
- `created_at` timestamptz DEFAULT now()

### Constraints

- Unique: `(user_id, task_id)`

### Indexes

- `user_id`
- `task_id`
- `subject_id`
- `(user_id, is_completed)`
- `(task_id, is_completed)`

### Trigger

- `progress_set_timestamp`

---

# Public Views

## `public.subject_progress`

Aggregated subject progress view.

### Columns

- `subject_id`
- `total_tasks`
- `completed_by_user`

---

# Custom Enum Types

## `task_status`

```txt
todo
in_progress
blocked
review
done
cancelled
```

---

## `priority_level`

```txt
low
medium
high
critical
```

---

# Notes Storage Architecture

TXT, Markdown, and PDF files are stored using:

- Supabase Storage Buckets
- `public.notes_metadata` stores metadata
- File paths are linked with subjects/topics/tasks

---

# Recommended Architecture

```txt
public.users
    ↓
subjects
    ↓
topics
    ↓
tasks
    ↓
progress

notes_metadata
    ↘ linked to subjects/topics/tasks
```

---

# Search Support

The database supports:

- Full-text task search
- Trigram search
- Metadata filtering
- GIN indexes
- Search vectors

---

# Features Enabled by Current Schema

- Subject/topic management
- Planner/task management
- Progress tracking
- TXT notes
- Markdown notes
- PDF uploads
- Search system
- Analytics dashboards
- Study streaks
- Task ordering
- Advanced filtering