<template>
    <div class="container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>待提醒</span>
                    <el-button class="button" @click="clear(EMissionState.UNREMIND)" text>清空</el-button>
                </div>
            </template>
            <div class="mission-list">
                <mission-item :mission="item"
                    v-for="item in missionStore.missionList.filter(i => i.state === EMissionState.UNREMIND)"
                    :key="(item.id as number)"></mission-item>
            </div>

        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>已提醒</span>
                    <el-button class="button" @click="clear(EMissionState.REMINDED)" text>清空</el-button>
                </div>
            </template>
            <div class="mission-list">
                <mission-item :mission="item"
                    v-for="item in missionStore.missionList.filter(i => i.state === EMissionState.REMINDED)"
                    :key="(item.id as number)"></mission-item>
            </div>
        </el-card>
        
    </div>
    <el-backtop target=".container" :right="10" :bottom="50" />
</template>

<script lang="ts" setup>
import useMissionStore from '@/stores/mission';
import { EMissionState } from "@/types";
import { onMounted } from 'vue';
import MissionItem from './MissionItem.vue';

const missionStore = useMissionStore();
let clockTimer:number | null = null;

onMounted(() => {
    startClock();
})

const clear = (state: EMissionState) => {
    missionStore.clearStateMission(state);
}
// 定时检测提醒状态
const startClock = () => {
    if(clockTimer) {
        return;
    }
    clockTimer = window.setInterval(() => {
        missionStore.updateState()
    },1000)
}

</script>

<style scoped>
.container {
    padding: 10px;
    overflow-y: auto;
    max-height: calc(100vh - 60px);
}

.box-card {
    margin-bottom: 10px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>