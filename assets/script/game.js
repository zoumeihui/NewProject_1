// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        fruitCount: 0,
        fruitPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        juicePrefab: {
            default: null,
            type: cc.Prefab
        },
        DeathNode:{
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 物理系统默认是关闭的，如果需要使用物理系统，那么首先需要做的事情就是开启物理系统，否则你在编辑器里做的所有物理编辑都不会产生任何效果。
        // 默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统：
        const instance = cc.director.getPhysicsManager()
        instance.enabled = true
        // 设置物理重力, 每秒加速降落 960 个世界单位
        instance.gravity = cc.v2(0, -960);
        // 碰撞检测
        const collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true

        // 添加第一个水果
        this.initOneFruit()

        // 监听函数
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    },
    // 监听屏幕点击
    onTouchStart(e) {
        if (this.isCreating) return
        this.isCreating = true

        const { width } = this.node
        const fruit = this.currentFruit
        const pos = e.getLocation() // 获取当前触点位置
        let { x } = pos
        x = x - width / 2 // 原点是
        const move1 = cc.moveBy(0.3, cc.v2(x, 0)).easing(cc.easeCubicActionIn())

        // sequence 顺序执行动作，创建的动作将按顺序依次运行。
        // callFunc 执行回调函数，用这个包一下就能放在sequence执行了
        const action = cc.sequence(move1, cc.callFunc(() => {
            fruit.getComponent('fruit').jump()
            this.scheduleOnce(() => {
                let nextId =  Math.floor(Math.random() * 5) + 1
                if (this.fruitCount < 3) {
                    nextId =  1
                } else if (this.fruitCount === 3) {
                    nextId = 2
                }
                this.initOneFruit(nextId)
                this.isCreating = false
            }, 1)
        }))
        // 执行并返回该执行的动作
        fruit.runAction(action)
    },

    initOneFruit(id = 0) {
        this.fruitCount ++
        this.currentFruit = this.createFruitOnPos(0, 400, id)
    },

    createFruitOnPos(x, y, id = 0) {
        const fruit = cc.instantiate(this.fruitPrefab);
        fruit.getComponent('fruit').init(id);
        fruit.setPosition(cc.v2(x, y));
        this.node.addChild(fruit);
        fruit.on('sameContact', this.onSameFruitContact.bind(this))
        fruit.on('death', this.death.bind(this))
        return fruit;
    },
    onSameFruitContact({ width, x, y, id }) {
        // 生成下一级，并为这个刚生成的物体开启检测
        const nextId = id + 1
        if (nextId <= 11) {
            const next = this.createFruitOnPos(x, y, nextId)
            next.getComponent('fruit').jump()
        }
        // 得分
        this.scoreLabel.string = Number(this.scoreLabel.string) +  (id + 1) * 2
        // 合并时的动画效果
        this.createFruitJuice(id, cc.v2({x, y}), width)
    },
    // 合并时的动画效果
    createFruitJuice(id, pos, n) {
        // 展示动画
        let juice = cc.instantiate(this.juicePrefab);
        this.node.addChild(juice);
        juice.getComponent('juice').init(pos, n, id)
    },
    death(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.DeathNode.setPosition(cc.v2(0,0));
    },
    restart(){
       cc.game.restart()
    }
});
