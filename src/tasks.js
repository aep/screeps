var tq = require('tq');

function hashCode (str) {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash);
};

tq.Tasks['harvest'] = {
    create: function(creep) {
        var room    = creep.room;
        var sources = room.find(FIND_SOURCES)
        var source  = sources[hashCode(creep.id) % sources.length];
        return {task: 'harvest', source: source.id}
    },
    run: function(creep, dt) {
        if (creep.carry.energy >= creep.carryCapacity) {
            return tq.TASK_RET.DONE;
        }

        var source = Game.getObjectById(dt.source);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        return tq.TASK_RET.CONTINUE;
    }
}

tq.Tasks['deliver'] = {
    create: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        if(targets.length < 1) {
            return null;
        }

        var target = targets[Math.floor(Math.random() * targets.length)];

        return {task:'deliver', target: target.id}
    },
    run: function(creep, dt) {
        if (creep.carry.energy <= 0) {
            return tq.TASK_RET.DONE;
        }

        var target = Game.getObjectById(dt.target);

        if (!target) {
            return tq.TASK_RET.DONE;
        }

        if (target.energy >= target.energyCapacity) {
            return tq.TASK_RET.DONE;
        }

        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }

        return tq.TASK_RET.CONTINUE;
    }
}

tq.Tasks['build'] = {
    create: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length < 1) {
            return null;
        }

        var target = targets[Math.floor(Math.random() * targets.length)];

        return {task:'build', target: target.id}
    },
    run: function(creep, dt) {
        if (creep.carry.energy <= 0) {
            return tq.TASK_RET.DONE;
        }

        var target = Game.getObjectById(dt.target);

        if (!target) {
            return tq.TASK_RET.DONE;
        }

        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }

        return tq.TASK_RET.CONTINUE;
    }
}


tq.Tasks['repair'] = {
    create: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: function(object){
                return object.hits < (object.hitsMax * 0.8);
            }
        });

        if(targets.length < 1) {
            return null;
        }

        var target = targets[Math.floor(Math.random() * targets.length)];

        return {task:'build', target: target.id}
    },
    run: function(creep, dt) {
        if (creep.carry.energy <= 0) {
            return tq.TASK_RET.DONE;
        }

        var target = Game.getObjectById(dt.target);

        if (!target) {
            return tq.TQ_DONE;
        }

        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }

        if (target.hits >= target.hitsMax) {
            return tq.TQ_DONE;
        }

        return tq.TQ_CONTINUE;
    }
}

tq.Tasks['upgrade'] = {
    create: function(creep) {
        return {task: 'upgrade'}
    },
    run: function(creep, dt) {
        if (creep.carry.energy <= 0) {
            return tq.TASK_RET.DONE;
        }

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }

        return tq.TASK_RET.CONTINUE;
    }
}