import { createRouter, createWebHistory } from 'vue-router'
import request from '@/api'
import { useGlobalStore } from "@/store/global";
import { NotNeedVerify,NotNeedLogin } from '@/config/index';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/view/HomeView.vue'),
            name: 'home'
        },
        {
            path: '/error',
            component: () => import('@/view/ErrorPage.vue'),
            name: 'error'
        },
        {
            path: '/user/login',
            component: () => import("@/view/user/LoginView.vue"),
            name: "user_login"
        },
        {
            path: '/user/detail/:uid',
            component: () => import('@/view/user/UserDetail.vue'),
            name: 'user_detail'
        },
        {
            path: '/user/register',
            component: () => import('@/view/user/RegisterView.vue'),
            name: "user_register"
        },
        {
            path: '/user/forget',
            component: () => import('@/view/user/ForgetView.vue'),
            name: "user_forget"
        },
        {
            path: '/user/verify',
            component: () => import('@/view/user/VerifyView.vue'),
            name: "user_verify"
        },
        {
            path: '/problem',
            component: () => import('@/view/problem/ProblemList.vue'),
            name: 'problem_list'
        },
        {
            path: '/problem/detail/:pid',
            component:() => import('@/view/problem/ProblemDetail.vue'),
            name: 'problem_detail'
        },
        {
            path: '/problem/update/:pid',
            component: () => import('@/view/problem/ProblemUpdate.vue'),
            name: 'problem_update'
        },
        {
            path: '/contest',
            component: () => import('@/view/contest/ContestList.vue'),
            name: 'contest_list'
        },
        {
            path: '/training',
            component: () => import('@/view/TrainingList.vue'),
            name: 'training_list'
        },
        {
            path: '/record',
            component: () => import('@/view/record/RecordList.vue'),
            name: 'record_list'
        },
        {
            path: '/record/detail/:rid',
            component: () => import('@/view/record/RecordDetail.vue'),
            name: 'record_detail'
        },
        {
            path: '/setting',
            component: () => import('@/view/SettingView.vue'),
            name: 'setting'
        },
        {
            path: '/state',
            component: () => import('@/view/StateView.vue'),
            name: 'state'
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

router.beforeEach(async (to) => {
    const globalStore = useGlobalStore();
    globalStore.loading = true;
    // console.log(to);
    try {
        const type: number = await request.get("/user/ping");
        if(to.name != undefined){
            if (type == 0 && !NotNeedLogin.includes(to.name.toString())) {
                return "/user/login";
            }
            if (type == 1 && !NotNeedVerify.includes(to.name.toString())) {
                return "/user/verify";
            }
        }
    } catch (err) {
        console.log(err)
    }
    //console.log(to);
    return true;
})

router.afterEach(async () => {
    //NProgress.done();
    const globalStore = useGlobalStore();
    globalStore.loading = false;
})

export default router