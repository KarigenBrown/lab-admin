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
export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: '123',
        password: '256',
        role: ''
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
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs['loginRef'].validate((valid) => {
        if (valid) {
          this.$request.post('/login', this.user)
              .then(res => {
                if (res.code === '200') {
                  this.$router.push('/')
                  this.$message.success('登录成功')
                  localStorage.setItem('user', JSON.stringify(res.data))
                } else {
                  this.$message.error(res.msg)
                }
              })
        }
      })
    }
  }
}
</script>