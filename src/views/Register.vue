<template>
  <div>
    <el-card>
      <el-form :model="user" :rules="rules" ref="registerRef">
        <div>欢迎注册后台管理系统</div>
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password placeholder="请输入密码" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="conformPassword">
          <el-input show-password placeholder="请确认密码" v-model="user.conformPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register">注册</el-button>
        </el-form-item>
        <el-link href="/login">已经有账号?请登录</el-link>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    const validatePassword = (rule, conformPassword, callback) => {
      if (conformPassword === '') {
        callback(new Error('请确认密码'))
      } else if (conformPassword !== this.user.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      user: {
        username: '123',
        password: '111',
        conformPassword: '112'
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        conformPassword: [
          {validator: validatePassword, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    register() {
      this.$refs['registerRef'].validate((valid) => {
        if (valid) {
          delete this.user.conformPassword
          this.$request.post('/register', this.user)
              .then(res => {
                if (res.code === '200') {
                  this.$router.push('/login')
                  this.$message.success('注册成功')
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