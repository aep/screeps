var TASK_RET = {
    CONTINUE: 0,
    DONE:     2,
    IDLE:     3
}

function TaskQueue(creep) {
    if (creep.memory.tq == undefined) {
        creep.memory.tq = []
    }
    if (creep.memory.tq.length < 1) {
        creep.memory.tq = [];
    }

    this.run = function() {
        if (creep.memory.tq.length < 1) {
            return TASK_RET.TQ_IDLE;
        }

        task = creep.memory.tq[creep.memory.tq.length - 1];
        if (!Tasks[task.task]) {
            creep.memory.tq.pop();
        } else {
            var taskRet = Tasks[task.task].run(creep, task);
            console.log(creep, task.task, taskRet);
            creep.say(task.task);
            switch (taskRet) {
                case TASK_RET.DONE:
                    creep.memory.tq.pop();
                    break;
            }
        }

        if (creep.memory.tq.length < 1) {
            return TASK_RET.IDLE;
        } else {
            return TASK_RET.CONTINUE;
        }
    }


    this.add = function(task) {
        creep.memory.tq.unshift(task);
    }
}

var Tasks = {}

var main = function() {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        tq = new TaskQueue(creep)
        if (tq.run() === TASK_RET.TQ_IDLE) {
            switch (creep.memory.role) {
                case 'harvester':
                    if (creep.carry.energy == 0) {
                        tq.add(Tasks['harvest'].create(creep));
                    }

                    tq.add(Tasks['deliver'].create(creep) || Tasks['upgrade'].create(creep));
                    break;
                case 'builder':
                    if (creep.carry.energy == 0) {
                        tq.add(Tasks['harvest'].create(creep));
                    }
                    tq.add(Tasks['build'].create(creep) || Tasks['upgrade'].create(creep));
                    break;
                case 'maintainer':
                    if (creep.carry.energy == 0) {
                        tq.add(Tasks['harvest'].create(creep));
                    }
                    tq.add(Tasks['repair'].create(creep) || Tasks['upgrade'].create(creep));
                    break;
            }
        }
    }
}

module.exports = {main:main, Tasks: Tasks, TASK_RET: TASK_RET};
