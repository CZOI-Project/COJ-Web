import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/view/Home.vue'
import Problem from '@/view/Problem.vue'
import Contest from '@/view/Contest.vue'
import Training from '@/view/Training.vue'
import Record from '@/view/Record.vue'
import Login from '@/view/user/Login.vue'
import Register from '@/view/user/Register.vue'
import Forget from '@/view/user/Forget.vue'
import Verify from '@/view/user/Verify.vue'
import ProblemDetail from '@/view/ProblemDetail.vue'
import request from '@/api'
import {COJConfig} from '@/config'
import {useGlobalStore} from "@/store/global";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/error',
            component: () => import('@/view/ErrorPage.vue')
        },
        {
            path: '/user/login',
            component: Login,
            name: "login"
        },
        {
            path: '/user/detail/:uid',
            component: () => import('@/view/user/User.vue')
        },
        {
            path: '/user/register',
            component: Register,
            name: "register"
        },
        {
            path: '/user/forget',
            component: Forget,
            name: "forget"
        },
        {
            path: '/user/verify',
            component: Verify,
            name: "verify"
        },
        {
            path: '/problem',
            component: Problem
        },
        {
            path: '/problem/detail/:pid',
            component: ProblemDetail
        },
        {
            path: '/problem/update/:pid',
            component: () => import('@/view/ProblemUpdate.vue'),
        },
        {
            path: '/contest',
            component: Contest
        },
        {
            path: '/training',
            component: Training
        },
        {
            path: '/record',
            component: Record
        },
        {
            path: '/record/detail/:rid',
            component: () => import('@/view/RecordDetail.vue')
        },
        {
            path: '/setting',
            component: () => import('@/view/Setting.vue'),
        },
        {
            path: '/state',
            component: () => import('@/view/State.vue')
        },
        {
            path: '/404',
            name: '404',
            component: () => import('@/view/NotFound.vue')
        },
        // 所有未定义路由，全部重定向到404页
        {
            path: '/:pathMatch(.*)*',
            redirect: '/404'
        }
    ]
})

router.beforeEach(async (to, from) => {
    let globalStore = useGlobalStore();
    globalStore.loading = true;
    let flag = false;
    try {
        let type: number = await request.get("/user/ping");
        if (type == 0 && !COJConfig.notNeedLogin.includes(to.name)) {
            return "/user/login";
        }
        if (type == 1 && !COJConfig.notNeedVerify.includes(to.name)) {
            return "/user/verify";
        }
    } catch (err) {
        console.log(err)
    }
    //console.log(to);
    return true;
})

router.afterEach(async (to, from) => {
    //NProgress.done();
    let globalStore = useGlobalStore();
    globalStore.loading = false;
})

export default router