var run =  function(creep) {
    var controller = creep.room.controller;

    if (!controller.owner) {
        //neutral room
        if (creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
    } else if (controller.owner.username != creep.owner.username) {
        //foreign room
        if (creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
    } else if (Game.flags.claim) {
        creep.moveTo(Game.flags.claim);
    }
};

module.exports = {run:run};
