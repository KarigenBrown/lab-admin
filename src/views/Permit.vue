<template>
  <div>
    <el-container>
      <el-page-header @back="goBack" content="权限详情">
      </el-page-header>
      <el-header style="width: 270px ;display: flex; align-items: center; justify-content: space-between">
        <el-input
            v-model="queryUsername"
            size="mini"
            placeholder="查询用户名"
            style="margin-right: 10px"/>
        <el-button @click="query">查询</el-button>
      </el-header>
      <el-main>
        <el-table
            :data="users"
            stripe
            border>
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="学工号" prop="number"></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="身份" prop="identity"></el-table-column>
          <el-table-column label="权限" prop="permits">
            <template v-slot="scope">
              <el-tag
                  v-if="users[scope.$index].identity === '在校生'"
                  v-for="permit in users[scope.$index].permits"
                  :key="permit">
                {{ permit }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button @click="editUser(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteUser(scope.$index, scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="!this.pageHide"
                       layout="prev, pager, next,total"
                       :total="total"
                       :page-size="pageSize"
                       :current-page="currentPage"
                       @current-change="currentChange"></el-pagination>

        <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
          <el-form :model="form">
            <el-form-item label="用户名" prop="username">
              {{ form.username }}
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-checkbox v-model="form.password" :true-label="form.username">恢复默认密码（用户名）</el-checkbox>
            </el-form-item>
            <el-form-item
                v-if="this.form.identity === '在校生'"
                label="权限"
                prop="permits">
              <el-checkbox-group v-model="form.permits">
                <el-checkbox v-for="permit in permitList" :label="permit" :key="permit"/>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div>
            <el-button type="warning" @click="formVisible = false">取消</el-button>
            <el-button type="success" @click="updateUser">确定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Permit',
  data() {
    return {
      users: [],
      queryUsername: '',
      form: {},
      formVisible: false,
      formIndex: -1,
      permitList: ['成果管理', '成员管理', 'Demo管理', '活动管理', '权限管理'],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      pageHide: false
    }
  },
  created() {
    this.$request.get(`/webManager/all/${this.pageSize}/${this.currentPage}`)
        .then(res => {
          if (res.code === 200) {
            res.data.rows.forEach(user => {
              user.permits = user.permits.split(',')
            })
            this.users = res.data.rows
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    deleteUser(index, id) {
      this.$request.delete('/webManager/' + id)
          .then(res => {
            if (res.code === 200) {
              this.users.splice(index, 1)
              this.$message.success('删除用户成功')
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    query() {
      this.$request.get('/webManager/' + this.queryUsername)
          .then(res => {
            if (res.code === 200) {
              this.users = res.data
              this.users.forEach(user => {
                user.permits = user.permits.split(',')
              })
              this.pageHide = true
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    editUser(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.formVisible = true
      this.formIndex = index
    },
    updateUser() {
      this.form.permits = this.form.permits.join(',')
      this.$request.put('/webManager', this.form)
          .then(res => {
            if (res.code === 200) {
              this.formVisible = false
              this.form.permits = this.form.permits.split(',')
              this.$set(this.users, this.formIndex, this.form)
              this.$message.success('修改用户成功')
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage
      this.$request.get(`/webManager/all/${this.pageSize}/${this.currentPage}`)
          .then(res => {
            if (res.code === 200) {
              res.data.rows.forEach(user => {
                user.permits = user.permits.split(',')
              })
              this.users = res.data.rows
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
      this.pageHide = false
      this.queryUsername = ''
    }
  }
}
</script>