const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello 001';
    @property
    text2: string = 'hello 0013';
    @property
    text3: string = 'hello 013';

    start () {
        // init logic
        this.label.string = this.text;
    }
}
