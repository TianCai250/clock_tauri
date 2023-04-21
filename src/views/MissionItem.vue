<template>
    <div :class="['mission-item', { star: props.mission.star }]">
        <div class="item-content">
            <div class="time">{{ formatTime(props.mission.time) }}</div>
            <div class="text">{{ props.mission.content }}</div>
        </div>
        <div class="item-fn">
            <div class="item-icon">
                <el-icon title="查看" @click="handleCheck(props.mission)" :size="22" color="#67c23a">
                    <View />
                </el-icon>
            </div>
            <div class="item-icon">
                <el-icon title="编辑" @click="handleEdit(props.mission)" :size="22" color="#409EFC">
                    <Edit />
                </el-icon>
            </div>
            <div class="item-icon">
                <el-icon title="标星" @click="handleStar(props.mission)" :size="22" color="#e6a23c">
                    <Star />
                </el-icon>
            </div>
            <div class="item-icon">
                <el-icon title="删除" @click="handleDelete(props.mission)" :size="22" color="#f56c6c">
                    <Delete />
                </el-icon>
            </div>
        </div>
    </div>
    <el-dialog v-model="editVisible" title="任务详情" width="90%" :close-on-click-modal="false" :append-to-body="true">
        <el-form>
            <el-form-item label="提醒时间">
                <el-date-picker :disabled="!editFlag" v-model="currentMission!.time" type="datetime"
                    placeholder="选择任务提醒时间" />
            </el-form-item>
            <el-form-item label="任务内容">
                <el-input :disabled="!editFlag" v-model="currentMission!.content" placeholder="请输入任务内容" maxlength="50"
                    show-word-limit type="textarea" :rows="10" resize="none" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button plain @click="cancelEdit">取消</el-button>
                <el-button plain type="primary" @click="saveEdit" v-if="editFlag">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { IMission } from "@/types";
import useMissionStore from '@/stores/mission';
import { onMounted, ref } from "vue";
import { Message } from '@/components/Message';
import emitter from '@/utils/eventBus';
const props = defineProps<{
    mission: IMission
}>()

const missionStore = useMissionStore()

const editVisible = ref(false);
const editFlag = ref(false);
const currentMission = ref<IMission>()

onMounted(() => {
    emitter.on('mission_remind', (e: any) => {
        if(e.mission.id === props.mission.id) {
            handleCheck(e.mission)
        }
    })
})

const beTwo = (num: number) => {
    return num <= 9 ? '0' + num : num;
}

const formatTime = (time: string | null) => {
    if (!time) {
        return '-'
    }
    const t = new Date(time)
    return `${t.getFullYear()}-${beTwo(t.getMonth() + 1)}-${beTwo(t.getDate())} ${beTwo(t.getHours())}:${beTwo(t.getMinutes())}:${beTwo(t.getSeconds())}`
}

const handleCheck = (mission: IMission) => {
    currentMission.value = mission;
    editFlag.value = false;
    editVisible.value = true;
}
const handleEdit = (mission: IMission) => {
    currentMission.value = mission;
    editFlag.value = true;
    editVisible.value = true;
}
const cancelEdit = () => {
    editVisible.value = false;
}
const saveEdit = () => {
    if (currentMission.value!.content.trim() === '') {
        Message({
            message: '请输入任务内容',
            type: 'warning',
        })
        return;
    }
    if (currentMission.value!.time === '' || currentMission.value!.time === null) {
        Message({
            message: '请选择提醒时间',
            type: 'warning',
        })
        return;
    }
    missionStore.editMission(currentMission.value!.id!, currentMission.value!)
    editVisible.value = false;
}
const handleStar = (mission: IMission) => {
    missionStore.setStar(mission.id!, !mission.star)
}
const handleDelete = (mission: IMission) => {
    missionStore.removeMission(mission.id!)
}

</script>

<style scoped>
.mission-item {
    display: flex;
    height: 70px;
    padding: 4px 5px;
    margin-bottom: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, .12);
    border-radius: 4px;
}

.star {
    background-color: #a6f08255;
}

.item-content {
    width: 70%;
    overflow: hidden;
    padding: 4px 0;
}

.item-content .time {
    height: 40%;
    overflow: hidden;
    color: #909399;
}

.item-content .text {
    height: 60%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 2.5;
    color: rgb(120, 120, 120);
}

.item-fn {
    display: flex;
    justify-content: space-around;
    align-items: space-around;
    flex-wrap: wrap;
}

.item-fn .item-icon {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-icon .el-icon {
    cursor: pointer;
    transition: all 0.2s linear;
}

.item-icon .el-icon:hover {
    transform: scale(1.1);
}
</style>