/**
 * 低血量的墙体
 */
const ROLE_HARVESTER = "Harvester"
const ROLE_BUILDER = "Builder"
const ROLE_UPGRADER = "Upgrader"
const ROLE_LIMIT = [
    {
        role: ROLE_HARVESTER,
        limit: 4,
        energy: 250,
        body: [WORK, CARRY, MOVE]
    }, {
        role: ROLE_BUILDER,
        limit: 2,
        energy: 250,
        body: [WORK, CARRY, MOVE]
    }, {
        role: ROLE_UPGRADER,
        limit: 2,
        energy: 250,
        body: [WORK, CARRY, MOVE]
    }
]
let screepArray = {};
const structSpawn = {
    simpleSpawn(spawn) {
        // todo 获得缓存中 Memory.rooms[roomName].count.${role} 

        // Creep角色不足2时 生产一个简易Creep
        ROLE_LIMIT
        if (harvesters.length < 2) {
            let newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } });
        }
        // 如果Spawn正在生产Creep 打印文本
        if (spawn.spawning) {
            let spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, spawn.pos.y, { align: 'left', opacity: 0.8 });
        }
    },

    /**
     * 重置内存中变量
     * 
     * @param {boolean} reset 
     */
    gc(reset) {
        if (reset || Game.time % 25 === 0) {
            screepArray = {};
        }
    },

    /**
     * 通过房间hash初始化数据
     * 
     * @param {Game.rooms[i]} roomId 
     * @returns 
     */
    getInitialData(roomId) {//todo 整理初始化赋值
        let data = { roomIds: roomId, sourceIds: {} };
        for (let name in Game.creeps) {
            creep = Game.creeps[name];
        }
        data.updTime = Game.time;
        return data;
    },
};
module.exports = structSpawn;