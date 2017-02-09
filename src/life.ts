interface BuildStage {
    name: string;
    requires: {
        level?: number;
        energyCapacity?: number;
        spawn?: any;
    };
    spawn: [any];
    army: any[];
    build: [any];
}


var build : [BuildStage] = [
    {
        name: 'start',
        requires: {
            level: 1,
            energyCapacity: 1
        },
        army: [
        ],
        spawn: [
            {worker: 3},
            {miner:  1}
        ],
        build: [
            {extention: 5}
        ]
    },
    {
        name: 'extend4',
        requires: {
            spawn: {
                worker: 2,
                miner: 1
            },
            level: 3,
            energyCapacity: 500 + 300
        },
        spawn: [
            {worker: 3},
            {miner:  1},
            {worker: 5},
            {miner:  2},
        ],
        army: [
            {brawler: 1},
            {claimer: 1},
        ],
        build: [
            {extention: 10}
        ]
    },
    {
        name: 'expand1',
        requires: {
            spawn: {
                worker: 2
            },
            level: 4,
            energyCapacity: 500 + 500 + 300
        },
        spawn: [
            {worker: 5},
            {miner:  2}
        ],
        army: [
            {brawler: 4},
            {claimer: 2},
        ],
        build: [
            {extention: 20}
        ]
    },
]


var debugSigns = {
    worker: '\u2699',
    miner:  '\u2692',
    brawler: '\u2694',
    claimer: '\u2690',
}

var factory = function(spawn : StructureSpawn, role: string, stage: BuildStage) {
    var r = null;
    switch (role) {
        case 'miner': {
            r = spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,MOVE], undefined, {role: role});
            break;
        }
        case 'worker': {
            if (stage.requires.energyCapacity >= 700) {
                r = spawn.createCreep([WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: role});
            } else {
                r = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: role});
            }

            break;
        }
        case 'brawler': {
            r =spawn.createCreep([ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,MOVE,MOVE,MOVE], undefined, {role: role});
            break;
        }
        case 'claimer': {
            r =spawn.createCreep([CLAIM,MOVE,MOVE], undefined, {role: role});
            break;
        }
    }
    console.log('spawning new', role, r);
    return r;
}

var implementStage = function(spawn : StructureSpawn, stage: BuildStage, inRoom: any, inGame: any) {
    for (let o of stage.spawn) {
        for (let role in o) {
            if (!inRoom[role]) { inRoom[role] = 0; }
            if (inRoom[role] < o[role]) {
                let r = factory(spawn, role, stage);
                console.log(spawn, 'spawn ' + role, r);
                return;
            }
        }
    }
    for (let o of stage.army) {
        for (let role in o) {
            if (!inGame[role]) { inGame[role] = 0; }
            if (inGame[role] < o[role]) {
                let r = factory(spawn, role, stage);
                console.log(spawn, 'spawn ' + role, r);
                return;
            }
        }
    }
    return true;
}

var visualizeStage = function(spawn : StructureSpawn, stage: BuildStage, inRoom: any, inGame: any) {
    spawn.room.visual.text(
        "\u263C " + stage.name.toString(), spawn.pos.x + 1.1, spawn.pos.y - 1,
        {align:"left", size: '0.5'}
    );



    let roles : any = {};
    for (let o of stage.spawn.concat(stage.army)) {
        for (let t in o) {
            roles[t] =  o[t];
        }
    }

    let j = 0;
    for (let t in roles) {
        if (inRoom[t] == undefined) {inRoom[t] = 0}
        if (inGame[t] == undefined) {inGame[t] = 0}

        let dbgs = inGame[t].toString() + '/' + inRoom[t].toString() + '/' +  roles[t].toString() + ' ' ;
        if (debugSigns[t]) {
            dbgs += debugSigns[t];
        } else {
            dbgs += t[0];
        }

        spawn.room.visual.text(dbgs, spawn.pos.x + 1.1, spawn.pos.y + j, {align:"left", size: '0.5'});
        j += 1;
    }
}


var eco = function(spawn : StructureSpawn) {
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

    let thisStage : any = null;
    for (let i in build) {
        let stage = build[i];

        let haveAllTheRoles = true;
        for (let rr in stage.requires.spawn) {
            if (inRoom[rr] == undefined) {inRoom[rr] = 0}
            if (inGame[rr] == undefined) {inGame[rr] = 0}
            if (inRoom[rr] < stage.requires.spawn[rr]) {
                haveAllTheRoles = false;
            }
        }

        if (
            !haveAllTheRoles ||
            stage.requires.energyCapacity > spawn.room.energyCapacityAvailable ||
            stage.requires.level          > spawn.room.controller.level
        ) {
            break;
        } else {
            thisStage = stage;
        }
    }
    visualizeStage(spawn, thisStage, inRoom, inGame);
    return implementStage(spawn, thisStage, inRoom, inGame);
}

var gc = function() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            console.log('Clearing non-existing creep memory:', name);
            let assigned = Memory.assigned;
            for (let j in assigned) {
                if (assigned[j].creep == name) {
                    delete assigned[j];
                }
            }
            delete Memory.creeps[name];
        }
    }
    //every 100 ticks, check memory consistency
    if (Game.time % 100 == 0) {
        for (var i in Memory.assigned) {
            if (!Game.creeps[Memory.assigned[i].creep]) {
                Memory.assigned[i] = null;
            }
        }
    }
}

export var main = function() {
    gc();
    for (var i in Game.spawns) {
        eco(Game.spawns[i]);
    }
}

