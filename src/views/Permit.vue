<template>
  <div>
    <el-table :data="users">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="密码" prop="password"></el-table-column>
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
  name: 'Permit',
  data() {
    return {
      users: [
        {
          id: 1,
          username: 'karigen',
          password: '123',
          permits: ['人员管理', "成果管理"]
        },
        {
          id: 2,
          username: 'k',
          password: '256',
          permits: ['成果管理']
        },
        {
          id: 2,
          username: 'k',
          password: '256',
          permits: ['成果管理']
        },
        {
          id: 2,
          username: 'k',
          password: '256',
          permits: ['成果管理']
        },
        {
          id: 2,
          username: 'k',
          password: '256',
          permits: ['成果管理']
        },
        {
          id: 2,
          username: 'k',
          password: '256',
          permits: ['成果管理']
        },
        {
          id: 7,
          username: 'k',
          password: '256',
          permits: ['成果管理']
        },
      ],
      queryUsername: '',
      form: {},
      formVisible: false,
      formIndex: -1,
      permitList: ["成果管理", "人员管理", "Demo管理", "活动管理"],
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