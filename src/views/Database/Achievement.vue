<template>
  <div>
    <el-container>
      <el-page-header @back="goBack" content="成就详情">
      </el-page-header>
      <el-header style="height: 15vh; display: flex; flex-direction: column; align-items: flex-start">
        <el-select v-model="choice" placeholder="请选择" @change="typeChange">
          <el-option v-for="item in types" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <div style="display: flex; align-items: center; justify-content: space-between">
          <el-input
              v-model="achievementTitle"
              size="mini"
              style="width: 300px; margin-right: 10px"
              placeholder="查询成就"></el-input>
          <el-radio-group
              v-if="this.choice === '论文'"
              v-model="articleType"
              style="margin-right: 10px">
            <el-radio label="标题">标题</el-radio>
            <el-radio label="年份">年份</el-radio>
            <el-radio label="期刊（首字母）">期刊（首字母）</el-radio>
            <el-radio label="作者">作者</el-radio>
          </el-radio-group>
          <el-button @click="queryAchievement">查询</el-button>
        </div>
        <el-button @click="addAchievement">新增</el-button>
      </el-header>
      <el-main v-if="isReloadData">
        <div v-if="choice !== '项目'">
          <el-table
              :data="nonProjects"
              stripe
              border>
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="期刊" prop="journal"></el-table-column>
            <el-table-column label="第一作者" prop="author"></el-table-column>
            <el-table-column label="其他作者" prop="authors"></el-table-column>
            <el-table-column v-if="choice === '论文'" label="论文年份" prop="theyear"></el-table-column>
            <el-table-column v-if="choice === '论文'" label="论文状态" prop="articleStatus">
              <template v-slot="scope">
                {{ ['开题', '草稿', '已发布'][scope.row.articleStatus - 1] }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button @click="editNonProject(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" @click="deleteNonProject(scope.$index, scope.row)">删除</el-button>
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
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="标题"></el-input>
              </el-form-item>
              <el-form-item label="期刊" prop="journal">
                <el-input v-model="form.journal" placeholder="期刊全称"></el-input>
              </el-form-item>
              <el-form-item label="第一作者" prop="author">
                <el-input v-model="form.author" placeholder="第一作者"></el-input>
              </el-form-item>
              <el-form-item label="其他作者" prop="authors">
                <el-input v-model="form.authors" placeholder="其他作者"></el-input>
              </el-form-item>
              <el-form-item v-if="form.category === '论文'" label="论文日期" prop="date">
                <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="详情页链接" prop="link">
                <el-input v-model="form.link" placeholder="详情页链接"></el-input>
              </el-form-item>
              <el-form-item label="代码" prop="papercode">
                <el-input type="textarea" autosize v-model="form.papercode" placeholder="代码"></el-input>
              </el-form-item>
              <el-form-item label="摘要" prop="abstract">
                <el-input type="textarea" autosize v-model="form.abstract" placeholder="摘要"></el-input>
              </el-form-item>
              <el-form-item label="类别" prop="category">{{ form.category }}</el-form-item>
              <el-form-item v-if="form.category === '论文'"
                            label="是否为实验室内部论文"
                            prop="internal">
                <el-radio-group v-model="form.internal">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.category === '论文'"
                            label="论文状态"
                            prop="articleStatus">
                <el-steps
                    :active="form.articleStatus"
                    finish-status="success">
                  <el-step title="开题"></el-step>
                  <el-step title="草稿"></el-step>
                  <el-step title="已发布"></el-step>
                </el-steps>
                <el-button @click="nextStatus">下一步</el-button>
              </el-form-item>
              <el-form-item v-else-if="form.category === '技术标准'"
                            label="技术标准状态"
                            prop="techniqueStatus">
                <el-steps :active="form.techniqueStatus" finish-status="success">
                  <el-step title="开题"></el-step>
                  <el-step title="申请中"></el-step>
                  <el-step title="已授权"></el-step>
                </el-steps>
                <el-button @click="nextStatus">下一步</el-button>
              </el-form-item>
              <el-form-item
                  style="white-space: pre-wrap;"
                  v-if="form.category === '论文' || form.category === '技术标准'"
                  label="日志"
                  prop="log">
                {{ this.form.log }}
                <el-input
                    v-model="form.newLog"
                    placeholder="日志内容"
                    style="margin-bottom: 10px"></el-input>
                <el-button @click="addNewLog">提交日志</el-button>
              </el-form-item>
              <el-form-item label="是否隐藏" prop="hidden">
                <el-radio-group v-model="form.hidden">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <br>
            <div>
              <el-button type="warning" @click="formVisible = false">取消</el-button>
              <el-button type="success" @click="updateNonProject">确定</el-button>
            </div>
          </el-dialog>
        </div>

        <div v-if="choice === '项目'">
          <el-table
              :data="projects"
              stripe
              border>
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="项目名称" prop="name"></el-table-column>
            <el-table-column label="项目年份" prop="theyear"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button @click="editProject(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" @click="deleteProject(scope.$index, scope.row)">删除</el-button>
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
              <el-form-item label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="项目名称"></el-input>
              </el-form-item>
              <el-form-item label="项目链接" prop="link">
                <el-input v-model="form.link" placeholder="项目链接"></el-input>
              </el-form-item>
              <el-form-item label="项目年份" prop="theyear">
                <el-input v-model="form.theyear" placeholder="项目年份"></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <el-input type="textarea" autosize v-model="form.content" placeholder="内容"></el-input>
              </el-form-item>
              <el-form-item label="项目状态" prop="status">
                <el-steps :active="form.status" finish-status="success">
                  <el-step title="开题"></el-step>
                  <el-step title="在研"></el-step>
                  <el-step title="结题"></el-step>
                </el-steps>
                <el-button @click="nextStatus">下一步</el-button>
              </el-form-item>
              <el-form-item
                  style="white-space: pre-wrap;"
                  label="日志"
                  prop="log">
                {{ this.form.log }}
                <el-input v-model="form.newLog" placeholder="日志内容"></el-input>
                <br><br>
                <el-button @click="addNewLog">提交日志</el-button>
              </el-form-item>
            </el-form>
            <br>
            <div>
              <el-button type="warning" @click="formVisible = false">取消</el-button>
              <el-button type="success" @click="updateProject">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import moment from "moment/moment";
import {pinyin} from 'pinyin-pro';

export default {
  name: 'Achievement',
  data() {
    return {
      types: ['论文', '专利', '项目', '著作', '软著', '技术标准', '竞赛获奖'],
      choice: '论文',
      projects: [],
      nonProjects: [],
      isReloadData: true,
      formVisible: false,
      form: {},
      achievementTitle: '',
      articleType: '标题',
      tableIndex: -1,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      pageHide: false
    }
  },
  created() {
    this.$request.get(`/webAchievement/${this.choice}/all/${this.pageSize}/${this.currentPage}`)
        .then(res => {
          if (res.code === 200) {
            this.nonProjects = res.data.rows
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    typeChange() {
      if (this.choice !== '项目') {
        this.$request.get(`/webAchievement/${this.choice}/all/${this.pageSize}/${this.currentPage}`)
            .then(res => {
              if (res.code === 200) {
                this.nonProjects = res.data.rows
                this.total = res.data.total
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else {
        this.$request.get(`/webProject/all/${this.pageSize}/${this.currentPage}`)
            .then(res => {
              if (res.code === 200) {
                this.projects = res.data.rows
                this.total = res.data.total
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }

      this.isReloadData = false
      this.$nextTick(() => {
        this.isReloadData = true
      })
    },
    editProject(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.tableIndex = index
      this.formVisible = true
    },
    deleteProject(index, project) {
      this.$request.delete('/webProject/' + project.id)
          .then(res => {
            if (res.code === 200) {
              this.projects.splice(index, 1)
              this.$message.success('删除' + this.choice + '成功')
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    updateProject() {
      if (this.tableIndex === -1) { // 增加
        this.$request.post('/webProject', this.form)
            .then(res => {
              if (res.code === 200) {
                this.form.id = res.data.id
                this.projects.push(this.form)
                this.$set(this.projects, this.projects.length - 1, this.form)
                this.$message.success('新增' + this.choice + '成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else { // 修改
        this.$request.put('/webProject', this.form)
            .then(res => {
              if (res.code === 200) {
                this.$set(this.projects, this.tableIndex, this.form)
                this.$message.success('修改' + this.choice + '成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }
      this.formVisible = false
    },
    editNonProject(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.form.date = this.form.date + ' 00:00:00'
      this.tableIndex = index
      this.formVisible = true
    },
    deleteNonProject(index, nonProject) {
      this.$request.delete('/webAchievement/' + nonProject.id)
          .then(res => {
            if (res.code === 200) {
              this.nonProjects.splice(index, 1)
              this.$message.success('删除' + this.choice + '成功')
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    updateNonProject() {
      if (this.choice !== '项目') {
        this.form.date = moment(this.form.date).format('YYYY-MM-DD')
        this.form.theyear = moment(this.form.date).format('YYYY')
      }

      if (this.choice === '论文') {
        let initials = this.form.journal
        if (/[\u4e00-\u9fff]/.test(this.form.journal)) {
          initials = pinyin(this.form.journal, {toneType: 'none', type: 'array'}).join(' ');
        }
        this.form.initials = initials.split(' ')
            .map(word => word.charAt(0).toLowerCase())
            .join('');
      }

      if (this.tableIndex === -1) { // 增加
        this.$request.post('/webAchievement', this.form)
            .then(res => {
              if (res.code === 200) {
                this.form.id = res.data.id
                this.nonProjects.push(this.form)
                this.$set(this.nonProjects, this.nonProjects.length - 1, this.form)
                this.$message.success('新增' + this.choice + '成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else { // 修改
        this.$request.put('/webAchievement', this.form)
            .then(res => {
              if (res.code === 200) {
                this.$set(this.nonProjects, this.tableIndex, this.form)
                this.$message.success('修改' + this.choice + '成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }
      this.formVisible = false
    },
    nextStatus() {
      if (this.form.category === '论文' && this.form.articleStatus < 3) {
        this.form.articleStatus++
      } else if (this.form.category === '技术标准' && this.form.techniqueStatus < 3) {
        this.form.techniqueStatus++
      } else if (this.choice === '项目' && this.form.status < 3) {
        this.form.status++
      }
      this.$forceUpdate()
    },
    queryAchievement() {
      if (this.choice === '项目') {
        this.$request.get('/webProject/' + this.achievementTitle)
            .then(res => {
              if (res.code === 200) {
                this.projects = res.data
                this.pageHide = true
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else if (this.choice === '论文') {
        this.$request.get(`/webAchievement/${this.choice}/type/${this.articleType}/${this.achievementTitle}`)
            .then(res => {
              if (res.code === 200) {
                this.nonProjects = res.data
                this.pageHide = true
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else {
        this.$request.get(`/webAchievement/${this.choice}/${this.achievementTitle}`)
            .then(res => {
              if (res.code === 200) {
                this.nonProjects = res.data
                this.pageHide = true
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }
    },
    addAchievement() {
      this.tableIndex = -1
      this.form = {}
      this.form.category = this.choice
      this.form.status = 1
      this.form.articleStatus = 1
      this.form.techniqueStatus = 1
      this.formVisible = true
    },
    currentChange(currentPage) {
      this.currentPage = currentPage
      if (this.choice !== '项目') {
        this.$request.get(`/webAchievement/${this.choice}/all/${this.pageSize}/${this.currentPage}`)
            .then(res => {
              if (res.code === 200) {
                this.nonProjects = res.data.rows
                this.total = res.data.total
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else {
        this.$request.get(`/webProject/all/${this.pageSize}/${this.currentPage}`)
            .then(res => {
              if (res.code === 200) {
                this.projects = res.data.rows
                this.total = res.data.total
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }
    },
    goBack() {
      this.currentPage = 1
      this.choice = '论文'
      this.achievementTitle = ''
      this.articleType = '标题'
      this.currentChange(this.currentPage)
      this.pageHide = false
    },
    addNewLog() {
      this.form.newLog = `${moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}:  ${this.form.newLog}`
      if (this.form.log) {
        this.form.log += ('\n' + this.form.newLog)
      } else {
        this.form.log = ('\n' + this.form.newLog)
      }
      this.form.newLog = ''
    }
  }
}
</script>