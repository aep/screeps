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


Tasks['mine'] = {
    make: function(creep : Creep) {
        var room    = creep.room;
        var sources = room.find(FIND_SOURCES) as [Source];
        var source  = sources[hashCode(creep.id) % sources.length];
        return {task: 'mine', source: source.id}
    },
    run: function(creep : Creep, dt : any) {
        var source = Game.getObjectById(dt.source) as Source;
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        return TaskIs.Running;
    }
}

Tasks['drop'] = {
    make: function(creep : Creep) {
        var room    = creep.room;

        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure: StructureContainer) => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < structure.storeCapacity;
            }
        }) as Structure;

        if (!target) {
            return null;
        }
        return {task: 'drop', target: target.id}
    },
    run: function(creep : Creep, dt : any) {
        var target = Game.getObjectById(dt.target) as StructureContainer;

        if (!target) {
            return TaskIs.Done;
        }

        let r = creep.transfer(target, RESOURCE_ENERGY);
        switch (r) {
            case ERR_NOT_IN_RANGE: {
                creep.moveTo(target);
                break;
            }
            case OK:
                break;
            default:
                return TaskIs.Done;
        }
        return TaskIs.Running;
    }
}


Tasks['pickup'] = {
    make: function(creep : Creep) {
        if (creep.carry.energy >= creep.carryCapacity) {
            return null;
        }

        let targets = creep.room.find(FIND_DROPPED_ENERGY) as [Resource];
        if (targets.length < 1) {
            return null;
        }

        var target = targets[Math.floor(Math.random() * targets.length)];
        return {task: 'pickup', target: target.id}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy >= creep.carryCapacity) {
            return TaskIs.Done;
        }

        let target = Game.getObjectById(dt.target) as Resource;
        let r = creep.pickup(target);

        switch (r) {
            case ERR_NOT_IN_RANGE: {
                creep.moveTo(target);
                break;
            }
            case OK : {
                break;
            }
            default: {
                console.log(creep, "[ERR] pickup: ", r);
                return TaskIs.Done;
            }
        }
        return TaskIs.Running;
    }
};


Tasks['take'] = {
    make: function(creep : Creep) {

        if (creep.carry.energy >= creep.carryCapacity) {
            return null;
        }

        let targets = creep.room.find(FIND_MY_CREEPS, {
            filter: (other: Creep) => {
                return other.memory.role == 'miner' && other.carry.energy >= creep.carryCapacity;
            }
        }) as [Creep];

        if (targets.length < 1) {
            return null;
        }

        var target = targets[Math.floor(Math.random() * targets.length)];
        return {task: 'take', target: target.name}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy >= creep.carryCapacity) {
            return TaskIs.Done;
        }

        var target = Game.creeps[dt.target];
        if (!target) {
            return TaskIs.Done;
        }

        if (target.carry.energy <= 0) {
            return TaskIs.Done;
        }

        let r = target.transfer(creep, RESOURCE_ENERGY);

        switch (r) {
            case ERR_NOT_IN_RANGE: {
                creep.moveTo(target);
                break;
            }
            case OK : {
                break;
            }
            default: {
                console.log(creep, "[ERR] take: ", r);
                return TaskIs.Done;
            }
        }
        return TaskIs.Running;
    }
}

Tasks['harvest'] = {
    make: function(creep : Creep) {

        if (creep.carry.energy >= creep.carryCapacity) {
            return null;
        }

        let room    = creep.room;
        let sources = room.find(FIND_SOURCES) as [Source];
        let source  = sources[hashCode(creep.id) % sources.length];
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

Tasks['transfer'] = {
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

        return {task:'transfer', target: target.id}
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
            console.log("transfer: ",target,"already charged");
            return TaskIs.Done;
        }

        let r = creep.transfer(target, RESOURCE_ENERGY);
        switch (r) {
            case ERR_NOT_IN_RANGE: {
                creep.moveTo(target);
                break;
            }
            case OK: {
                break;
            }
            default: {
                console.log("[ERR] creep.transfer: ", r);
                return TaskIs.Done;
            }
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

        return {task:'repair', target: target.id}
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
