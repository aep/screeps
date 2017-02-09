import * as life    from './life';
import * as tq      from './tq';
import * as economy from './economy';
import * as towers  from './towers';
import * as builder   from './builder';
import './tasks';
import './army';

module.exports.loop = function () {

    if (Memory.config == undefined) {
        Memory.config = {}
    }
    if (Memory.config.upgradeWallsTo == undefined) {
        Memory.config.upgradeWallsTo = 100000
    }


    console.log('>',Game.time);
    PathFinder.use(true);
    life.main();
    economy.main();
    tq.main();
    towers.main();
    builder.main();
}
