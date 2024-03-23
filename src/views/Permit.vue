<template>
  <div>
    <div>
      <el-input placeholder="查询用户名" v-model="queryUsername"></el-input>
      <el-button @click="query">查询</el-button>
    </div>
    <el-table :data="users">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="密码" prop="password"></el-table-column>
      <el-table-column label="权限" prop="permit"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button>编辑</el-button>
          <el-button>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
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
      ],
      queryUsername: ''
    }
  },
  created() {
    this.$message.info("diaoyong")
    this.$request.get('项目内部地址')
        .then(res => {
          this.users = res.data
        })
  },
  methods: {
    query() {
      this.$message.info(this.queryUsername)
    }
  }
}
</script>