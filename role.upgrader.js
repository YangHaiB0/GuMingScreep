const structSpawn = require('./struct.spawn')
const roleUpgrader = {
    run: function (creep) {
        // 默认去工作(执行升级任务)
        if (creep.memory.working === undefined) {
            creep.memory.working = true;
        }
        // 如果需要执行任务 但是身上能量不够 设置不能工作 需要去收集资源
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        // 如果不需要执行任务 但是身上能量满了 设置去工作 执行升级任务
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say('upgrader');
        }
        if (creep.memory.working) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            structSpawn.simpleGetSource(creep);
        }
    }
};

module.exports = roleUpgrader;