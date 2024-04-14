<template>
  <div>
    <el-container>
      <el-header>
        <el-input
            v-model="queryUsername"
            size="mini"
            placeholder="查询用户名"/>
        <el-button @click="queryUserByName">查询</el-button>
        <el-select v-model="choice" placeholder="请选择" @change="identityChange">
          <el-option v-for="item in this.identities" :key="item" :label="item"
                     :value="item">
          </el-option>
        </el-select>
        <el-button @click="addUser">新增</el-button>
      </el-header>

      <el-main>
        <el-table :data="users">
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="学工号" prop="number"></el-table-column>
          <el-table-column label="用户名" prop="name"></el-table-column>
          <el-table-column label="身份" prop="identity"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                  v-if="scope.row.identity.endsWith('生')"
                  @click="editUser(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button @click="deleteUser(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
          <el-form :model="form">
            <el-form-item label="学工号" prop="number">
              <el-input v-model="form.number" placeholder="学号"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="身份" prop="identity">
              <el-select v-model="form.identity">
                <el-option v-for="item in this.identities" :key="item" :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.identity === '在校生'" label="年级" prop="grade">
              <el-select v-model="form.grade">
                <el-option
                    v-for="item in ['研一', '研二', '研三']"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="form.identity === '毕业生'">
              <el-form-item label="毕业时间" prop="graduationTime">
                <el-date-picker v-model="form.graduationTime" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="毕业去向" prop="graduationDestination">
                <el-input v-model="form.graduationDestination" placeholder="毕业去向"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <el-button @click="formVisible = false">取消</el-button>
          <el-button @click="updateUser">确定</el-button>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Member',
  data() {
    return {
      users: [],
      queryUsername: '',
      form: {},
      formVisible: false,
      tableIndex: -1,
      identities: ['教授', '副教授', '讲师', '在校生', '毕业生'],
      queryUserIdentity: '',
      choice: ''
    }
  },
  created() {
    this.$request.get('/webMember/all')
        .then(res => {
          this.users = res.data
        })
  },
  methods: {
    queryUserByName() {
      this.choice = ''
      this.$request.get('/webMember/name/' + this.queryUsername)
          .then(res => {
            this.users = res.data
          }).catch(err => {
        this.$message.error(err)
      })
    },
    identityChange() {
      this.$request.get('/webMember/identity/' + this.choice)
          .then(res => {
            this.users = res.data
          }).catch(err => {
        this.$message.error(err)
      })
    },
    editUser(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.formVisible = true
      this.tableIndex = index
    },
    deleteUser(index, row) {
      this.$request.delete('/webMember/' + row.id)
          .then(res => {
            this.users.splice(index, 1)
          }).catch(err => {
        this.$message.error(err)
      })
    },
    addUser() {
      this.tableIndex = -1
      this.form = {}
      this.formVisible = true
    },
    updateUser() {
      this.formVisible = false
      if (this.tableIndex === -1) { // 增加
        this.$request.post('/webMember', this.form)
            .then(res => {
              this.form.id = res.data.id
              this.users.push(this.form)
              this.$set(this.users, this.users.length - 1, this.form)
            }).catch(err => {
          this.$message.error(err)
        })
      } else { // 修改
        this.$request.put('/webMember', this.form)
            .then(res => {
              this.formVisible = false
              this.$set(this.users, this.tableIndex, this.form)
            }).catch(err => {
          this.$message.error(err)
        })
      }
    },
  }
}
</script>