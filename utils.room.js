/**
 * 低血量的结构
 */
let lowHealthStructs = {};
/**
 * 低血量的墙体
 */
let lowHealthWallsAndRamparts = {};

module.exports = {
    /**
     * 重置内存中变量
     * 
     * @param {boolean} reset 
     */
    gc(reset) {
        if (reset || Game.time % 25 === 0) {
            lowHealthStructs = {};
            lowHealthWallsAndRamparts = {};
        }
    },
    /**
     * 通过房间hash初始化数据
     * 
     * @param {Game.rooms[i]} roomId 
     * @returns 
     */
    getInitialData(roomId) {
        let data = { roomIds: roomId, sourceIds: {} };
        Game.rooms[roomId].find(FIND_SOURCES).forEach((source) => {
            data.sourceIds[source.id] = 0;
        });
        data.updTime = Game.time;
        return data;
    },
    /**
     * 血量百分比
     * @returns 
     */
    healthRatio() {
        if (!this.hits || !this.hitsMax) {
            return 1;
        }
        let res = this.hits / this.hitsMax;
        return res;
    },

    /**
     * 找到一个低耐久的结构
     * @param {Room} room 房间
     * @param {number} structureThreshold 结构修理阈值
     * @param {number} roadThreshold 道理修理阈值
     * @returns 
     */
    findLowHealthStructures(room, structureThreshold, roadThreshold = 0.2) {
        let roomName = room.name || room.roomName || room;
        // 非空判断
        if (!lowHealthStructs[roomName] || lowHealthStructs[roomName].length === 0) {
            return;
        }
        // 遍历低血量结构数组
        if (!lowHealthStructs[roomName]) {
            lowHealthStructs[roomName] = room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    // 再次验证是否健康
                    if (!s.hits || !s.hitsMax) {
                        return false;
                    }
                    // 再次排除墙体建筑
                    if ([STRUCTURE_WALL, STRUCTURE_RAMPART].includes(s.structureType)) {
                        return false;
                    }
                    //获取当前结构血量百分比
                    s.healthRatio = this.healthRatio;
                    // 根据传入参数设定的阈值 决定是否修理
                    let threshold = s.structureType === STRUCTURE_ROAD ? roadThreshold : structureThreshold;
                    // 血量低于阈值 => true
                    return s.healthRatio() < threshold;
                },
            });
        }
        // 血量百分比 升序 
        lowHealthStructs[roomName].sort((a, b) => a.healthRatio() - b.healthRatio());
        // 移除最后一个数组元素
        return lowHealthStructs[roomName].pop();
    },
    /**
     * 找到一个低耐久的墙体
     * @param {Room} room 
     * @param {number} desiredHealth 
     * @returns 
     */
    findLowHealthWallsAndRamparts(room, desiredHealth) {
        let roomName = room.name || room.roomName || room;

        if (!lowHealthWallsAndRamparts[roomName]) {
            lowHealthWallsAndRamparts[roomName] = room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.hits < desiredHealth && [STRUCTURE_WALL, STRUCTURE_RAMPART].includes(s.structureType);
                },
            });
            // 排序逻辑 Rempart优先于Wall 
            lowHealthWallsAndRamparts[roomName].sort((a, b) => {
                if (a.hits !== b.hits) return a.hits - b.hits;
                if (a.structureType === b.structureType) return 0;
                if (a.structureType === STRUCTURE_RAMPART) return -1;
                return 1;
            });
        }
        if (!lowHealthWallsAndRamparts[roomName] || lowHealthWallsAndRamparts[roomName].length === 0) {
            return;
        }
        return lowHealthWallsAndRamparts[roomName].pop();
    },
};
