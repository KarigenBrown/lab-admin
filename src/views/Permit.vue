<template>
  <div>
    <el-table :data="users">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="密码" prop="password"></el-table-column>
      <el-table-column label="权限" prop="permit"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  name: 'Permit',
  data() {
    return {
      users: [
        {
          id: 1,
          username: 'karigen',
          password: '123',
          permit: '1212'
        },
        {
          id: 2,
          username: 'k',
          password: '256',
          permit: '789'
        },
      ]
    }
  },
  mounted() {
    request.get('项目内部地址')
        .then(res => {
          this.users = res.data
        })
  }
}
</script>