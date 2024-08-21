import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { pinia,usePiniaStore } from './store'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vue3-calendar-heatmap/dist/style.css'

const lightTheme = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        primary: '#009688', // 你的主要颜色
        secondary: '#00695C', // 第二种颜色
        accent: '#64FFDA', // 强调颜色
        // 你还可以定义更多颜色，如 error, info, success, warning 等
    },
};

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    },
    theme: {
        defaultTheme: 'light', // 默认主题
        themes: {
            light: lightTheme,
        },
    },
})

const app = createApp(App)
usePiniaStore(app);
app.use(vuetify);
app.use(pinia)
app.use(router);
app.provide('vuetify', vuetify)
app.mount('#app')

