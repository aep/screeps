import {RoomWithEconomy} from './economy'

export enum TaskIs{
    Running,
    Done,
    Idle
}


export interface Todo {
    task:       string;
    target:     string;
    priority?:   number;
}


interface Task {
    make(creep: Creep): Todo;
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
        if (!task) {
            return;
        }
        this.creep.memory.tq.unshift(task);
        Memory.assigned[task.target] = {creep: this.creep.name};

        this.creep.say(task.task);
        let target = Game.getObjectById(task.target);
        if (target) {
            let rr = PathFinder.search(this.creep.pos, target.pos, {maxOps: 1000});
            if (!rr.incomplete) {
                this.creep.room.visual.poly(rr.path, {lineStyle: 'dashed', stroke: '#00ffff'});
            }
        }
    }
    run() {
        if (this.creep.memory.tq.length < 1) {
            return TaskIs.Idle;
        }

        var task : Todo = this.creep.memory.tq[this.creep.memory.tq.length - 1];
        var taskRet = Tasks[task.task].run(this.creep, task);
        //console.log(this.creep, task.task, taskRet);

        switch (taskRet) {
            case TaskIs.Done: {
                this.creep.memory.tq.pop();
                Memory.assigned[task.target] = null;
                delete Memory.assigned[task.target];
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
            let tt = Tasks['renew'].make(creep);
            if (tt) {
                cq.add(tt);
                return;
            }
            switch (creep.memory.role) {
                case 'brawler': {
                    cq.add(Tasks['defend'].make(creep));
                    break;
                }
                case 'claimer': {
                    if (Game.flags['claim']) {
                        cq.add(Tasks['claim'].make(creep));
                    }
                    break;
                }
                case 'miner': {
                    if (creep.carry.energy >= creep.carryCapacity) {
                        cq.add(Tasks['drop'].make(creep));
                    }
                    cq.add(Tasks['mine'].make(creep));
                    break;
                }
                case 'worker': {
                    let tt :Todo = null;
                    if (creep.carry.energy <= 0) {
                        tt = Tasks['pickup'].make(creep);
                        if (!tt) {
                            tt = Tasks['take'].make(creep);
                        }
                        if (!tt) {
                            tt = Tasks['harvest'].make(creep);
                        }
                    }
                    if (!tt) {
                        tt = (creep.room as RoomWithEconomy).economy.getFor(creep);
                    }
                    if (!tt) {
                        tt = Tasks['upgrade'].make(creep);
                    }
                    cq.add(tt)
                    break;
                }
            }
        }
    }
}
