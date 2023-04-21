import { ElMessage } from 'element-plus'

export const Message = (options: any) => {
    ElMessage({
        showClose: true,
        duration: 2000,
        ...options
    })
}