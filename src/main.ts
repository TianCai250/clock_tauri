import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import pinia from "@/stores";
import "./styles.css";
import App from "./App.vue";
import Icons from '@/icons';

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
}).use(pinia).use(Icons).mount("#app");
