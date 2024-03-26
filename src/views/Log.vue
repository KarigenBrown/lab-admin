<template>
  <div>
    <el-table :data="logs">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="createBy" prop="createBy"></el-table-column>
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
      logs: [
        {
          id: 1,
          createBy: '123',
          createTime: '2020-01-01',
          log: '123'
        }
      ]
    }
  },
  created() {
    this.$request.get('/log')
        .then(res => {
          this.logs = res.data
        }).catch(e=>{
          this.$message.error('未连接到网络')
    })
  }
}
</script>