import {Todo} from './tq'

export interface RoomWithEconomy  extends Room {
    economy:  any;
}

class Economy {
    todo: Todo[];


    getFor(creep : Creep) : Todo {
        console.log('...........................');
        console.log(creep, "in", creep.room, "selecting new task from current task list:");
        for (let i in this.todo) {
            let todo = this.todo[i];
            let assigned  = Memory.assigned[todo.target] ? Memory.assigned[todo.target].creep : null;

            if (Number(i) <  5) {
                console.log("  - ", todo.priority, todo.task, Game.getObjectById(todo.target), assigned);
            }
        }
        if (this.todo.length < 1) {
            console.log(creep, 'nothing to do');
            return null;
        }

        let maybe: Todo[] = [];
        let firstPriority = 0;
        for (let m of this.todo) {
            if (Memory.assigned[m.target] != null) {
                continue;
            }
            if (firstPriority == 0 || m.priority == firstPriority) {
                firstPriority = m.priority;
                maybe.push(m);
            }
        }

        console.log(creep, "considering: " )
        for (let i in maybe) {
            let todo = maybe[i];
            if (Number(i) <  5) {
                console.log("  - ", todo.priority, todo.task, Game.getObjectById(todo.target))
            }
        }

        let targets = maybe.map((x) => Game.getObjectById(x.target)) as [RoomObject];
        let closest = creep.pos.findClosestByRange(targets) as any;

        for (let i = 0; i < maybe.length; i++) {
            if (maybe[i].target == closest.id) {
                this.todo.splice(i);
                console.log(creep, "picked: ", maybe[i].priority, maybe[i].task, Game.getObjectById(maybe[i].target))
                return maybe[i];
            }
        }
        console.log(creep, 'could not figure out next task');
        return null;
    }

    constructor(room: RoomWithEconomy) {
        if (!room.controller) {
            return;
        }

        this.todo = []

        if (room.controller.ticksToDowngrade < 7000) {
            this.todo.push({task: 'upgrade', target: room.controller.id, priority: 100});
            this.todo.push({task: 'upgrade', target: room.controller.id, priority: 100});
        } else if (room.controller.ticksToDowngrade < 8000) {
            this.todo.push({task: 'upgrade', target: room.controller.id, priority: 300});
        } else {
            this.todo.push({task: 'upgrade', target: room.controller.id, priority: 900});
        }

        //---

        var structures = room.find(FIND_STRUCTURES) as [Structure]
        for (let target of structures) {

            switch (target.structureType) {
                case STRUCTURE_EXTENSION: {
                    let s = target as StructureExtension;
                    if (s.energy < s.energyCapacity) {
                        this.todo.push({task: 'transfer', target: target.id, priority: 202});
                    }
                    break;
                }
                case STRUCTURE_SPAWN: {
                    let s = target as StructureSpawn;
                    if (s.energy < s.energyCapacity) {
                        this.todo.push({task: 'transfer', target: target.id, priority: 200});
                    }
                    break;
                }
                case STRUCTURE_TOWER: {
                    let s = target as StructureTower;
                    if (s.energy < s.energyCapacity) {
                        this.todo.push({task: 'transfer', target: target.id, priority: 201});
                    }
                    break;
                }
                case STRUCTURE_CONTAINER: {
                    let s = target as StructureContainer;
                    if (s.store.energy< s.storeCapacity) {
                        this.todo.push({task: 'transfer', target: target.id, priority: 1000});
                    }
                    break;
                }
            }
        }


        var sites = room.find(FIND_CONSTRUCTION_SITES) as [ConstructionSite];
        for (let target of sites) {
            this.todo.push({task: 'build', target: target.id, priority: 300})
        }

        //---

        console.log(room, 'economy jobs:' , this.todo.length);
        this.todo = _.sortBy(this.todo, function(t: Todo) {
            return t.priority;
        })
    }
}

export var main = function() {
    if (Memory.assigned == undefined) { Memory.assigned = {} }
    for (let i in Game.rooms) {
        let room = Game.rooms[i] as RoomWithEconomy;
        room.economy = new Economy(room);
    }
}
