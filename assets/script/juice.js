// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// 调用 cc.Class，传入一个原型对象，在原型对象中以键值对的形式设定所需的类型参数，就能创建出所需要的类。
const JuiceItem = cc.Class({
    name: 'JuiceItem',
    properties: {
        water: cc.SpriteFrame,
        bg: cc.SpriteFrame,
    }

});
// 以上代码用 cc.Class 创建了一个类型，并且赋给了 FruitItem 变量。同时还将类名设为 "FruitItem"

cc.Class({
    extends: cc.Component,

    properties: {
        juices: {
            default: [],
            type: JuiceItem
        },
        id: 0,
    },
    // 合并时的动画效果
    init(pos, width, id) {
        // 水珠
        for (let f = 0; f < 20; f++) {
            const node = new cc.Node('Sprite');
            const sp = node.addComponent(cc.Sprite);

            sp.spriteFrame = this.juices[id].water;
            node.parent = this.node;

            let a = 359 * Math.random(), i = 30 * Math.random() + width / 2,
                l = cc.v2(Math.sin(a * Math.PI / 180) * i, Math.cos(a * Math.PI / 180) * i);
            node.scale = .5 * Math.random() + width / 100;
            let p = .5 * Math.random();
            node.position = pos
            // spawn 同步执行动作，同步执行一组动作
            node.runAction(
                cc.sequence(
                    cc.spawn(cc.moveBy(p, l), cc.scaleTo(p + .5, .3)), cc.fadeOut(.1),
                    cc.callFunc(() => {
                        node.active = false
                    }, this)
                )
            )
        }

        // 果汁
        const node = new cc.Node('Sprite');
        const sp = node.addComponent(cc.Sprite);

        sp.spriteFrame = this.juices[id].bg;
        node.parent = this.node;

        node.position = pos
        node.scale = 0
        node.angle = Math.floor(Math.random() * 30)
        node.runAction(
            cc.sequence(
                cc.spawn(cc.scaleTo(.2, width / 150), cc.fadeOut(1)),
                cc.callFunc( () => { node.active = false })
            ))
    },
});
