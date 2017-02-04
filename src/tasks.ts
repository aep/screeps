import {Tasks,TaskIs} from './tq';

function hashCode (str : string) {
    if (str === undefined)
        return 0;
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash);
};

Tasks['harvest'] = {
    make: function(creep : Creep) {
        var room    = creep.room;
        var sources = room.find(FIND_SOURCES) as [Source];
        var source  = sources[hashCode(creep.id) % sources.length];
        return {task: 'harvest', source: source.id}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy >= creep.carryCapacity) {
            return TaskIs.Done;
        }

        var source = Game.getObjectById(dt.source) as Source;
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        return TaskIs.Running;
    }
}

Tasks['deliver'] = {
    make: function(creep: Creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure: StructureSpawn | StructureTower) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        }) as [Structure];

        if(targets.length < 1) {
            return null;
        }

        var target = targets[Math.floor(Math.random() * targets.length)];

        return {task:'deliver', target: target.id}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy <= 0) {
            return TaskIs.Done;
        }

        var target = Game.getObjectById(dt.target);

        if (!target) {
            return TaskIs.Done;
        }

        if (target.energy >= target.energyCapacity) {
            return TaskIs.Done;
        }

        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }

        return TaskIs.Running;
    }
}

Tasks['build'] = {
    make: function(creep : Creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES) as [ConstructionSite];
        if(targets.length < 1) {
            return null;
        }

        var target = targets[Math.floor(Math.random() * targets.length)];

        return {task:'build', target: target.id}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy <= 0) {
            return TaskIs.Done;
        }

        var target = Game.getObjectById(dt.target);

        if (!target) {
            return TaskIs.Done;
        }

        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }

        return TaskIs.Running;
    }
}


Tasks['repair'] = {
    make: function(creep : Creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: function(object: Structure){
                return object.hits < (object.hitsMax * 0.8);
            }
        }) as [Structure];

        if(targets.length < 1) {
            return null;
        }

        var target = targets[Math.floor(Math.random() * targets.length)];

        return {task:'build', target: target.id}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy <= 0) {
            return TaskIs.Done;
        }

        var target = Game.getObjectById(dt.target);

        if (!target) {
            return TaskIs.Done;
        }

        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }

        if (target.hits >= target.hitsMax) {
            return TaskIs.Done;
        }

        return TaskIs.Running;
    }
}

Tasks['upgrade'] = {
    make: function(creep : Creep) {
        return {task: 'upgrade'}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy <= 0) {
            return TaskIs.Done;
        }

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }

        return TaskIs.Running;
    }
}
