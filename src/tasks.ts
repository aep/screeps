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


function moveTo(creep: Creep, target: any) : StatusCode{
    return creep.moveTo(target, {visualizePathStyle: {
        stroke: '#fff',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
    }});
}




Tasks['mine'] = {
    make: function(creep : Creep) {
        let room    = creep.room;
        let targets = room.find(FIND_SOURCES) as [Source];

        var target = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (source: Source) => {
                return !Memory.assigned[source.id];
            }
        }) as Source;

        if (!target) {
            return null;
        }
        return {task: 'mine', target: target.id}
    },
    run: function(creep : Creep, dt : any) {
        var target = Game.getObjectById(dt.target) as Source;
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            moveTo(creep,target);
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
                moveTo(creep,target);
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

        var target = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY) as Resource;
        if (!target) {
            return null;
        }
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
                moveTo(creep,target);
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
        }) as [StructureContainer];

        if (targets.length < 1) {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (other: StructureContainer) => {
                    return other.structureType == STRUCTURE_CONTAINER && other.store.energy >= creep.carryCapacity;
                }
            }) as [StructureContainer];
        }
        if (targets.length < 1) {
            return null;
        }


        let target = creep.pos.findClosestByRange(targets) as StructureContainer;
        return {task: 'take', target: target.id}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy >= creep.carryCapacity) {
            return TaskIs.Done;
        }

        var target = Game.getObjectById(dt.target);
        if (!target) {
            console.log(creep, "target not found", dt.target);
            return TaskIs.Done;
        }

        if ((target.carry && target.carry.energy <= 0) || (target.store && target.store.energy <= 0)) {
            console.log(creep, "target is empty");
            return TaskIs.Done;
        }

        let r = target.transfer(creep, RESOURCE_ENERGY);

        switch (r) {
            case ERR_NOT_IN_RANGE: {
                moveTo(creep,target);
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
        let targets = room.find(FIND_SOURCES) as [Source];
        var target = targets[Math.floor(Math.random() * targets.length)];
        return {task: 'harvest', target: target.id}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy >= creep.carryCapacity) {
            return TaskIs.Done;
        }

        var target = Game.getObjectById(dt.target) as Source;
        if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
            moveTo(creep,target);
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
            console.log(creep, "transfer: ", target, "already fully charged");
            return TaskIs.Done;
        }

        let r = creep.transfer(target, RESOURCE_ENERGY);
        switch (r) {
            case ERR_NOT_IN_RANGE: {
                moveTo(creep,target);
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
            moveTo(creep,target);
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
            moveTo(creep,target);
        }

        if (target.hits >= target.hitsMax) {
            return TaskIs.Done;
        }

        return TaskIs.Running;
    }
}

Tasks['upgrade'] = {
    make: function(creep : Creep) {
        return {task: 'upgrade', target: creep.room + '.controller'}
    },
    run: function(creep : Creep, dt : any) {
        if (creep.carry.energy <= 0) {
            return TaskIs.Done;
        }

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            moveTo(creep,creep.room.controller);
        }

        return TaskIs.Running;
    }
}


Tasks['renew'] = {
    make: function(creep : Creep) {
        //TODO renew is actually kinda shit, since it costs the same as spawning
        return null;
        /*
        if (creep.ticksToLive > 500) {
            return null;
        }
        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure: Structure) => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
        }) as StructureSpawn;
        if (!target) {
            return null;
        }
        return {task: 'renew', target: target.id}
        */
    },
    run: function(creep : Creep, dt : any) {
        if (creep.ticksToLive > 500) {
            return TaskIs.Done;
        }

        var target = Game.getObjectById(dt.target) as StructureSpawn;
        if (!target) {
            console.log(creep, "renew: cannot find", dt.target);
            return TaskIs.Done;
        }

        let r = target.renewCreep(creep);
        switch (r) {
            case ERR_NOT_IN_RANGE: {
                moveTo(creep, target);
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
