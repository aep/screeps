import {Tasks,TaskIs} from './tq';

Tasks['defend'] = {
    make: function(creep : Creep) {
        return {task: 'defend', target: null};
    },
    run: function(creep : Creep, dt : any) {
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS) as [Creep];
        if (enemies.length) {
            if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemies[0]);
            }
        } else if (Game.flags['claim']) {
            creep.moveTo(Game.flags['claim']);
        }
        return TaskIs.Running;
    }
}

Tasks['claim'] = {
    make: function(creep : Creep) {
        return {task: 'claim', target: null};
    },
    run: function(creep : Creep, dt : any) {
        var target = creep.room.controller;
        if (!target.owner) {
            //neutral room
            let r = creep.claimController(target);
            if (r == ERR_GCL_NOT_ENOUGH) {
                creep.say("reserving");
                r = creep.reserveController(target);
            }
            if (r == ERR_NOT_IN_RANGE) {
                r = creep.moveTo(target);
            }
        } else if (!target.my) {
            //foreign room
            if (creep.reserveController(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else if (Game.flags['claim']) {
            creep.moveTo(Game.flags['claim']);
        }
        return TaskIs.Running;
    }
}

