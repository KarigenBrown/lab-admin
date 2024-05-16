<template>
  <div id="root">
    <el-container id="form">
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
              <el-input placeholder="请输入验证码" prefix-icon="el-icon-circle-check" size="medium" style="flex: 1"
                        v-model="user.code"></el-input>
              <div style="flex: 1; height: 36px">
                <valid-code @update:value="getCode"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button id="login" @click="login">登录</el-button>
          </el-form-item>
          <el-link href="/#/register">还没有账号?请注册</el-link>
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
          {validator: validateCode, trigger: 'blur'}
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

<style>
#root {
  display: flex;
  font-family: Arial, sans-serif;
  background-color: #669fef;
  height: 100vh;
}

#login {
  width: 100%;
  background-color: #0f9876;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

#login:hover {
  background-color: #0f9876;
}

#form {
  max-width: 400px;
  height: 500px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-header {
  font-size: 24px;
  margin-bottom: 20px;
}

.el-main {
  margin-bottom: 20px;
}

.el-input {
  width: 100%;
}

.el-radio {
  margin-right: 20px;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-form-item:last-child {
  margin-bottom: 0;
}

.el-link {
  display: block;
  text-align: center;
  color: #999;
  text-decoration: none;
  margin-top: 10px;
}

.el-link:hover {
  color: #666;
}
</style>