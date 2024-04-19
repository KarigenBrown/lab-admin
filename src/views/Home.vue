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
                :default-active="$route.path"
                background-color="#314050"
                text-color="#fff"
                active-text-color="#fff">
              <div v-if="this.role === 'admin'">
                <el-menu-item index="/permit">权限管理</el-menu-item>
                <el-submenu index="0">
                  <div slot="title">
                    <span>数据库管理</span>
                  </div>
                  <el-menu-item v-if="this.permits.includes('成果管理') || this.identity !== '在校生'"
                                index="/achievement">
                    成果管理
                  </el-menu-item>
                  <el-menu-item v-if="this.permits.includes('人员管理') || this.identity !== '在校生'"
                                index="/member">
                    人员管理
                  </el-menu-item>
                  <el-menu-item v-if="this.permits.includes('Demo管理') || this.identity !== '在校生'"
                                index="/demo">
                    Demo管理
                  </el-menu-item>
                  <el-menu-item v-if="this.permits.includes('活动管理') || this.identity !== '在校生'"
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
          <el-button id="logout" size="small" type="danger" @click="logout">
            退出
          </el-button>
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
      identity: '',
      number: ''
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
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
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

#logout {
  padding: 5px 15px;
}

.el-breadcrumb__inner {
  color: white !important;
}

</style>