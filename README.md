# Sigil

My full-time to-do list and task manager.

## Motivation

I live and die by my to-do list. Before Sigil, I depended on Wunderlist and Evernote for a while, then switched to Todoist for a full 3-4 years before deciding that I wanted my to-do list to be more custom made for my workflow.

## Flat-file database

From the beginning, I deliberately planned Sigil's structure around a flat, plaintext file as the database for all tasks.

1. **We don't need multi-user**: This app is going to support exactly 1 user, behind a custom auth system that lives outside of the app at the proxy level.
2. **Makes syncing, restoring and backup a breeze**: One of my other central workflow tools is Dropbox.
3. **Data readability / portability**: a plaintext file with human-readable syntax means
4. **Lightweight clients**: a plaintext, flat file database means tools like a CLI can be extremely lightweight, not having to carry around the extra baggage of SQLite or full-featured database interfaces in the executable.
5. **Performance considerations**: In the last three years, I've accrued about 10,000 tasks completed with about 100-200 tasks "active" and in constant view at any given time. This means, in my lifetime, a single database file of all tasks I ever complete will not exceed 30MB. Since I also planning on regularly archiving tasks from the "active" file to an archive file, a single-file DB will perform better and take up less space in my use case. Because the active file will almost never exceed 50KB, any performance or memory considerations from keeping the whole file DB in memory or operating on entire files is moot. (Hell, Sigil would run just fine on an Apple IIe!)

## Plain text syntax

Alongside the flat-file database, Sigil will store each task as a single Unicode string, plus an alphanumeric ID. This strikes a balance between human-readable DB file and a syntax that can still be deserialized extremely quickly into a richer task model.

The Unicode string representation of a task is:

```
{#123456abc} [v] project-name/sub-name 3: Work on the Sigil C library #dev #d:2018-05-03 #ref:123456xyz
```

It breaks down this way:

- `{#123456abc}`: Unique task reference ID
- `[v]`: Status of task completion, one of `p` (not triaged), ` ` (not started), `-` (in progress), `x` (aborted), and `v` (complete). The "not triaged" mark is experimental and may be replaced later with an `inbox/` project instead.
- `project-name/sub-name`: Despite Sigil's flat-file DB, tasks are organized into nestable "projects". The project string identifies projects and sub-projects that contains the task.
- `3`: Task size. This is used to denote the relative amount of effort required to complete the task, and is used for productivity analysis and planning.
- `Work on the Sigil C library`: Task description / name. Markdown formatting, including links, is supported here. This may contain any non-control Unicode character, including Emojis and whitespace. If there is a newline or line break here, it will create a literal line break in the DB file, since each task is delimited by the task reference ID.
- `@2018-05-03`: Due date, in the for of ISO date. It's just a date here, but it may optionally contain time and time zone. When being saved, specified times will be standardized into UTC from the client's time zone. This can also alternative be: `every/[weekday|day of month]`, `every2[weekday|day of month]` (every other, etc.), `q` (every quarter), and `q2` or `q[n]` (every n quarters).
- `#ref:123456xyz`: A task may reference any other task as a "related" task, which is a cousin of the notion of "nested tasks".

## Filtering

The syntax of plaintext tasks is designed to allow almost any kind of filtering used frequently to be possible via generic fuzzy-string searches through the plaintext DB.

## Clients

There are currently three clients in the works. They all share a common backend, which will probably be written in C and maybe compiled to WebAssembly.

# Sigil CLI

The CLI will be a wrapper written in Go around the standard C library.

# Sigil Web

The web application has a Go or Node (still deciding) backend built on the C library.

The web app will have two variants: a server-rendered, no-javascript-required version, and a more responsive, but heavier, rich UI version. Both versions will support all UI features.

# Sigil Native (Electron)

The native app is an electron wrapper around the rich UI version web app.

