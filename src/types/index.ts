interface IKeyToString {
    [key: string]: any
}
// 任务状态
export enum EMissionState {
    // 未提醒
    UNREMIND,
    // 已提醒
    REMINDED,
}
// 任务
export interface IMission extends IKeyToString {
    id: number | null,
    content: string;
    time: string | null;
    state: EMissionState;
    star: boolean
}
