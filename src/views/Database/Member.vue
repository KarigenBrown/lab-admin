<template>
  <div>
    <el-container>
      <el-page-header @back="goBack" content="成员详情">
      </el-page-header>
      <el-header style="display: flex; flex-direction: column; align-items: flex-start; height: 15vh">
        <el-select v-model="choice" placeholder="请选择" @change="identityChange">
          <el-option v-for="item in this.identities" :key="item" :label="item"
                     :value="item">
          </el-option>
        </el-select>
        <div style="display: flex; align-items: center; justify-content: space-between">
          <el-input
              v-model="queryUsername"
              size="mini"
              placeholder="查询用户名"
              style="margin-right: 10px"/>
          <el-button @click="queryUserByName">查询</el-button>
        </div>
        <el-upload
            action="http://localhost:8081/webRawMember/excel/upload"
            :multiple="false"
            name="excel"
            :on-success="handleUploadExcelSuccess"
            :on-error="handleUploadExcelFail"
            :headers="{token: this.token}">
          <el-button size="small">点击上传成员原始数据</el-button>
        </el-upload>
      </el-header>

      <el-main>
        <el-table
            :data="users"
            stripe
            border>
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="学工号" prop="number"></el-table-column>
          <el-table-column label="用户名" prop="name"></el-table-column>
          <el-table-column label="身份" prop="identity"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button @click="editUser(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
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
            <el-form-item label="学工号" prop="number">
              {{ form.number }}
            </el-form-item>
            <el-form-item label="用户名" prop="name">
              {{ form.name }}
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
          <br>
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
  name: 'Member',
  data() {
    return {
      token: sessionStorage.getItem('token'),
      users: [],
      queryUsername: '',
      form: {},
      formVisible: false,
      tableIndex: -1,
      identities: ['教授', '副教授', '讲师', '在校生', '毕业生'],
      choice: '',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      pageHide: false
    }
  },
  created() {
    this.$request.get(`/webMember/all/${this.pageSize}/${this.currentPage}`)
        .then(res => {
          if (res.code === 200) {
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
    queryUserByName() {
      this.choice = ''
      this.$request.get('/webMember/name/' + this.queryUsername)
          .then(res => {
            if (res.code === 200) {
              this.users = res.data
              this.pageHide = true
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    identityChange() {
      this.$request.get(`/webMember/identity/${this.choice}/${this.pageSize}/${this.currentPage}`)
          .then(res => {
            if (res.code === 200) {
              this.users = res.data.rows
              this.total = res.data.total
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
      this.tableIndex = index
    },
    deleteUser(index, row) {
      this.$request.delete('/webMember/' + row.id)
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
    updateUser() {
      this.formVisible = false
      if (this.tableIndex === -1) { // 增加
        this.$request.post('/webMember', this.form)
            .then(res => {
              if (res.code === 200) {
                this.form.id = res.data.id
                this.users.push(this.form)
                this.$set(this.users, this.users.length - 1, this.form)
                this.$message.success('新增用户成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else { // 修改
        this.$request.put('/webMember', this.form)
            .then(res => {
              if (res.code === 200) {
                this.formVisible = false
                this.$set(this.users, this.tableIndex, this.form)
                this.$message.success('修改用户成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }
    },
    currentChange(currentPage) {
      this.currentPage = currentPage
      this.$request.get(`/webMember/${this.choice === '' ? 'all' : this.choice}/${this.pageSize}/${this.currentPage}`)
          .then(res => {
            if (res.code === 200) {
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
      this.choice = ''
      this.currentChange(this.currentPage)
      this.pageHide = false
      this.queryUsername = ''
    },
    handleUploadExcelSuccess(response, file, fileList) {
      this.$message.success('上传原始成员数据成功')
    },
    handleUploadExcelFail(err, file, fileList) {
      this.$message.success('上传原始成员数据失败')
    },
  }
}
</script>