import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type {App} from "vue";

export const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

// export default pinia;
export function usePiniaStore(app: App<Element>) {
    app.use(pinia);//注册给app
}