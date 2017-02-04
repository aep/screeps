function eco(room : Room) {

    //state input
    var te = room.energyCapacityAvailable;
    var cl = room.controller.level;

    //priority issues
    if (room.controller.ticksToDowngrade < 7000) {

    }

    console.log(room, 'economy:', te);
}


module.exports.main = function() {
    for (var i in Game.rooms) {
        var room = Game.rooms[i];
        if (room.controller.my) {
            eco(room);
        }
    }
}
