<template>
  <div>
    <el-container>
      <el-header>
        <el-select v-model="choice" placeholder="请选择" @change="typeChange">
          <el-option v-for="item in types" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-header>
      <el-main v-if="isReloadData">
        <div v-if="choice !== '项目'">
          <el-table :data="nonProjects">
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="期刊" prop="journal"></el-table-column>
            <el-table-column label="第一作者" prop="author"></el-table-column>
            <el-table-column label="其他作者" prop="authors"></el-table-column>
            <el-table-column label="时间" prop="date"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button @click="nonProjectDetails(scope.$index, scope.row)">详情</el-button>
                <el-button @click="editNonProject(scope.$index, scope.row)">编辑</el-button>
                <el-button @click="deleteNonProject(scope.$index, scope.row.id)">删除</el-button>
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

        <div v-if="choice === '项目'">
          <el-table :data="projects">
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="项目名称" prop="name"></el-table-column>
            <el-table-column label="项目链接" prop="link"></el-table-column>
            <el-table-column label="项目年份" prop="theyear"></el-table-column>
            <el-table-column label="项目状态" prop="status"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button @click="editProject(scope.$index, scope.row)">编辑</el-button>
                <el-button @click="deleteProject(scope.$index, scope.row.id)">删除</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Achievement',
  data() {
    return {
      types: ['论文', '专利', '项目', '著作', '软著', '技术标准', '竞赛获奖'],
      choice: '论文',
      projects: [
        {
          id: 1,
          name: '项目1',
          link: '项目链接1',
          theyear: '项目年份1',
          status: '状态1'
        }, {
          id: 2,
          name: '项目2',
          link: '项目链接2',
          theyear: '项目年份2',
          status: '状态2'
        },
      ],
      nonProjects: [],
      isReloadData: true,
      formVisible: false,
      form: {}
    }
  },
  methods: {
    typeChange() {
      if (this.choice === '项目') {

      } else {

      }

      this.isReloadData = false
      this.$nextTick(() => {
        this.isReloadData = true
      })
    },
    editProject(index, row) {
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
    deleteProject(index, id) {
      this.$request.delete('/' + id)
          .then(res => {
            this.users.splice(index, 1)
          }).catch(e => {
        this.$message.error(index + '在数据库中未被删除')
        this.users.splice(index, 1)
      })
    },
    updateProject() {
      this.$request.put('/', this.form)
          .then(res => {
            this.formVisible = false
            this.$set(this.users, this.formIndex, this.form)
          }).catch(e => {
        this.formVisible = false
        this.$set(this.users, this.formIndex, this.form)
      })
    },
    nonProjectDetails(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
    },
    editNonProject(index, row) {
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
    deleteNonProject(index, id) {
      this.$request.delete('/' + id)
          .then(res => {
            this.users.splice(index, 1)
          }).catch(e => {
        this.$message.error(index + '在数据库中未被删除')
        this.users.splice(index, 1)
      })
    },
    updateNonProject() {
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