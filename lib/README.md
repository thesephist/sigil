# Sigil Core Library

The core library supplies functions necessary to interface with the database through an executable and some command line UIs.

```
// types

struct Task {
  string refid,
  string status,
  string project,
  int size,
  string description,
  datetime d,
  string[] refs,
}

// core library functions

string (refid) sglcreate(
  string database,
  Task newdata,
)

Task sglread(
  string database,
  string refid,
)

int sglupdate(
  string database,
  string refid,
  Task newdata,
)

int sgldelete(
  string database,
  string refid,
)

// global and utility functions

string normalize(
  string task,
) // return a normalized version with correctly formatted date at the end,
  //  omitted default things filled in, normalize tags / lowercase, etc.

Task sgltaskify(
  string task,
)

string sglstringify(
  Task task,
)

Task[] sglfilter(
  string database,
  string condition,
)

string (database) sgldbread(
  string dbpath,
)

int (error code) sgldbwrite(
  string dbpath,
  string database,
)
```

