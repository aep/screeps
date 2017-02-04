var tq : any = {};

enum TaskIs{
    Running,
    Done,
    Idle
}
tq.TaskIs = TaskIs;

interface StoredTask {
    task: string
}

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

    add(task: StoredTask) {
        this.creep.memory.tq.unshift(task);
    }
    run() {
        if (this.creep.memory.tq.length < 1) {
            return TaskIs.Idle;
        }

        var task : StoredTask = this.creep.memory.tq[this.creep.memory.tq.length - 1];
        if (!tq.Tasks[task.task]) {
            this.creep.memory.tq.pop();
        } else {
            var taskRet = tq.Tasks[task.task].run(this.creep, task);
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

tq.Tasks = {}
tq.main = function() {
    for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        var cq = new TaskQueue(creep);

        if (cq.run() === TaskIs.Idle) {
            switch (creep.memory.role) {
                case 'upgrader':
                    if (creep.carry.energy == 0) {
                        cq.add(tq.Tasks['harvest'].create(creep));
                    }

                    cq.add(tq.Tasks['upgrade'].create(creep));

                case 'harvester':
                    if (creep.carry.energy == 0) {
                        cq.add(tq.Tasks['harvest'].create(creep));
                    }

                    cq.add(tq.Tasks['deliver'].create(creep) || tq.Tasks['upgrade'].create(creep));
                    break;
                case 'builder':
                    if (creep.carry.energy == 0) {
                        cq.add(tq.Tasks['harvest'].create(creep));
                    }
                    cq.add(tq.Tasks['build'].create(creep) || tq.Tasks['upgrade'].create(creep));
                    break;
                case 'maintainer':
                    if (creep.carry.energy == 0) {
                        cq.add(tq.Tasks['harvest'].create(creep));
                    }
                    cq.add(tq.Tasks['repair'].create(creep) || tq.Tasks['upgrade'].create(creep));
                    break;
            }
        }
    }
}


module.exports = tq;
