<template>
  <div>
    <el-container>
      <el-header>
        <el-select v-model="choice" placeholder="请选择" @change="typeChange">
          <el-option v-for="item in types" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-input
            v-model="achievementTitle"
            size="mini"
            placeholder="查询活动"/>
        <el-radio v-model="articleType" label="年份">年份</el-radio>
        <el-radio v-model="articleType" label="期刊（首字母）">期刊（首字母）</el-radio>
        <el-radio v-model="articleType" label="作者">作者</el-radio>
        <el-button @click="queryAchievement">查询</el-button>
        <el-button @click="addAchievement">新增</el-button>
      </el-header>
      <el-main v-if="isReloadData">
        <div v-if="choice !== '项目'">
          <el-table :data="nonProjectAchievements">
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="期刊" prop="journal"></el-table-column>
            <el-table-column label="第一作者" prop="author"></el-table-column>
            <el-table-column label="其他作者" prop="authors"></el-table-column>
            <el-table-column label="时间" prop="date"></el-table-column>
            <el-table-column v-if="choice === '论文'" label="论文状态" prop="articleStatus">
              <template v-slot="scope">
                {{ scope.row.articleStatus === 0 ? '草稿' : '已发布' }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button @click="editNonProject(scope.$index, scope.row)">编辑</el-button>
                <el-button @click="deleteNonProject(scope.$index, scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
            <el-form :model="form">
              <el-form-item label="id" prop="id"></el-form-item>
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="标题"></el-input>
              </el-form-item>
              <el-form-item label="期刊" prop="journal">
                <el-input v-model="form.journal" placeholder="期刊"></el-input>
              </el-form-item>
              <el-form-item label="第一作者" prop="author">
                <el-input v-model="form.author" placeholder="第一作者"></el-input>
              </el-form-item>
              <el-form-item label="其他作者" prop="authors">
                <el-input v-model="form.authors" placeholder="其他作者"></el-input>
              </el-form-item>
              <el-form-item label="时间" prop="date">
                <el-date-picker v-model="form.date" type="date" placeholder="时间"></el-date-picker>
              </el-form-item>
              <el-form-item label="详情页链接" prop="link">
                <el-input v-model="form.link" placeholder="详情页链接"></el-input>
              </el-form-item>
              <el-form-item label="代码" prop="papercode">
                <el-input v-model="form.papercode" placeholder="代码"></el-input>
              </el-form-item>
              <el-form-item label="代码" prop="papercode">
                <el-input v-model="form.papercode" placeholder="代码"></el-input>
              </el-form-item>
              <el-form-item label="论文年份" prop="theyear">
                <el-input v-model="form.theyear" placeholder="论文年份"></el-input>
              </el-form-item>
              <el-form-item label="摘要" prop="abstract">
                <el-input v-model="form.abstract" placeholder="摘要"></el-input>
              </el-form-item>
              <el-form-item label="类别" prop="category">
                <el-select v-model="form.category">
                  <el-option v-for="item in ['论文', '专利', '著作', '软著', '技术标准', '竞赛获奖']" :key="item"
                             :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="论文首字母" prop="initials">
                <el-input v-model="form.initials" placeholder="论文首字母"></el-input>
              </el-form-item>
              <el-form-item v-if="form.category === '论文'" label="是否为实验室内部论文" prop="internal">
                <el-radio v-model="form.internal" label="1">是</el-radio>
                <el-radio v-model="form.internal" label="0">否</el-radio>
              </el-form-item>
              <el-form-item v-if="form.category === '论文'" label="论文状态" prop="articleStatus">
                <el-steps :active="form.articleStatus" finish-status="success">
                  <el-step title="草稿"></el-step>
                  <el-step title="已发布"></el-step>
                </el-steps>
                <el-button @click="nextStatus">下一步</el-button>
              </el-form-item>
              <el-form-item v-else-if="form.category === '技术标准'" label="技术标准状态" prop="techniqueStatus">
                <el-steps :active="form.techniqueStatus" finish-status="success">
                  <el-step title="申请中"></el-step>
                  <el-step title="已授权"></el-step>
                </el-steps>
                <el-button @click="nextStatus">下一步</el-button>
              </el-form-item>
              <el-form-item label="是否隐藏" prop="hidden">
                <el-radio v-model="form.hidden" label="1">是</el-radio>
                <el-radio v-model="form.hidden" label="0">否</el-radio>
              </el-form-item>
            </el-form>
            <el-button @click="formVisible = false">取消</el-button>
            <el-button @click="updateNonProject">确定</el-button>
          </el-dialog>
        </div>

        <div v-if="choice === '项目'">
          <el-table :data="projects">
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="项目名称" prop="name"></el-table-column>
            <el-table-column label="项目年份" prop="theyear"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button @click="editProject(scope.$index, scope.row)">编辑</el-button>
                <el-button @click="deleteProject(scope.$index, scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
            <el-form :model="form">
              <el-table-column label="id" prop="id"></el-table-column>
              <el-table-column label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="项目名称"></el-input>
              </el-table-column>
              <el-table-column label="项目链接" prop="link">
                <el-input v-model="form.link" placeholder="项目链接"></el-input>
              </el-table-column>
              <el-form-item label="项目年份" prop="theyear">
                <el-input v-model="form.theyear" placeholder="项目年份"></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <el-input v-model="form.content" placeholder="内容"></el-input>
              </el-form-item>
              <el-table-column label="项目状态" prop="status">
                <el-steps :active="form.status" finish-status="success">
                  <el-step title="在研"></el-step>
                  <el-step title="结题"></el-step>
                </el-steps>
                <el-button @click="nextStatus">下一步</el-button>
              </el-table-column>
            </el-form>
            <el-button @click="formVisible = false">取消</el-button>
            <el-button @click="updateProject">确定</el-button>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import moment from "moment/moment";

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
          status: 0
        }, {
          id: 2,
          name: '项目2',
          link: '项目链接2',
          theyear: '项目年份2',
          status: 1
        },
      ],
      nonProjects: [
        {
          id: 1,
          title: 'title',
          journal: 'journal',
          author: 'author',
          authors: 'authors',
          date: '2020-01-01',
          link: 'url',
          papercode: 'code',
          theyear: '2020',
          abstract: 'abstract',
          category: '论文',
          initials: 'j',
          internal: '1',
          articleStatus: 0,
          hidden: '1',
          techniqueStatus: 0
        },
        {
          id: 1,
          title: 'title',
          journal: 'journal',
          author: 'author',
          authors: 'authors',
          date: '2020-01-01',
          link: 'url',
          papercode: 'code',
          theyear: '2020',
          abstract: 'abstract',
          category: '技术标准',
          initials: 'j',
          internal: '1',
          articleStatus: 0,
          hidden: '1',
          techniqueStatus: 0
        }
      ],
      nonProjectAchievements: [],
      isReloadData: true,
      formVisible: false,
      form: {},
      achievementTitle: '',
      articleType:''
    }
  },
  created() {
    this.nonProjects.filter((value, index, array) => {
      return value.category === '论文'
    }).forEach((value, index, array) => {
      this.nonProjectAchievements.push(value)
    })
  },
  methods: {
    typeChange() {
      this.nonProjectAchievements = []
      if (this.choice === '项目') {

      } else {
        this.nonProjects.filter((value, index, array) => {
          return value.category === this.choice
        }).forEach((value, index, array) => {
          this.nonProjectAchievements.push(value)
        })
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
      // this.$request.put('/', this.form)
      //     .then(res => {
      //       this.formVisible = false
      //       this.$set(this.users, this.formIndex, this.form)
      //     }).catch(e => {
      //   this.formVisible = false
      //   this.$set(this.users, this.formIndex, this.form)
      // })
      this.formVisible = false
      if (this.tableIndex === -1) {
        this.projects.push(this.form)
        this.$set(this.projects, this.users.length - 1, this.form)
      } else {
        this.$set(this.projects, this.formIndex, this.form)
      }
    },
    editNonProject(index, row) {
      // this.$request.put('/', row)
      //     .then(res => {
      //       this.form = JSON.parse(JSON.stringify(row))
      //       this.formVisible = true
      //       this.formIndex = index
      //     }).catch(e => {
      //   this.form = JSON.parse(JSON.stringify(row))
      //   this.formVisible = true
      //   this.formIndex = index
      // })
      this.form = JSON.parse(JSON.stringify(row))
      this.formVisible = true
      this.formIndex = index
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
      // this.$request.put('/', this.form)
      //     .then(res => {
      //       this.formVisible = false
      //       this.$set(this.users, this.formIndex, this.form)
      //     }).catch(e => {
      //   this.formVisible = false
      //   this.$set(this.users, this.formIndex, this.form)
      // })
      this.formVisible = false
      this.form.date = moment(this.form.date).format('YYYY-MM-DD')
      if (this.tableIndex === -1) {
        this.nonProjectAchievements.push(this.form)
        this.$set(this.nonProjectAchievements, this.users.length - 1, this.form)
      } else {
        this.$set(this.nonProjectAchievements, this.formIndex, this.form)
      }
    },
    nextStatus() {
      if (this.form.category === '论文' && this.form.articleStatus < 2) {
        this.form.articleStatus++
      } else if (this.form.category === '技术标准' && this.form.techniqueStatus < 2) {
        this.form.techniqueStatus++
      } else if (this.choice === '项目' && this.form.status < 2) {
        this.form.status++
      }
    },
    queryAchievement() {
      if (this.choice === '项目') {

      } else {

      }
    },
    addAchievement() {
      this.tableIndex = -1
      this.form = {}
      this.formVisible = true
    }
  }
}
</script>