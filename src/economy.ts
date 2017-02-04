import {Todo} from './tq'

export interface RoomWithEconomy  extends Room {
    economy:  any;
}

class Economy {
    todo: Todo[];

    constructor(room: RoomWithEconomy) {
        this.todo = []

        //priority issues
        if (room.controller.ticksToDowngrade < 7000) {
            this.todo.push({task: 'upgrade', target: room.controller.id, priority: 100});
            this.todo.push({task: 'upgrade', target: room.controller.id, priority: 100});
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
                        this.todo.push({task: 'transfer', target: target.id, priority: 201});
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
            }
        }


        var sites = room.find(FIND_CONSTRUCTION_SITES) as [ConstructionSite];
        for (let target of sites) {
            this.todo.push({task: 'build', target: target.id, priority: 300})
        }

        //---

        this.todo = _.sortBy(this.todo, function(t: Todo) {
            return t.priority;
        })

        console.log(room, "current task list:");
        for (let todo of this.todo) {
            console.log("  - ", todo.task, Game.getObjectById(todo.target));
        }
    }
}

export var main = function() {
    for (let i in Game.rooms) {
        let room = Game.rooms[i] as RoomWithEconomy;
        room.economy = new Economy(room);
    }
}
