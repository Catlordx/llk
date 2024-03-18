import { createApp } from "vue";
import { createPinia } from "pinia";
import './styles/tailwind.css'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import router from './router'
import App from "./App.vue";


const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
const pinia = createPinia();


app.use(pinia);
app.use(router)
app.mount("#app");
