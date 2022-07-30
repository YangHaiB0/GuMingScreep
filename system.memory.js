const RoomUtils = require('./utils.room');

module.exports = function () {
    // 重构 console.log
    let logger = console.log;
    let preamble = '#' + Game.time + ' : ';
    console.log = (event) => logger(preamble + ' ' + event);
    //计算GCL
    if (!Memory.gcl) {
        Memory.gcl = 0;
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            if (room.controller && room.controller.my) {
                Memory.gcl++;
            }
        }
    }
    // 初始化变量
    if (!Memory.decon) Memory.decon = {};
    if (!Memory.con) Memory.con = {};
    if (!Memory.rooms) Memory.rooms = {};
    for (let roomName in Game.rooms) {
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = RoomUtils.getInitialData(roomName);
        }
    }
    if (!Memory.towers) Memory.towers = {};
};
Object.defineProperty(Room.prototype, 'sources', {
    get: function () {
        // 如果 room 对象内部没有保存该值
        if (!this._sources) {
            if (!this.memory.sourceIds) {
                this.memory.sourceIds = this.find(FIND_SOURCES).map(source => source.id);
            }
            // 从内存中获取它们的 id 并找到对应的 source 对象，然后保存在 room 对象内部
            this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
            for (let source in this._sources) {
                let targets = source.pos.findInRange(FIND_STRUCTURES,1);
            }
        }
        // 返回内部保存的 source 对象
        return this._sources;
    },
    set: function (newValue) {
        // 当数据保存在内存中时，你会希望在修改 room 上的 source 时
        // 也会自动修改内存中保存的 id 数据
        this.memory.sources = newValue.map(source => source.id);
        this._sources = newValue;
    },
    enumerable: false,
    configurable: true
});