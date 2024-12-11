
import { ecs } from "../../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";

/** 数据层对象 */
@ecs.register('GameMapModel')
export class GameMapModelComp extends ecs.Comp {
    /** 提供 MVVM 组件使用的数据 */
    private vm: any = {};

    /** 显示数据添加到 MVVM 框架中监视 */
    vmAdd() {
        VM.add(this.vm, "GameMapModel");
    }

    /** 显示数据从 MVVM 框架中移除 */
    vmRemove() {
        VM.remove("GameMapModel");
    }

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        for (var key in this.vm) {
            delete this.vm[key];
        }
    }
}