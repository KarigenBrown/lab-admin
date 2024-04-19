<template>
  <div>
    <el-table :data="logs">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="userid" prop="userid"></el-table-column>
      <el-table-column label="createTime" prop="createTime"></el-table-column>
      <el-table-column label="log" prop="log"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'Log',
  data() {
    return {
      logs: []
    }
  },
  created() {
    this.$request.get('/webLog/all')
        .then(res => {
          if (res.code === 200) {
            this.logs = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
      this.$message.error(err)
    })
  }
}
</script>