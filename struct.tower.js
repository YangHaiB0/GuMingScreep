const structTower = {
    run: function (tower) {
        // 寻找需要修复的结构
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        // 修复建组
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        // 攻击敌人
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
};

module.exports = structTower;