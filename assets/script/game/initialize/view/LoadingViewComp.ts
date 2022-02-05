/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 16:12:49
 */
import { _decorator } from "cc";
import { resLoader } from "../../../core/common/loader/ResLoader";
import { engine } from "../../../core/Engine";
import { ecs } from "../../../core/libs/ECS";
import { JsonUtil } from "../../../core/utils/JsonUtil";
import { Account } from "../../account/Account";
import { UIID } from "../../common/config/GameUIConfig";
import { CCVMParentComp } from "../../common/ecs/CCVMParentComp";
import { SingletonModuleComp } from "../../common/ecs/SingletonModuleComp";
import { RoleJobModelComp } from "../../role/model/RoleJobModelComp";
import { RoleTableLevelUp } from "../../role/model/RoleTableLevelUp";

const { ccclass, property } = _decorator;

/** 游戏资源加载 */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
export class LoadingViewComp extends CCVMParentComp {
    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        finished: 0,
        /** 加载资源最大进度 */
        total: 0,
        /** 加载资源进度比例值 */
        progress: "",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    private progress: number = 0;

    reset(): void {
        // 获取用户信息的多语言提示文本
        this.data.prompt = engine.language.getLangByID("loading_load_player");

        // 关闭加载界面
        engine.gui.remove(UIID.Loading);

        // 释放加载界面资源
        resLoader.releaseDir("loading");

        // 初始化角色模块
        var module = ecs.getSingleton(SingletonModuleComp);
        module.account = new Account();
        module.account.connect();

        // 打开DEMO界面
        engine.gui.open(UIID.Demo);
    }

    start() {
        this.loadRes();
    }

    /** 加载资源 */
    private async loadRes() {
        this.data.progress = 0;
        await this.loadLocalJson();
        this.loadGameRes();
    }

    /** 加载游戏本地JSON数据（自定义内容） */
    private loadLocalJson() {
        // 加载游戏本地JSON数据的多语言提示文本
        this.data.prompt = engine.language.getLangByID("loading_load_json");

        return new Promise(async (resolve, reject) => {
            await JsonUtil.loadAsync(RoleJobModelComp.TableName);
            await JsonUtil.loadAsync(RoleTableLevelUp.TableName);
            resolve(null);
        });
    }

    /** 加载初始游戏内容资源 */
    private loadGameRes() {
        // 加载初始游戏内容资源的多语言提示文本
        this.data.prompt = engine.language.getLangByID("loading_load_game");

        resLoader.loadDir("game", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
    }

    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, item: any) {
        this.data.finished = finished;
        this.data.total = total;

        var progress = finished / total;
        if (progress > this.progress) {
            this.progress = progress;
            this.data.progress = (progress * 100).toFixed(2);
        }
    }

    /** 加载完成事件 */
    private onCompleteCallback() {
        this.ent.remove(LoadingViewComp);
    }
}