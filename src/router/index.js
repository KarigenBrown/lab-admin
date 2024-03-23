import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/permit',
        name: 'Permit',
        component: () => import('../views/Permit.vue')
    },
    {
        path: '/database',
        name: 'Database',
        children:[
            {
                path: '/achievement',
                name: 'Achievement',
                component: () => import('../views/Achievement.vue')
            },
            {
                path: '/member',
                name: 'Member',
                component: () => import('../views/Member.vue')
            },
            {
                path: '/demo',
                name: 'Demo',
                component: () => import('../views/Demo.vue')
            },
            {
                path: '/activity',
                name: 'Activity',
                component: () => import('../views/Activity.vue')
            },
        ]
    },
    {
        path: '/log',
        name: 'Log',
        component: () => import('../views/Log.vue')
    },
    {
        path: '/info',
        name: 'Info',
        component: () => import('../views/Info.vue')
    },
    {
        path: '/persona',
        name: 'Persona',
        component: () => import('../views/Persona.vue')
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
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
