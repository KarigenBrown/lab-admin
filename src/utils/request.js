import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 3000
})

request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    // let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    // config.headers['token'] = user?.token
    return config
}, err => {
    this.$message.error(err)
    return Promise.reject(err)
})

request.interceptors.response.use(response => {
    let res = response.data
    if (typeof res === "string") {
        res = res ? JSON.parse(res) : res
    }
    return res
}, err => {
    this.$message.error(err)
    return Promise.reject(err)
})

export default request