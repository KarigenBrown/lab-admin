<template>
  <div id="root">
    <!--页面整体布局-->
    <el-container>
      <!--侧边栏-->
      <el-aside>
        <el-container>
          <el-header style="background-color: #437ca6;color: #fff">实验室管理系统</el-header>
          <el-main>
            <el-menu
                router
                :default-active="this.defaultIndex"
                background-color="#314050"
                text-color="#fff"
                active-text-color="#fff">
              <div v-if="this.role === 'admin'">
                <el-menu-item
                    v-if="this.permits.includes('权限管理') || this.identity !== '在校生'"
                    index="/permit">
                  权限管理
                </el-menu-item>
                <el-submenu
                    v-if="this.permitList.some(permit => this.permits.includes(permit)) || this.identity !== '在校生'"
                    index="0">
                  <div slot="title">
                    <span>数据库管理</span>
                  </div>
                  <el-menu-item
                      v-if="this.permits.includes('成果管理') || this.identity !== '在校生'"
                      index="/achievement">
                    成果管理
                  </el-menu-item>
                  <el-menu-item
                      v-if="this.permits.includes('成员管理') || this.identity !== '在校生'"
                      index="/member">
                    成员管理
                  </el-menu-item>
                  <el-menu-item
                      v-if="this.permits.includes('Demo管理') || this.identity !== '在校生'"
                      index="/demo">
                    Demo管理
                  </el-menu-item>
                  <el-menu-item
                      v-if="this.permits.includes('活动管理') || this.identity !== '在校生'"
                      index="/activity">
                    活动管理
                  </el-menu-item>
                </el-submenu>
                <el-menu-item index="/log">日志查询</el-menu-item>
              </div>
              <div v-if="this.role === 'user'">
                <el-menu-item index="/info">个人信息管理</el-menu-item>
                <el-menu-item index="/persona">个人详情页面</el-menu-item>
              </div>
            </el-menu>
          </el-main>
        </el-container>
      </el-aside>
      <!--页面主体-->
      <el-container style="background-color: white">
        <!--头部区域-->
        <el-header style="background-color: #4c8dbd; color: #fff;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item style="color: white">主页</el-breadcrumb-item>
            <el-breadcrumb-item style="color: white">{{ $route.meta.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div>
            <el-button id="changePassword" size="small" type="warning" @click="formVisible = true; form = {}">
              修改密码
            </el-button>
            <el-button id="logout" size="small" type="danger" @click="logout">
              退出
            </el-button>

            <div>
              <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
                <el-form :model="form">
                  <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="form.newPassword" placeholder="新密码">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="conformPassword">
                    <el-input v-model="form.conformPassword" placeholder="确认密码">
                    </el-input>
                  </el-form-item>
                </el-form>
                <div style="margin-top: 10px">
                  <el-button type="warning" @click="formVisible = false">取消</el-button>
                  <el-button type="success" @click="changePassword">确定</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </el-header>
        <!--主体区域-->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      role: '',
      permits: '',
      permitList: ['成果管理', '成员管理', 'Demo管理', '活动管理', '权限管理'],
      identity: '',
      number: '',
      defaultIndex: '',
      form: {},
      formVisible: false,
    }
  },
  created() {
    this.number = sessionStorage.getItem('number')
    if (!this.number) {
      this.$router.push('/login')
    }

    this.identity = sessionStorage.getItem('identity')
    this.permits = sessionStorage.getItem('permits').split(',')
    this.role = sessionStorage.getItem('role')
    this.defaultIndex = this.role === 'admin' ? '/log' : '/info'
  },
  methods: {
    logout() {
      this.$request.delete('/webManager/logout')
          .then(res => {
            if (res.code === 200) {
              sessionStorage.clear()
              this.$router.push('/login')
              this.$message.success('退出成功')
            } else {
              this.$router.push('/login')
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    changePassword() {
      if (!this.form.newPassword) {
        this.$message.error('请输入新密码')
      } else if (!this.form.conformPassword) {
        this.$message.error('请确认密码')
      } else if (this.form.newPassword !== this.form.conformPassword) {
        this.$message.error('两次密码不一致')
      } else {
        this.$request.put('/webManager/changePassword?newPassword=' + this.form.newPassword)
            .then(res => {
              if (res.code === 200) {
                this.formVisible = false
                this.$message.success('修改密码成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }
    }
  }
}
</script>

<style>
#root {
  height: 100vh;
  background-color: #fff;
}

.el-aside {
  width: 200px;
  background-color: #314050
}

.el-aside .el-header {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.el-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.el-breadcrumb {
  font-size: 16px;
  background-color: #4c8dbd;
}

.el-breadcrumb__inner {
  color: white !important;
}

</style>