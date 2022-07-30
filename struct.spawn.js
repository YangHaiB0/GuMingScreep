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
let roleLimitDict = {
    ROLE_HARVESTER: 4,
    ROLE_BUILDER: 2,
    ROLE_UPGRADER: 2
};
const baseBody = [WORK, CARRY, MOVE];
const structSpawn = {
    spawn(spawn) {
        this.simpleSpawn(spawn, ROLE_HARVESTER);
        this.simpleSpawn(spawn, ROLE_BUILDER);
        this.simpleSpawn(spawn, ROLE_UPGRADER);
    },
    simpleSpawn(spawn, role) {
        let roleCountDict = spawn.room.memory.count.creep.role;
        if (roleCountDict.role === undefined) {
            roleCountDict.role = 0;
        }
        if (roleCountDict.role < roleLimitDict.role) {
            let newName = role + Game.time;
            let roleBody = this.getRoleBody(role);
            let code = spawn.spawnCreep(roleBody, newName, {memory: {role: role}});
            console.log('Spawning new harvester: ' + newName + ' body:' + baseBody);
            if (code === OK) {
                roleCountDict.role = roleCountDict.role + 1;
            }
        }
        // 如果Spawn正在生产Creep 打印文本
        if (spawn.spawning) {
            let spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});
        }
    },

    /**
     * 重置内存中变量
     *
     * @param {boolean} reset
     */
    gc(reset) {
    },

    /**
     * 通过房间hash初始化数据
     *
     * @param {Game.rooms[i]} roomId
     * @returns
     */
    getInitialData(roomId) {//todo 整理初始化赋值
        let data = {roomIds: roomId, sourceIds: {}};
        for (let name in Game.creeps) {
            creep = Game.creeps[name];
        }
        data.updTime = Game.time;
        return data;
    },

    getRoleBody(spawn, role) {
        let newBody = [];
        let energyCapacityAvailable = spawn.room.energyCapacityAvailable;
        let number = energyCapacityAvailable / 250;
        switch (role) {
            case ROLE_HARVESTER:
                while (number < 1 && newBody.length < baseBody.length * 3) {
                    newBody.concat(baseBody);
                }
                break;
            case ROLE_BUILDER:
                while (number < 1 && newBody.length < baseBody.length * 3) {
                    newBody.concat(baseBody);
                }
                break
            case ROLE_UPGRADER:
                while (number < 1 && newBody.length < baseBody.length * 3) {
                    newBody.concat(baseBody);
                }
                break;
        }
        return baseBody;
    }
};
module.exports = structSpawn;
