String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

var findBestSource = function(creep) {
    var room    = creep.room;
    var sources = room.find(FIND_SOURCES)
    var source  = sources[creep.id.hashCode() % sources.length];
    return source.id;
}

var run =  function(creep) {
    if(creep.memory.harvesting && creep.carry.energy >= creep.carryCapacity) {
        creep.memory.harvesting = null;
        console.log(creep, "delivering");
        creep.say('delivering');
    }

    if(!creep.memory.harvesting && creep.carry.energy == 0) {
        creep.memory.harvesting = findBestSource(creep);
        console.log(creep, "harvesting");
        creep.say('harvesting');
    }

    if(creep.memory.harvesting) {
        source = Game.getObjectById(creep.memory.harvesting)
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    } else {
        if (creep.memory.role == 'maintainer') {
            var roadToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(object){
                    return object.hits < (object.hitsMax * 0.8);
                }
            });

            if (roadToRepair){
                if (creep.repair(roadToRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(roadToRepair);
                }
                return;
            }
        }

        if (creep.memory.role == 'harvester') {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                return;
            }
        }

        if (creep.memory.role == 'builder') {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                return;
            }
        }


        //for all harvester sub-roles, if nothing to do, go upgrade the controller
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }

    }
};

module.exports = {run:run};
