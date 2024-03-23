<template>
  <div>
    <!--页面整体布局-->
    <el-container>
      <!--侧边栏-->
      <el-aside>
        <el-menu router :default-active="$route.path">
          <div>实验室管理系统</div>
          <el-menu-item index="/permit">人员管理</el-menu-item>
          <el-submenu index="0">
            <template slot="title">
              <span>数据库管理</span>
            </template>
            <el-menu-item index="/database/achievement">成果管理</el-menu-item>
            <el-menu-item index="/database/member">人员管理</el-menu-item>
            <el-menu-item index="/database/demo">Demo管理</el-menu-item>
            <el-menu-item index="/database/activity">活动管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="/log">日志查询</el-menu-item>
          <el-menu-item index="/info">个人信息管理</el-menu-item>
          <el-menu-item index="/persona">个人详情页面</el-menu-item>
          <el-menu-item index="/login">退出</el-menu-item>
        </el-menu>
      </el-aside>
      <!--页面主体-->
      <el-container>
        <!--头部区域-->
        <el-header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <!--主体区域-->

        <el-main>
          主体区域
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style>
</style>
