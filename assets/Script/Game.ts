// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Player from './Player';

@ccclass
export default class GAME extends cc.Component {

    @property(cc.Prefab) starPrefab: cc.Prefab = null; // 这个属性引用了星星预制资源
    @property(cc.Prefab) scoreFXPrefab: cc.Prefab = null;
    @property(cc.Node) ground: cc.Node = null; // 地面节点，用于确定星星生成的高度
    @property(Player) player: Player = null; // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    @property(cc.Label) scoreDisplay: cc.Label = null; // score label 的引用
    @property({type:cc.AudioClip}) scoreAudio: cc.AudioClip = null;
    @property(cc.Node) startBtn: cc.Node = null; // 开始按钮
    @property(cc.Node) gameOverNode: cc.Node = null; // gameover img
    @property(cc.Label) controlHintLabel: cc.Label = null; // score label 的引用

    // 星星产生后消失时间的随机范围
    @property maxStarDuration = 0;
    @property minStarDuration = 0;
    // 操作文案
    @property({multiline: true}) touchHint = '';
    @property({multiline: true}) keyboardHint = '';

    currentStar: cc.Node
    starPool: cc.NodePool
    scorePool: cc.NodePool

    groundY = 0; // 默认地板高度
    score = 0; // 初始化计分

    // 初始化计时器
    timer = 0;
    starDuration = 0;

    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;

        // 初始化计分
        this.score = 0;
        this.enabled = false;

        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hintText;

        // initialize star and score pool
        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreFX');
    }

    onClickStartBtn () {
        this.startBtn.x = 3000;
        this.enabled = true;
        this.gameOverNode.active = false;
        // reset player position and move speed
        this.player.startMoveAt(cc.v2(0, this.groundY));
        // 生成一个新的星星
        this.spawnNewStar();
    }

    spawnNewStar () {
        let self = this;
        // 使用给定的模板在场景中生成一个新节点
        let newStar = this.starPool.size() > 0 ? this.starPool.get(this) : cc.instantiate(this.starPrefab);

        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(getNewStarPosition());
        newStar.getComponent('Star').init(this);

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;

        this.currentStar = newStar;

        function getNewStarPosition () {
            var randX = 0;
            // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
            var randY = self.groundY + Math.random() * self.player.getComponent('Player').jumpHeight + 50;
            // 根据屏幕宽度，随机得到一个星星 x 坐标
            var maxX = self.node.width/2;
            randX = (Math.random() - 0.5) * 2 * maxX;
            // 返回星星坐标
            return cc.v2(randX, randY);
        }
    }

    spawnScoreFX () {
        var fx = this.scorePool.size() > 0 ? this.scorePool.get() : cc.instantiate(this.scoreFXPrefab);
        fx.getComponent('ScoreFX').init(this);
        return fx.getComponent('ScoreFX');
    }

    despawnStar (star: cc.Node) {
        this.starPool.put(star);
        this.spawnNewStar();
    }

    despawnScoreFX (scoreFX) {
        this.scorePool.put(scoreFX);
    }

    gainScore (pos) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;

        // // 播放特效
        // var fx = this.spawnScoreFX();
        // this.node.addChild(fx.node);
        // fx.node.setPosition(pos);
        // fx.play();

        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    update (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    }

    gameOver () {
        this.gameOverNode.active = true;
        this.player.enabled = false;
        this.player.stopMove(); //停止 player 节点的跳跃动作
        this.currentStar.destroy();
        this.startBtn.x = 0;
        // cc.director.loadScene('game');
    }
}
