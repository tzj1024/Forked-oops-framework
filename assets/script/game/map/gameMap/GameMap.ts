import { v3 } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { GameMapViewComp } from "./view/GameMapView";
import { ViewUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { RoleCameraComp } from "../../role/view/RoleCamera";


/** GameMap 模块 */
@ecs.register(`GameMap`)
export class GameMap extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    // GameMapModel!: GameMapModelComp;

    /** ---------- 业务层 ---------- */
    // GameMapBll!: GameMapBllComp;

    /** ---------- 视图层 ---------- */
    GameMapView!: GameMapViewComp;
    RoleCamera!: RoleCameraComp;

    /** 初始添加的数据层组件 */
    protected init() {
        // this.addComponents<ecs.Comp>();

    }

    /** 模块资源释放 */
    destroy() {
        // 注: 自定义释放逻辑，视图层实现 ecs.IComp 接口的 ecs 组件需要手动释放
        super.destroy();
    }

    load(callback?: Function) {

        //初始化地图
        let gameMap = ViewUtil.createPrefabNode('game/map/gameMap')
        let gameMapViewComp = gameMap.getComponent(GameMapViewComp)!
        this.add(gameMapViewComp)
        gameMap.parent = oops.game.root


        //初始化角色视角
        let roleCamera = ViewUtil.createPrefabNode('game/role/roleCamera')
        let roleCameraComp = roleCamera.getComponent(RoleCameraComp)!
        this.add(roleCameraComp)
        roleCamera.parent = oops.game.root

        //初始化角色
        smc.account.AccountModel.role.load(gameMap, v3(0, 0, 0))


        if (callback) {
            callback();
            callback = null!;
        }
    }



}

/** GameMap 模块业务逻辑系统组件，如无业务逻辑处理可删除此对象 */
export class EcsGameMapSystem extends ecs.System {
    constructor() {
        super();

        // this.add(new ecs.ComblockSystem());
    }
}
