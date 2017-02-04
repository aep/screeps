var life          = require('life');
var tq            = require('tq');
var economy       = require('economy');
var towers        = require('towers');


require('tasks');

module.exports.loop = function () {
    life.main();
    economy.main();
    tq.main();
    towers.main();
}
