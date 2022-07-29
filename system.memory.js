const RoomUtils = require('./rooms');

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