/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-28 14:31:54
 */

import { EventTouch, Node, sp, UITransform, v3, _decorator } from "cc";
import { resLoader } from "../../../core/common/loader/ResLoader";
import { ecs } from "../../../core/libs/ECS";
import { oops } from "../../../core/Oops";
import { config } from "../../common/config/Config";
import { CCComp } from "../../common/ecs/CCComp";
import { RoleModelComp } from "../model/RoleModelComp";
import { Role } from "../Role";
import { RoleEvent } from "../RoleEvent";
import { RoleViewAnimator } from "./RoleViewAnimator";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewComp')
@ecs.register('RoleView', false)
export class RoleViewComp extends CCComp {
    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton | null = null;

    /** 动画状态机 */
    animator: RoleViewAnimator = null!;

    private path: string = '';

    onLoad() {
        this.node.active = false;
        this.animator = this.spine!.getComponent(RoleViewAnimator)!;
        this.animator.role = this.ent as Role;

        this.on(RoleEvent.ChangeJob, this.onHandler, this);
    }

    /** 全局事件处理器 */
    private onHandler(event: string, args: any) {
        switch (event) {
            case RoleEvent.ChangeJob:
                this.changeJob();
                break;
        }
    }

    /** 演示业务层通过事件控制视图层逻辑，避免两层代码直接偶合 */
    private changeJob() {
        // 切换职业动画
        this.animator.refresh();
    }

    load() {
        var name = "model1";
        this.path = config.game.getRolePath(name);
        resLoader.load(this.path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
            if (err) {
                console.error(`动画名为【${this.path}】的角色资源不存在`);
                return;
            }

            this.spine!.skeletonData = sd;
            this.node.active = true;

            // 移动控制
            oops.gui.root.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        });
    }

    private onTouchEnd(event: EventTouch) {
        // 注：角色移动控制代码在RPG类游戏中，应该设计到地图模块监听触摸事件。因为测试代码只有一个角色，为了简少DEMO代码量，只表达程序设计思想
        var role = this.ent.get(RoleModelComp).ent as Role;
        var uit = this.node.parent!.getComponent(UITransform)!;
        var x = event.getUILocation().x - uit.contentSize.width / 2;
        var y = event.getUILocation().y - uit.contentSize.height / 2;
        role.move(v3(x, y));

        if (x < role.RoleView.node.position.x)
            role.RoleView.animator.left();
        else
            role.RoleView.animator.right();
    }

    reset() {
        this.node.destroy();
        resLoader.release(this.path);
    }
}