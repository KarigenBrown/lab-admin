import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: 'permit',
                name: 'Permit',
                meta: {
                    name: '人员管理'
                },
                component: () => import('../views/Permit.vue')
            },
            {
                path: '/achievement',
                name: 'Achievement',
                meta: {
                    name: '成果管理'
                },
                component: () => import('../views/Database/Achievement.vue')
            },
            {
                path: '/member',
                name: 'Member',
                meta: {
                    name: '人员管理'
                },
                component: () => import('../views/Database/Member.vue')
            },
            {
                path: '/demo',
                name: 'Demo',
                meta: {
                    name: 'Demo管理'
                },
                component: () => import('../views/Database/Demo.vue')
            },
            {
                path: '/activity',
                name: 'Activity',
                meta: {
                    name: '活动管理'
                },
                component: () => import('../views/Database/Activity.vue')
            },
            {
                path: '/log',
                name: 'Log',
                meta: {
                    name: '日志查询'
                },
                component: () => import('../views/Log.vue')
            },
            {
                path: '/info',
                name: 'Info',
                meta: {
                    name: '个人信息管理'
                },
                component: () => import('../views/Info.vue')
            },
            {
                path: '/persona',
                name: 'Persona',
                meta: {
                    name: '个人详情页面'
                },
                component: () => import('../views/Persona.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
