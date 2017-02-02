var life          = require('life');
var tq            = require('tq');

require('tasks');


module.exports.loop = function () {
    life.main();
    tq.main();
}
