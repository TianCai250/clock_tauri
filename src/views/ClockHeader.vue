<template>
    <div class="header">
        <div class="header-input">
            <el-input type="text" size="large" v-model="missionForm.content" placeholder="请输入任务" maxlength="50"
                show-word-limit clearable></el-input>
        </div>
        <div class="header-create">
            <el-button size="large" type="primary" @click="openCreateDialog" plain>创建任务</el-button>
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="任务详情" width="90%" :close-on-click-modal="false" :append-to-body="true">
        <el-form>
            <el-form-item label="提醒时间">
                <el-date-picker v-model="missionForm.time" type="datetime" placeholder="选择任务提醒时间" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button plain @click="cancelCreate">取消</el-button>
                <el-button plain type="primary" @click="createMission">
                    创建
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { IMission, EMissionState } from "@/types";
import { Message } from '@/components/Message';
import useMissionStore from '@/stores/mission';

const missionStore = useMissionStore()

const missionForm = ref<IMission>({
    id: null,
    content: '',
    time: null,
    state: EMissionState.UNREMIND,
    star: false
});
const dialogVisible = ref<boolean>(false);

const openCreateDialog = async () => {
    if (missionForm.value.content.trim() === '') {
        Message({
            message: '请输入任务内容',
            type: 'warning',
        })
        return;
    }
    dialogVisible.value = true;
};
// 初始化任务
const initMission = () => {
    missionForm.value = {
        id: null,
        content: '',
        time: null,
        state: EMissionState.UNREMIND,
        star: false
    }
}
// 创建任务
const createMission = () => {
    if (missionForm.value.content.trim() === '') {
        Message({
            message: '请输入任务内容',
            type: 'warning',
        })
        return;
    }
    if (missionForm.value.time === '' || missionForm.value.time === null) {
        Message({
            message: '请选择提醒时间',
            type: 'warning',
        })
        return;
    }
    missionForm.value.id = new Date().getTime();
    missionStore.addMission(missionForm.value)
    initMission();
    dialogVisible.value = false;
}
// 取消创建
const cancelCreate = () => {
    missionForm.value.id = null;
    missionForm.value.time = null;
    dialogVisible.value = false;
}
</script>

<style scoped>
.header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.header-input {
    width: 70%;
}

.header-create {
    width: 30%;
    text-align: center;
}
</style>
