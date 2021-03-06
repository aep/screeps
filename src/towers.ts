export var main = function() {

    var towers = _.filter(_.values(Game.structures), function (e) {
        return e.structureType == STRUCTURE_TOWER;
    }) as [StructureTower];

    _.forEach(towers, function(tower){
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
        if(closestHostile) {
            tower.attack(closestHostile);
            return;
        }
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure : Structure) => structure.hits < structure.hitsMax && structure.hits < Memory.config.upgradeWallsTo
        }) as Structure;
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
            return;
        }
    })
}
