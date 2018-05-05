Sigil's main library has four functions:

```
// types

enum TaskStatus {
  Pre = -1,
  Triaged = 0,
  Started = 1,
  Aborted = 2,
  Complete = 3,
}

struct Task {
  string refid,
  TaskStatus status,
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
