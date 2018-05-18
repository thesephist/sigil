const fs = require('fs');

const newrefid = () => {
    return (~~(Math.random() * 10e8)).toString(16);
}

const justdate = datetime => {
    return datetime.toISOString().substr(0, 10);
}

const strextract = (source, re, poffset) => {
    const match = source.match(re);

    if (match === null) {
        return null;
    } else {
        const extract = match[1];
        const eidx = source.indexOf(extract);
        const source2 = source.substr(0, eidx + 1 - poffset) + source.substr(eidx + extract.length);

        return {
            extract: extract,
            rest: source2,
        };
    }
}

const parse = taskstr => {
    const parsed = {};
    taskstr = taskstr.trim();

    const TASK_REGEXP = /^{#([A-Za-z\d]+)}\s+\[([:\.\dTp\_\-xv]+)\]\s+([a-z\d\-\/]+)\s+(\d+):\s+(.*)/;
    const [
        _,
        refid,
        statusstr,
        projectstr,
        sizestr,
        rest,
    ] = taskstr.match(TASK_REGEXP);

    parsed.refid = refid;
    const statuses = [];
    for (const [key, anchor] of Object.entries(StatusType)) {
        if (statusstr.includes(anchor)) {
            statuses.push(new StatusEntry({
                type: anchor,
                datetime: new Date(taskstr.substr(taskstr.indexOf(anchor) + 1, 19)),
            }));
        }
    }

    const duematch = strextract(rest, /.*@([\d\-]{10}).*/, 2);
    const duestr = duematch.extract;
    const description = duematch.rest;

    let refmatch;
    let lastmatch = duematch.rest;
    const refs = [];
    while ((refmatch = strextract(lastmatch, /#ref:([A-Za-z\d]+)/, 6)) !== null) {
        refs.push(refmatch.extract);
        lastmatch = refmatch.rest;
    }

    parsed.project = projectstr;
    parsed.size = +sizestr;
    parsed.description = (lastmatch || description).trim().split(' ').join(' ');
    parsed.due = new Date(duestr);
    parsed.refs = refs;

    return parsed;
}

const StatusType = {
    PRE: 'p',
    UNSTARTED: '_',
    INPROG: '-',
    ABORTED: 'x',
    COMPLETE: 'v',
}

class StatusEntry {
    constructor({
        type = StatusType.PRE,
        datetime = new Date(),
    }) {
        this.type = type;
        this.datetime = datetime;
    }
}

class Task {

    constructor({
        refid = newrefid(),
        statuses = [],
        project = '',
        size = 1,
        description = '',
        due = new Date(),
        refs = [],
    }) {
        this.refid = refid;
        this.statuses = statuses;
        this.project = project;
        this.size = size;
        this.description = description;
        this.due = due;
        this.refs = refs;
    }

    serialize() {
        const statusstr = '';
        for (const [anchor, date] of Object.entries(this.statuses)) {
            statusstr += `${anchor}${date.toISOString().substr(0, 20)}`;
        }
        const refstr = this.refs.map(refid => `#ref:${refid}`).join(' ');
        return `{#${this.refid}} [${statusstr}] ${this.project} ${this.size}: ${this.description} @${justdate(this.due)} ${refstr}`;
    }

    static from(taskstr) {
        return new Task(parse(taskstr));
    }

    clone() {
        return new Task(parse(this.serialize()));
    }

}

class Database {

    constructor(file) {
        this.file = file;
        this.tasks = {};
    }

    add(data) {
        let task;
        if (data instanceof Task) {
            task = data;
        } else if (typeof data === 'object') {
            task = new Task(data);
        } else if (typeof data === 'string') {
            task = Task.from(data);
        }

        if (task.refid in this.tasks) {
            // do nothing
        } else {
            this.tasks[task.refid] = task;
        }

        this.write();
    }

    remove(refid) {
        delete this.task[refid];
        this.write();
    }

    serialize() {
        return Object.values(this.tasks)
            .map(t => t.serialize()).join(' ');
    }

    load() {
        const fileContents = fs.readFileSync(this.file, {encoding: 'utf8'});
        const fileContentsList = fileContents.split('{#').map(entry => '{#' + entry);
        for (const taskstr of fileContentsList) {
            this.add(taskstr);
        }
    }

    write() {
        fs.writeFile(this.file, this.serialize(), {encoding: 'utf8'}, (err) => {
            if (err) console.log('Database write error:', err);
        });
    }

    filter() {
        // TODO
    }

}

module.exports = {
    parse,
    Task,
    Database,
}

