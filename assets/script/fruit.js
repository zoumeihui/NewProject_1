// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


cc.Class({
    extends: cc.Component,

    properties: {
        id: 0,
        death: false,
        fruitConfig: {
            default: [],
            type: cc.SpriteFrame
        }
    },
    init(id) {
        this.id = id
        const sp = this.node.getComponent(cc.Sprite) // 拿到当前节点的Sprite组件
        sp.spriteFrame = this.fruitConfig[id]

    },
    jump(){
        this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
        const physicsCircleCollider =  this.node.getComponent(cc.PhysicsCircleCollider)
        physicsCircleCollider.radius =  this.node.height / 2
        physicsCircleCollider.apply()
    },
    //定义回调函数 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, selfCollider, otherCollider) {
        if (selfCollider.node && otherCollider.node) {
            const { x, y, width, name } = otherCollider.node
            if(name === 'top' && !this.death){
                this.scheduleOnce(()=>{
                    if(this.node.y > y){
                        selfCollider.node.emit('death')
                    }
                }, 4)
            } else {
                const s = selfCollider.node.getComponent('fruit')
                const o = otherCollider.node.getComponent('fruit')
                if (s && o && s.id === o.id && s.id !== 10) {
                    otherCollider.node.off('sameContact')
                    selfCollider.node.removeFromParent(true)
                    otherCollider.node.removeFromParent(true)

                    this.node.getComponent(cc.AudioSource).play();
                    selfCollider.node.emit('sameContact', {x,y,width,id: o.id});
                }
            }
        }
    }
});
