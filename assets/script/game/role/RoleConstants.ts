
export enum RoleModelType {
    Tank = 'tank',
    MechWarrior = 'mechWarrior',
}

export const RoleModelPath: Record<RoleModelType, string> = {
    [RoleModelType.Tank]: 'game/role/tank',
    [RoleModelType.MechWarrior]: 'game/role/mechWarrior',
}