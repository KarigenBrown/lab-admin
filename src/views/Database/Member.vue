<template>
  <div>
    <el-container>
      <el-header>
        <el-input
            v-model="queryUsername"
            size="mini"
            placeholder="查询用户名"/>
        <el-button @click="queryUserByName">查询</el-button>
        <el-radio v-model="queryUserIdentity" label="教授">教授</el-radio>
        <el-radio v-model="queryUserIdentity" label="副教授">副教授</el-radio>
        <el-radio v-model="queryUserIdentity" label="在校生">在校生</el-radio>
        <el-radio v-model="queryUserIdentity" label="毕业生">毕业生</el-radio>
        <el-button @click="queryUserByIdentity">查询</el-button>
        <el-button @click="addUser">新增</el-button>
      </el-header>
      <el-main>
        <el-table :data="users">
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="学工号" prop="number"></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button v-if="scope.row.identity.endsWith('生')" @click="editUser(scope.$index, scope.row)">编辑
              </el-button>
              <el-button @click="deleteUser(scope.$index, scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
          <el-form :model="form">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="学号" prop="number">
              <el-input v-model="form.number" placeholder="学号"></el-input>
            </el-form-item>
            <el-form-item label="年级" prop="grade">
              <el-select v-model="form.grade">
                <el-option v-for="item in ['研一', '研二', '研三']" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="form.identity === '毕业生'">
              <el-form-item label="毕业时间" prop="graduationTime">
                <el-date-picker v-model="form.graduationTime" type="date" placeholder="选择日期"></el-date-picker>
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
      users: [
        {
          id: 1,
          number: '123',
          identity: '在校生',
          username: 'karigen',
          grade: '研一',
          graduationDestination: '阿里',
          graduationTime: '2020'
        },
        {
          id: 1,
          number: '123',
          identity: '毕业生',
          username: 'karigen',
          grade: '研一',
          graduationDestination: '阿里',
          graduationTime: '2020-01-01'
        }
      ],
      queryUsername: '',
      form: {},
      formVisible: false,
      formIndex: -1,
      queryUserIdentity: ''
    }
  },
  created() {
    this.$request.get('/', this.queryUsername)
        .then(res => {
          this.users = res.data
        })
  },
  methods: {
    queryUserByName() {
      this.$request.get('/')
          .then(res => {
            this.users = res.data
          }).catch(e => {
        this.$message.info('查询' + this.queryUsername)
      })
    },
    queryUserByIdentity() {
    },
    editUser(index, row) {
      // this.$request.put('/', row)
      //     .then(res => {
      //       this.form = JSON.parse(JSON.stringify(row))
      //       this.formVisible = true
      //       this.formIndex = index
      //     }).catch(e => {
      //
      // })
      this.form = JSON.parse(JSON.stringify(row))
      this.formVisible = true
      this.formIndex = index
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
      // this.$request.put('/', this.form)
      //     .then(res => {
      //       this.formVisible = false
      //       this.$set(this.users, this.formIndex, this.form)
      //     }).catch(e => {
      //   this.formVisible = false
      //   this.$set(this.users, this.formIndex, this.form)
      // })
      this.formVisible = false
      if (this.formIndex === -1) {
        this.users.push(this.form)
        this.$set(this.users, this.users.length - 1, this.form)
      } else {
        this.$set(this.users, this.formIndex, this.form)
      }
    },
    addUser() {
      this.formIndex = -1
      this.form = {}
      this.form.identity = '在校生'
      this.formVisible = true
    }
  }
}
</script>