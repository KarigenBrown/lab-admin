<template>
  <div>
    <el-card>
      <el-form :model="user" :rules="rules" ref="loginRef">
        <div>欢迎登录后台管理系统</div>
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password placeholder="请输入密码" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login">登录</el-button>
        </el-form-item>
        <el-link href="/register">还没有账号?请注册</el-link>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: '123',
        password: '256'
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
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