## Basic operations

- sigil new [... --attrname=content]
  - [alias] sigil n
- sigil update <refid> [... --attrname=content]
  - [alias] sigil u
- sigil get <refid>
  - [alias] sigil g
- sigil rm <refid>
  - [alias] sigil d

# Complex operations
- sigil search [... --attrname=content]
  - sigil search keywords[]
  - [alias] sigil - "search" is the default behavior
  - [alias] sigil search [none] == sigil search today

## Shortcuts

### Date shortcuts

- today (incl. overdue)
- week (incl. overdue)
- 5day (incl. overdue)
- overdue

### Other shortcuts

- sigil postpone <refid> --d=<new iso date>
  - sigil flush (postpone all task, overdue and today, to tomorrow)
- sigil project|proj <project string> (same as sigil search --project=<project string>)

