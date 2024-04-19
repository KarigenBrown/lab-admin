<template>
  <div>
    <el-container>
      <el-header>欢迎登录后台管理系统</el-header>
      <el-main>
        <el-form :model="user" :rules="rules" ref="loginRef">
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input show-password placeholder="请输入密码" v-model="user.password"></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-radio v-model="user.role" label="admin">管理员</el-radio>
            <el-radio v-model="user.role" label="user">用户</el-radio>
          </el-form-item>

          <el-form-item prop="code">
            <div style="display: flex">
              <el-input placeholder="请输入验证码" prefix-icon="el-icon-circle-check" size="medium" style="flex: 1" v-model="user.code"></el-input>
              <div style="flex: 1; height: 36px">
                <valid-code @update:value="getCode" />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button @click="login">登录</el-button>
          </el-form-item>
          <el-link href="/register">还没有账号?请注册</el-link>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ValidCode from "@/components/ValidCode.vue";

export default {
  name: 'Login',
  components: {ValidCode},
  data() {
    // 验证码校验
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value.toLowerCase() !== this.code) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }

    return {
      user: {
        role: 'user'
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请选择身份', trigger: 'blur'}
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    getCode(code) {
      this.code = code.toLowerCase()
    },
    login() {
      this.$refs['loginRef'].validate((valid) => {
        if (valid) {
          this.$request.post('/webManager/login', this.user)
              .then(res => {
                if (res.code === 200) {
                  sessionStorage.setItem('token', res.data.token)
                  sessionStorage.setItem('number', res.data.number)
                  sessionStorage.setItem('identity', res.data.identity)
                  sessionStorage.setItem('permits', res.data.permits)
                  sessionStorage.setItem('role', this.user.role)
                  this.$router.push('/')
                  this.$message.success('登录成功')
                } else {
                  this.$message.error(res.message)
                }
              }).catch(err => {
            this.$message.error(err)
          })
        }
      })
    }
  }
}
</script>