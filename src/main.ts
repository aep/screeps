import * as life    from './life';
import * as tq      from './tq';
import * as economy from './economy';
import * as towers  from './towers';
import './tasks';

module.exports.loop = function () {
    life.main();
    economy.main();
    tq.main();
    towers.main();
}
