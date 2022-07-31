const structSpawn = require('./struct.spawn')
const roleBuilder = {
    run: function (creep) {
        if (creep.memory.working === undefined) {
            creep.memory.working = true;
        }
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        // 不在修筑 且 能量满 ==> 设置内存为 可修建
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }
        if (creep.memory.working) {
            // 如果可修建 寻找结构
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            structSpawn.simpleGetSource(creep);
        }
    }
};

module.exports = roleBuilder;