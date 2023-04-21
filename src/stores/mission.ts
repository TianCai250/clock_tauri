import { ref } from "vue";
import { defineStore } from "pinia";
import { IMission, EMissionState } from '@/types';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { message } from '@tauri-apps/api/dialog';
import emitter from '@/utils/eventBus';


const useMissionStore = defineStore("mission", () => {
    // 任务队列
    const missionList = ref<IMission[]>([]);
    // 设置任务
    function setMissionList(list: IMission[]) {
        missionList.value = list;
    }
    // 添加任务
    function addMission(mission: IMission) {
        missionList.value.unshift(mission)
    }
    // 删除任务
    function removeMission(id: Number) {
        missionList.value = missionList.value.filter(item => item.id !== id)
    }
    // 设置任务状态
    function setState(id: number, state: EMissionState) {
        const mission = missionList.value.find(item => item.id === id)
        if (mission) {
            mission.state = state;
        }
    }
    // 清除某状态的任务
    function clearStateMission(state: EMissionState | undefined) {
        if (state === undefined) {
            missionList.value = []
            return;
        }
        missionList.value = missionList.value.filter(item => item.state !== state)
    }
    // 标星/取消
    function setStar(id: number, star: boolean) {
        const mission = missionList.value.find(item => item.id === id)
        if (mission) {
            mission.star = star;
        }
    }
    // 更新状态
    function updateState() {
        missionList.value = missionList.value.map(item => {
            const current = new Date().getTime();
            let state = EMissionState.UNREMIND
            if (new Date(item.time!).getTime() <= current) {
                if (item.state === EMissionState.UNREMIND) {
                    notifyMission(item)
                }
                state = EMissionState.REMINDED
            }
            return {
                ...item,
                state
            }
        })
    }
    // 编辑任务
    function editMission(id: number, mission: IMission) {
        const m = missionList.value.find(i => i.id === id)
        if (m) {
            for (let k in m) {
                m[k] = mission[k]
            }
        }
    }
    // 任务通知
    async function notifyMission(mission: IMission) {
        console.log('通知')
        let permissionGranted = await isPermissionGranted();
        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === 'granted';
        }
        if (permissionGranted) {
            sendNotification({ title: '任务提醒', body: mission.content });
        }
        emitter.emit('mission_remind', { mission: mission })
        message(mission.content, { title: '任务提醒', type: 'info' });
    }
    return {
        missionList,
        setMissionList,
        addMission,
        removeMission,
        setState,
        clearStateMission,
        setStar,
        updateState,
        editMission
    };
}, {
    persist: true // 开启持久化
});

export default useMissionStore;
