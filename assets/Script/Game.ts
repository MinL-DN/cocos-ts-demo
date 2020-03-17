// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GAME extends cc.Component {

    // 这个属性引用了星星预制资源
    @property(cc.Prefab)
    starPrefab: cc.Prefab;

    // 地面节点，用于确定星星生成的高度
    @property(cc.Node)
    ground: cc.Node;

    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    @property(cc.Node)
    player: cc.Node;

    // score label 的引用
    @property(cc.Label)
    scoreDisplay: cc.Label;

    // 得分音效资源
    @property(cc.AudioClip)
    scoreAudio: cc.AudioClip;

    // 星星产生后消失时间的随机范围
    @property
    maxStarDuration = 0;
    @property
    minStarDuration = 0;

    // 默认地板高度
    groundY = 0;

    // 初始化计分
    score = 0;

    // 初始化计时器
    timer = 0;
    starDuration = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 生成一个新的星星
        this.spawnNewStar();

        // 初始化计分
        this.score = 0;
    }

    spawnNewStar () {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    }

    gainScore () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;

        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    update (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    gameOver () {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    }
}
