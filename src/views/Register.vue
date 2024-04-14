<template>
  <div>
    <el-container>
      <el-header>欢迎注册后台管理系统</el-header>
      <el-main>
        <el-form :model="user" :rules="rules" ref="registerRef">
          <el-form-item prop="number">
            <el-input placeholder="请输入学工号" v-model="user.number"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item prop="identity">
            <el-select v-model="user.identity" placeholder="请选择">
              <el-option v-for="item in ['教授', '副教授', '讲师', '在校生', '毕业生']"
                         :key="item"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="password">
            <el-input show-password placeholder="请输入密码" v-model="user.password"></el-input>
          </el-form-item>
          <el-form-item prop="conformPassword">
            <el-input show-password placeholder="请确认密码" v-model="user.conformPassword">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="register">注册</el-button>
          </el-form-item>
          <el-link href="/login">已经有账号?请登录</el-link>
        </el-form>
      </el-main>
    </el-container>
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
      user: {},
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
          this.$request.post('/webManager/register', this.user)
              .then(res => {
                this.$router.push('/login')
                this.$message.success('注册成功')
              }).catch(err => {
            this.$message.error(err)
          })
        }
      })
    }
  }
}
</script>