<template>
  <div>
    <el-page-header @back="goBack" content="日志详情">
    </el-page-header>
    <el-table
        :data="logs"
        stripe
        border>
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="userid" prop="userid"></el-table-column>
      <el-table-column label="createTime" prop="createTime"></el-table-column>
      <el-table-column label="log" prop="log"></el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next,total"
                   :total="total"
                   :page-size="pageSize"
                   :current-page="currentPage"
                   @current-change="currentChange"></el-pagination>
  </div>
</template>
<script>
export default {
  name: 'Log',
  data() {
    return {
      logs: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
    }
  },
  created() {
    this.$request.get(`/webLog/all/${this.pageSize}/${this.currentPage}`)
        .then(res => {
          if (res.code === 200) {
            this.logs = res.data.rows
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    currentChange(currentPage) {
      this.currentPage = currentPage
      this.$request.get(`/webLog/all/${this.pageSize}/${this.currentPage}`)
          .then(res => {
            if (res.code === 200) {
              this.logs = res.data.rows
              this.total = res.data.total
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    goBack() {
      this.currentPage = 1
      this.currentChange(this.currentPage)
    }
  }
}
</script>