<template>
  <div>
    <!--页面整体布局-->
    <el-container>
      <!--侧边栏-->
      <el-aside>
        <el-container>
          <el-header>实验室管理系统</el-header>
          <el-main>
            <el-menu router :default-active="$route.path">
              <div v-if="this.role === 'admin'">
                <el-menu-item index="/permit">人员管理</el-menu-item>
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
      <el-container>
        <!--头部区域-->
        <el-header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>主页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button @click="logout">
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
            sessionStorage.clear()
            this.$router.push('/login')
          }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>