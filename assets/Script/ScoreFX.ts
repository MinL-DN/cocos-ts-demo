// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Game from './Game';

@ccclass
export default class GAME extends cc.Component {

    @property(cc.Animation) anim = null;
    game: Game;

    init (game: Game) {
        this.game = game;
        this.anim.getComponent('ScoreAnim').init(this);
    }

    despawn () {
        this.game.despawnScoreFX(this.node);
    }

    play () {
        this.anim.play('score_pop');
    }
}
