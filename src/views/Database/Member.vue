<template>
  <div>
    <el-table :data="users">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="学工号" prop="number"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
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
          <el-input v-model="form.password" placeholder="密码"></el-input>
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
  name: 'Member',
  data() {
    return {
      users: [
        {
          id: 1,
          number: '123',
          username: 'karigen',
        }
      ],
      queryUsername: '',
      form: {},
      formVisible: false,
      formIndex: -1,
    }
  },
  created() {
    this.$request.get('/', this.queryUsername)
        .then(res => {
          this.users = res.data
        })
  },
  methods: {
    query() {
      this.$request.get('/')
          .then(res => {
            this.users = res.data
          }).catch(e => {
        this.$message.info('查询' + this.queryUsername)
      })
    },
    editUser(index, row) {
      this.$request.put('/', row)
          .then(res => {
            this.form = JSON.parse(JSON.stringify(row))
            this.formVisible = true
            this.formIndex = index
          }).catch(e => {
        this.form = JSON.parse(JSON.stringify(row))
        this.formVisible = true
        this.formIndex = index
      })
    },
    deleteUser(index, id) {
      this.$request.delete('/' + id)
          .then(res => {
            this.users.splice(index, 1)
          }).catch(e => {
        this.$message.error(index + '在数据库中未被删除')
        this.users.splice(index, 1)
      })
    },
    updateUser() {
      this.$request.put('/', this.form)
          .then(res => {
            this.formVisible = false
            this.$set(this.users, this.formIndex, this.form)
          }).catch(e => {
        this.formVisible = false
        this.$set(this.users, this.formIndex, this.form)
      })
    }
  }
}
</script>