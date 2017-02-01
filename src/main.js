var roleHarvester = require('role.harvester');
var roleBrawler   = require('role.brawler');
var roleClaimer   = require('role.claimer');
var defence       = require('defence');
var life          = require('life');

module.exports.loop = function () {

    life.main();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
            case 'builder':
            case 'maintainer':
                roleHarvester.run(creep);
                break;
            case 'brawler':
                roleBrawler.run(creep);
                break;
            case 'claimer':
                roleClaimer.run(creep);
                break;
        }
    }
}
