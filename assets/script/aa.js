// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// 定义了一个类，返回的是一个 类的构造函数
// 继承自 cc.Component
// cc.Class 是一个很常用的 API，用于声明 Cocos Creator 中的类，

cc.Class({
    extends: cc.Component,

    properties: {
	    left: -400,
	    isstart: false,
        foo: {
        default: null,
        type: cc.Node,
        // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
	    console.log("onLoad")
    },

    start () {
      console.log("start")
    },

    update (dt) {
	    console.log("update",this.isstart)
	    if(this.isstart){
		    if(this.left === 400){
				this.left =  -400
			} else {
				this.left = this.left + 20
			}
			this.foo.x = this.left
	    }
    },

    lateUpdate (dt) {
	    console.log("lateUpdate")
    },
    startclick(){
	    this.isstart = true
    }
});
