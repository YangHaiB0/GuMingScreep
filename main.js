const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const structSpawn = require('./struct.spawn')
const structTower = require('./struct.tower')

module.exports.loop = function () {
    // 删除过期内存
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    // Tower控制逻辑
    for (let roomId in Game.rooms) {
        let towers = Game.rooms[roomId].find(FIND_MY_STRUCTURES, {
            filter: struct => {
                return struct.type === STRUCTURE_TOWER
            }
        });
        for (let tower in towers) {
            structTower.run(tower)
        }
    }
    for (let id in Game.spawns) {
        let spawn = Game.spawns[id]
        structSpawn.doSpawnCreep(spawn);
    }
    // 循环控制Creep行为
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === structSpawn.ROLE_HARVESTER) {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === structSpawn.ROLE_UPGRADER) {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === structSpawn.ROLE_BUILDER) {
            roleBuilder.run(creep);
        }
    }
}