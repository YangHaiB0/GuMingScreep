ROLE_MY_HARVESTER = "Harvester"
ROLE_MY_BUILDER = "Builder"
ROLE_MY_UPGRADER = "Upgrader"
const roleLimitDict = {
    [ROLE_MY_HARVESTER]: 3,
    [ROLE_MY_BUILDER]: 3,
    [ROLE_MY_UPGRADER]: 1
};
const baseBody = [WORK, CARRY, MOVE];
const structSpawn = {
    ROLE_HARVESTER: ROLE_MY_HARVESTER,
    ROLE_BUILDER: ROLE_MY_BUILDER,
    ROLE_UPGRADER: ROLE_MY_UPGRADER,
    doSpawnCreep(spawn) {
        this.simpleSpawn(spawn, ROLE_MY_HARVESTER);
        this.simpleSpawn(spawn, ROLE_MY_BUILDER);
        this.simpleSpawn(spawn, ROLE_MY_UPGRADER);
    },
    simpleSpawn(spawn, role) {
        if (spawn.room.energyCapacityAvailable > 250) {
            if (spawn.room.memory.count === undefined) {
                spawn.room.memory.count = {}
            }
            if (Game.time % 5 === 0 || spawn.room.memory.count[role] === undefined) {
                let creepList = _.filter(Game.creeps, (creep) => creep.memory.role === role);
                spawn.room.memory.count[role] = creepList.length;
                console.log("Time:" + Game.time + " SetMemory{Room.memory,count[" + role + "]:" + creepList.length + "}");
            }
            if (spawn.room.memory.count[role] < roleLimitDict[role]) {
                let newName = role + Game.time;
                let roleBody = this.getRoleBody(spawn, role);
                let code = spawn.spawnCreep(roleBody, newName, {memory: {role: role}});
                if (code === OK) {
                    console.log('Spawning new harvester: ' + newName + ' body:' + baseBody + "role:" + role);
                }
            }
            // 如果Spawn正在生产Creep 打印文本
            if (spawn.spawning) {
                let spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});
            }
        }
    },
    simpleGetSource(creep) {
        if (creep.room.memory.sources === undefined) {
            let sources = creep.room.find(FIND_SOURCES).map(s => {
                return s.id;
            });
            console.log(sources);
            creep.room.memory.sources = sources;
            console.log("Time:" + Game.time + " SetMemory{Room.memory,sources:" + sources + "}");
        }
        if (creep.memory.target === undefined) {
            creep.memory.target = creep.room.memory.sources[Math.round(Math.random() * 2)];
            console.log("Time:" + Game.time + " SetCreepTarget:" + creep.memory.target);
        }
        if (creep.harvest(Game.getObjectById(creep.memory.target)) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.target));
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
            let creep = Game.creeps[name];
        }
        data.updTime = Game.time;
        return data;
    },

    getRoleBody(spawn, role) {
        let newBody = [];
        let energyCapacityAvailable = spawn.room.energyCapacityAvailable;
        let number = energyCapacityAvailable / 250;
        switch (role) {
            case this.ROLE_HARVESTER:
                while (number < 1 && newBody.length < baseBody.length * 3) {
                    newBody.concat(baseBody);
                }
                break;
            case this.ROLE_BUILDER:
                while (number < 1 && newBody.length < baseBody.length * 3) {
                    newBody.concat(baseBody);
                }
                break
            case this.ROLE_UPGRADER:
                while (number < 1 && newBody.length < baseBody.length * 3) {
                    newBody.concat(baseBody);
                }
                break;
        }
        return baseBody;
    }
};
module.exports = structSpawn;
