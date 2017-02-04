import {RoomWithEconomy} from './economy'

export enum TaskIs{
    Running,
    Done,
    Idle
}


export interface Todo {
    task:       string;
    target:     string;
    priority:   number;
}


interface Task {
    make(creep: Creep): any;
    run(creep: Creep, stored: Todo):  TaskIs;
}

export var Tasks : {[key:string]:Task} = {};


class TaskQueue {
    creep : Creep;
    constructor(creep : Creep) {
        this.creep = creep;
        if (creep.memory.tq == undefined) {
            creep.memory.tq = []
        }
        if (creep.memory.tq.length < 1) {
            creep.memory.tq = [];
        }
    }

    add(task: Todo) {
        this.creep.memory.tq.unshift(task);
    }
    run() {
        if (this.creep.memory.tq.length < 1) {
            return TaskIs.Idle;
        }

        var task : Todo = this.creep.memory.tq[this.creep.memory.tq.length - 1];
        if (!Tasks[task.task]) {
            this.creep.memory.tq.pop();
        } else {
            var taskRet = Tasks[task.task].run(this.creep, task);
            console.log(this.creep, task.task, taskRet);
            this.creep.say(task.task);
            switch (taskRet) {
                case TaskIs.Done:
                    this.creep.memory.tq.pop();
                break;
            }
        }

        if (this.creep.memory.tq.length < 1) {
            return TaskIs.Idle;
        } else {
            return TaskIs.Running;
        }
    }
}


export var main = function() {
    for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        var cq = new TaskQueue(creep);

        if (cq.run() === TaskIs.Idle) {
            switch (creep.memory.role) {
                case 'worker':
                    if (creep.carry.energy == 0) {
                        cq.add(Tasks['harvest'].make(creep));
                        continue;
                    }
                    let tt = (creep.room as RoomWithEconomy).economy.todo.shift();
                    if (tt) {
                        cq.add(tt)
                    } else {
                        cq.add(Tasks['upgrade'].make(creep));
                    }

                    break;
            }
        }
    }
}
