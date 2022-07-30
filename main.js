require('./mount')
const RoomsUtils = require('./utils.rooms');
const SpawnUtil = require('./struct.spawn')
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports.loop = function () {
    // 删除过期内存
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    for (let room in Game.rooms) {
        let spawns = room.find(FIND_MY_SPAWNS);
        SpawnUtil.spawn(spawns[0])
        // todo Tower简单控制逻辑
        for (let tower in room.find(FIND_MY_STRUCTURES, {
            filter: struct => {
                return struct.type = STRUCTURE_TOWER
            }
        })) {
            // 寻找需要修复的结构
            let closestDamagedStructure = RoomsUtils.findLowHealthStructures(room, 0.2)
            // 修复建筑
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            // 攻击敌人
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
    // 循环控制Creep行为
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
}
