import { _decorator } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { GameComponent } from "../../../../../extensions/oops-plugin-framework/assets/module/common/GameComponent";
import VMParent from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/VMParent";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { v3 } from "cc";
import { GameMap } from "../../map/gameMap/GameMap";
import { ToggleContainer } from "cc";
import { EventHandler } from "cc";
import { Logger } from "../../../../../extensions/oops-plugin-framework/assets/core/common/log/Logger";
import { Toggle } from "cc";
import { RoleModelType } from "../../role/RoleConstants";

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('HallViewComp')
@ecs.register('HallView', false)
export class HallViewComp extends VMParent {


    @property(ToggleContainer)
    roleModelContainer: ToggleContainer = null!

    /** 视图层逻辑代码分离演示 */
    start() {
        // var entity = this.ent as ecs.Entity;         // ecs.Entity 可转为当前模块的具体实体对象
        // this.on(ModuleEvent.Cmd, this.onHandler, this);
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'HallViewComp';// 这个是脚本类名
        containerEventHandler.handler = 'toggleCallback';
        containerEventHandler.customEventData = 'foobar';

        this.roleModelContainer.checkEvents.push(containerEventHandler);

    }

    /** 全局消息逻辑处理 */
    // private onHandler(event: string, args: any) {
    //     switch (event) {
    //         case ModuleEvent.Cmd:
    //             break;
    //     }
    // }        


    toggleCallback(event: Toggle, customEventData: string) {
        // 这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        // 这里的 customEventData 参数就等于之前设置的 'foobar'
        Logger.logView(event)

        let modelType: Record<string, RoleModelType> = {
            ['ToggleTank']: RoleModelType.Tank,
            ['ToggleMechWarrior']: RoleModelType.MechWarrior
        }

        this.setModelType(modelType[event.target.name])
    }

    setModelType(t: RoleModelType) {
        smc.account.AccountModel.role.RoleModel.roleModelType = t
    }

    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }

    btn_start() {

        smc.gameMap = ecs.getEntity<GameMap>(GameMap);
        smc.gameMap.load(() => {
            this.reset();
        });
    }

}