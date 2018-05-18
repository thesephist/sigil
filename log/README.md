# Sigil Log

Sigil log is a utility service that runs independently from the core sigil service and manages an activity log and history of changes.

## `diff.c` library

```
enum ActivityType {
  Delete = -1,
  Read = 0,
  Create = 1,
  Update = 2,
}

class Activity {
  ActivityType type,
  string refid,
  string content, // if delete, null
                        read, null
                        create, the task content
                        update, the new part of the description
}

Activity[] diff(string previous, string next) {
  // return array of Activities that model changes from previous to next
}

string log(Activity activity) {
  // log activity into a human readable string,
  //  one that the API will return to the log / activities endpoint
}
```

