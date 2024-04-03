<template>
  <div>
    <el-table :data="users">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="学工号" prop="number"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="权限" prop="permits">
        <template v-slot="scope">
          <el-tag v-for="permit in users[scope.$index].permits" :key="permit">{{ permit }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="editUser(scope.$index, scope.row)">编辑</el-button>
          <el-button @click="deleteUser(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="queryUsername"
              size="mini"
              placeholder="查询用户名"/>
          <el-button @click="query">查询</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-checkbox v-model="form.password" :true-label="form.username">原始密码</el-checkbox>
        </el-form-item>
        <el-form-item label="权限" prop="permits">
          <el-checkbox-group v-model="form.permits">
            <el-checkbox v-for="permit in permitList" :label="permit" :key="permit"/>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-button @click="formVisible = false">取消</el-button>
      <el-button @click="updateUser">确定</el-button>
    </el-dialog>

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
      permitList: ["成果管理", "人员管理", "Demo管理", "活动管理"],
    }
  },
  created() {
    this.$request.get('/webManager/all')
        .then(res => {
          this.users = res.data
          this.users.forEach(user => {
            user.permits = user.permits.split(',')
          })
        }).catch(err => {
      this.$message.error('错误')
    })
  },
  methods: {
    deleteUser(index, id) {
      this.$request.delete('/webManager/' + id)
          .then(res => {
            this.users.splice(index, 1)
          }).catch(e => {
        this.$message.error('错误')
      })
    },
    query() {
      this.$request.get('/webManager/' + this.queryUsername)
          .then(res => {
            this.users = res.data
            this.users.forEach(user => {
              user.permits = user.permits.split(',')
            })
          }).catch(e => {
        this.$message.error('错误')
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
            this.formVisible = false
            this.form.permits = this.form.permits.split(',')
            this.$set(this.users, this.formIndex, this.form)
          }).catch(e => {
        this.$message.error('错误')
      })
    }
  }
}
</script>