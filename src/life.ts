var build = [
    {roles: {worker: 3}},
    {roles: {worker: 3, miner:  1}},
    {roles: {worker: 4, miner:  1}},
    {roles: {worker: 6, miner:  2}},
    {roles: {worker: 6, miner:  2, stop: 1}}
]

var factory = function(spawn : StructureSpawn, role: string) {
    var r = null;
    switch (role) {
        case 'miner':
            r = spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,MOVE], undefined, {role: role});
            break;
        case 'worker':
            //TODO: do something else if we have no creeps and not enough energy
            r = spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: role});
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


    for (let i in  build) {
        let stage = build[i];
        for (let role in stage.roles) {
            if (inRoom[role] < stage.roles[role]) {
                var dbgs = '';
                for (var t in stage.roles) {
                    if (inRoom[t] == undefined) {inRoom[t] = 0}
                    dbgs += t + ': ' + inRoom[t].toString() + '/' + stage.roles[t].toString() + ' ';
                }
                console.log(spawn, 'stage', i, dbgs);

                return factory(spawn, role);
            }
        }
    }
}

var gc = function() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            console.log('Clearing non-existing creep memory:', name);
            let assigned = Memory.assigned;
            for (let j in assigned) {
                if (assigned.creep == name) {
                    delete assigned[j];
                }
            }
            delete Memory.creeps[name];
        }
    }
}

export var main = function() {
    gc();
    for (var i in Game.spawns) {
        create(Game.spawns[i]);
    }
}

