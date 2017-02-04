var targets = {
    economy: {
        harvester:  3,
        builder:    3,
        maintainer: 0,
    },
    army: {
        brawler:   0,
        claimer:   0,
    }
}


var factory = function(spawn : StructureSpawn, role: string) {
    var r = null;
    switch (role) {
        case 'small-harvester':
            r = spawn.createCreep([WORK, CARRY, MOVE], undefined, {role: 'harvester'});
            break;
        case 'builder':
        case 'harvester':
        case 'maintainer':
            r = spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: role});
            break;
        case 'brawler':
            r =spawn.createCreep([ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,MOVE,MOVE,MOVE], undefined, {role: 'brawler'});
            break;
        case 'claimer':
            r =spawn.createCreep([CLAIM,MOVE,MOVE], undefined, {role: 'claimer'});
            break;
    }
    console.log('spawning new', role, r);
    return r;
}

var create = function(spawn : StructureSpawn) {

    var room   = spawn.room;

    var inRoom : any = {};
    var inGame : any = {};

    for (var i in Game.creeps) {
        var creep = Game.creeps[i];

        inGame[creep.memory.role] = inGame[creep.memory.role] ? inGame[creep.memory.role] + 1 : 1
        if (creep.room.name == room.name) {
            inRoom[creep.memory.role] = inRoom[creep.memory.role] ? inRoom[creep.memory.role] + 1 : 1
        }
    }

    var dbgs = '';
    for (var t in targets.economy) {
        if (inRoom[t] == undefined) {inRoom[t] = 0}
        dbgs += t + ': ' + inRoom[t].toString() + '/' + targets.economy[t].toString() + ' ';
    }
    dbgs += "| ";
    for (var t in targets.army) {
        if (inGame[t] == undefined) {inGame[t] = 0}
        dbgs += t + ': ' + inGame[t].toString() + '/' + targets.army[t].toString() + ' ';
    }

    console.log(spawn, dbgs)

    //first creep must be harvester
    if (inRoom.harvester == 0) {
        return factory(spawn, 'small-harvester');
    }

    if(inRoom.harvester < targets.economy.harvester) {
        return factory(spawn,'harvester');
    }

    if(inRoom.builder < targets.economy.builder) {
        return factory(spawn, 'builder');
    }

    if(inRoom.maintainer < targets.economy.maintainer) {
        return factory(spawn,'maintainer');
    }

    if (spawn.name == 'Spawn1') {
        if(inGame.brawler < targets.army.brawler) {
            return factory(spawn,'brawler');
        }

        if(inGame.claimer < targets.army.claimer) {
            return factory(spawn,'claimer');
        }
    }
}

var gc = function() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

export var main = function() {
    gc();
    for (var i in Game.spawns) {
        create(Game.spawns[i]);
    }
}

