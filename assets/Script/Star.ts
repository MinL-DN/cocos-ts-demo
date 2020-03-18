// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Game from './Game';

@ccclass
export default class STAR extends cc.Component {

    game: Game;

    @property pickRadius: number = 0;

    onLoad () {
        this.enabled = false;
    }

    init (game: Game) {
        this.enabled = true;
        this.game = game;
    }

    getPlayerDistance () {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getCenterPos();
        // 根据两点位置计算两点之间距离
        var dist = this.node.getPosition().sub(playerPos).mag();
        return dist;
    }

    onPicked () {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.gainScore(this.node.getPosition());
        this.game.despawnStar(this.node);
    }

    update (dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
        } else {
            // 根据 Game 脚本中的计时器更新星星的透明度
            var opacityRatio = 1 - this.game.timer/this.game.starDuration;
            var minOpacity = 50;
            this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
        }
    }
}
