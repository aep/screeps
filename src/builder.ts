class RoadBuilderMemory {
    use: any;
}

function weightPaths(room: Room) {
    if (room.memory.roadBuilder == undefined) {
        room.memory.roadBuilder = {}
    }
    if (room.memory.roadBuilder.use == undefined) {
        room.memory.roadBuilder.use = {}
    }
    let mem = room.memory.roadBuilder as RoadBuilderMemory;


    for (let x in mem.use) {
        let xx = mem.use[x];
        for (let y in xx) {
            if (xx[y].use < 1) {
                delete xx[y];
            } else {
                xx[y].use -= 1;
                room.visual.circle(+x, +y, {
                    fill:  xx[y].use > 50000 ?   '#ff0' : '#550',
                    opacity: .001 * xx[y].use
                });
            }
        }
    }
    var used = room.lookForAtArea(LOOK_CREEPS, 0, 0, 49, 49, true);
    for (let u of used) {
        if (mem.use[u.x] == undefined) {
            mem.use[u.x] = {}
        }
        if (mem.use[u.x][u.y] == undefined) {
            mem.use[u.x][u.y] = {use: 1}
        }
        mem.use[u.x][u.y].use += 500;
    }
}


export var main = function() {
    if (Game.time % 5 == 1) {
        for (let i in Game.rooms) {
            weightPaths(Game.rooms[i]);
        }
    }
}
