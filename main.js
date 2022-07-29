require('./mount')
const RoomsUtils = require('./utils.rooms');
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
        // todo Tower简单控制逻辑
        let tower = Game.getObjectById('5edd05b2dbbd346f5a921d1f');
        if (tower) {
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