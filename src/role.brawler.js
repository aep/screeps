var run =  function(creep) {
    var enemies = creep.room.find(Game.HOSTILE_CREEPS);
    if (enemies.length) {
        if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(enemies[0]);
        }
    } else if (Game.flags.claim) {
        creep.moveTo(Game.flags.claim);
    }
};

module.exports = {run:run};
