<template>
  <div>
    <el-container>
      <el-page-header @back="goBack" content="Demo详情">
      </el-page-header>
      <el-header style="display: flex; flex-direction: column; align-items: flex-start">
        <div style="width: 270px ;display: flex; align-items: center; justify-content: space-between">
          <el-input
              v-model="queryDemoTitle"
              size="mini"
              style="width: 200px"
              placeholder="查询活动"/>
          <el-button @click="queryDemo">查询</el-button>
        </div>
        <el-button @click="addDemo">新增</el-button>
      </el-header>
      <el-main>
        <el-table
            :data="demos"
            stripe
            border>
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="时间" prop="time"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button @click="editDemo(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteDemo(scope.$index, scope.row)">删除</el-button>
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
            <el-form-item label="时间" prop="time">
              <el-date-picker v-model="form.time" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="组" prop="group">
              <el-input v-model="form.group" placeholder="组"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="introduction">
              <el-input type="textarea" autosize v-model="form.introduction" placeholder="简介"></el-input>
            </el-form-item>
            <el-form-item label="地点" prop="location">
              <el-input v-model="form.location" placeholder="地点"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <el-input type="textarea" autosize v-model="form.content" placeholder="内容">
              </el-input>
            </el-form-item>
            <el-form-item label="关键字" prop="keywords">
              <el-tag closable v-for="tag in form.keywords" :key="tag" @close="handleTagClose(tag)">
                {{ tag }}
              </el-tag>
              <el-input v-model="newTag" placeholder="新关键字" style="margin-bottom: 10px"></el-input>
              <el-button @click="addNewTag">增加关键字</el-button>
            </el-form-item>
          </el-form>
          <br>
          <div>
            <el-date-picker v-model="date" type="date" placeholder="选择日期"
                            style="margin-bottom: 10px"></el-date-picker>
            <el-input v-model="rawName" placeholder="请输入图片名称" style="margin-bottom: 10px"></el-input>
            <el-upload
                ref="photos"
                action="http://localhost:8081/webDemo/photo/upload"
                list-type="picture"
                :multiple="false"
                :auto-upload="false"
                :file-list="photoList"
                name="photos"
                :on-change="handleChangePhoto"
                :before-remove="handleRemovePhoto"
                :on-success="handleUploadPhotoSuccess"
                :data="{'title': this.form.title, 'photoName': JSON.stringify(this.photoName)}"
                :headers="{token: this.token}">
              <el-button slot="trigger" size="small" type="primary" style="margin-right: 10px">选取图片</el-button>
              <el-button size="small" type="success" @click="submitUploadPhoto">上传到服务器
              </el-button>
            </el-upload>
          </div>
          <br>
          <el-upload
              ref="videos"
              action="http://localhost:8081/webDemo/video/upload"
              :multiple="false"
              :auto-upload="false"
              :file-list="videoList"
              name="videos"
              :before-remove="handleRemoveVideo"
              :on-success="handleUploadVideoSuccess"
              :data="{'title': this.form.title}"
              :headers="{token: this.token}">
            <el-button slot="trigger" size="small" type="primary" style="margin-right: 10px">选取视频</el-button>
            <el-button size="small" type="success" @click="submitUploadVideo">上传到服务器
            </el-button>
          </el-upload>
          <br>
          <div>
            <el-button type="warning" @click="formVisible = false">取消</el-button>
            <el-button type="success" @click="updateDemo">确定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: 'Demo',
  data() {
    return {
      token: sessionStorage.getItem('token'),
      photoList: [],
      videoList: [],
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      date: '',
      rawName: '',
      demos: [],
      formVisible: false,
      photoName: {},
      tableIndex: -1,
      form: {},
      newTag: '',
      queryDemoTitle: '',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      pageHide: false
    };
  },
  created() {
    this.$request.get(`/webDemo/all/${this.pageSize}/${this.currentPage}`)
        .then(res => {
          if (res.code === 200) {
            res.data.rows.forEach(demo => {
              demo.time = demo.time.substring(0, 10)
            })
            this.demos = res.data.rows
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    queryDemo() {
      this.$request.get('/webDemo/' + this.queryDemoTitle)
          .then(res => {
            if (res.code === 200) {
              res.data.forEach(demo => {
                demo.time = demo.time.substring(0, 10)
              })
              this.demos = res.data
              this.pageHide = true
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    deleteDemo(index, demo) {
      this.$request.delete('/webDemo/' + demo.id)
          .then(res => {
            if (res.code === 200) {
              this.demos.splice(index, 1)
              this.$message.success('删除Demo成功')
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    editDemo(index, demo) {
      this.form = JSON.parse(JSON.stringify(demo))
      this.tableIndex = index

      this.photoList = []
      if (this.form.photoUrls === '') {
        this.form.photoUrls = []
      } else {
        this.form.photoUrls = this.form.photoUrls.split('\n')
        this.photoList = this.form.photoUrls.map(photoUrl => {
          const fileName = photoUrl.substring(photoUrl.lastIndexOf('/') + 1)
          return {url: photoUrl, name: decodeURI(fileName)}
        })
      }
      this.photoName = {}

      this.videoList = []
      if (this.form.videoUrls === '') {
        this.form.videoUrls = []
      } else {
        this.form.videoUrls = this.form.videoUrls.split('\n')
        this.videoList = this.form.videoUrls.map(videoUrl => {
          const fileName = videoUrl.substring(videoUrl.lastIndexOf('/') + 1)
          return {url: videoUrl, name: decodeURI(fileName)}
        })
      }
      this.formVisible = true
      this.form.keywords = this.form.keywords === '' ? [] : this.form.keywords.split(',')
    },
    submitUploadPhoto() {
      this.$refs.photos.submit();
    },
    submitUploadVideo() {
      this.$refs.videos.submit();
    },
    addNewTag() {
      this.form.keywords.push(this.newTag)
      this.newTag = ''
    },
    handleTagClose(tag) {
      this.form.keywords.forEach((value, index, array) => {
        if (tag === value) {
          array.splice(index, 1)
        }
      })
    },
    handleUploadPhotoSuccess(response, file, fileList) {
      if (this.tableIndex !== -1) { // 修改
        this.form.photoUrls = this.form.photoUrls.concat(response.data.photoUrls.split('\n'))
      } else { // 新增
        this.form.photoUrls = response.data.photoUrls.split('\n')
      }
    },
    handleUploadVideoSuccess(response, file, fileList) {
      if (this.tableIndex !== -1) { // 修改
        this.form.videoUrls = this.form.videoUrls.concat(response.data.videoUrls.split('\n'))
      } else { // 新增
        this.form.videoUrls = response.data.videoUrls.split('\n')
      }
    },
    handleChangePhoto(file, fileList) {
      if (file.status === 'ready') { // 添加文件
        this.date = moment(this.date).format('YYYY-MM-DD')
        const newName = this.date + '_' + this.rawName + file.name.substring(
            file.name.lastIndexOf('.')
        )

        if (file.size / 1024 / 1024 > 200) {
          this.$message.error('文件过大')
        }
        if (this.photoName[file.name]) {
          this.$message.error('原始文件名重复')
        }
        const values = Object.values(this.photoName)
        fileList.filter(file => file.status === 'success').forEach(file => values.push(file.name))
        for (const value in values) {
          if (value === newName) {
            this.$message.error('新文件名重复')
          }
        }

        this.photoName[file.name] = newName
        file.name = newName

        this.rawName = ''
        this.date = ''
      }
    },
    handleRemovePhoto(file, fileList) {
      if (file.status === 'ready') {
        Object.keys(this.photoName).forEach(fileName => {
          if (fileName === file.name) {
            this.photoName[fileName] = undefined
          }
        })
      } else if (file.status === 'success') {
        const index = this.form.photoUrls.indexOf(file.url)
        this.form.photoUrls.splice(index, 1)
      }
    },
    handleRemoveVideo(file, fileList) {
      if (file.status === 'success') {
        const index = this.form.videoUrls.indexOf(file.url)
        this.form.videoUrls.splice(index, 1)
      }
    },
    updateDemo() {
      this.formVisible = false
      this.form.time = moment(this.form.time).format('YYYY-MM-DD')
      this.form.time += ' 00:00:00'
      this.form.photoUrls = this.form.photoUrls.join('\n')
      this.form.videoUrls = this.form.videoUrls.join('\n')
      this.form.keywords = this.form.keywords.join(',')
      if (this.tableIndex === -1) { // 增加
        this.$request.post('/webDemo', this.form)
            .then(res => {
              if (res.code === 200) {
                this.form.id = res.data.id
                this.demos.push(this.form)
                this.$set(this.demos, this.demos.length - 1, this.form)
                this.$message.success('新增Demo成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else { // 修改
        this.$request.put('/webDemo', this.form)
            .then(res => {
              if (res.code === 200) {
                this.$set(this.demos, this.tableIndex, this.form)
                this.$message.success('修改Demo成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }
      this.form.time = this.form.time.substring(0, 10)
    },
    addDemo() {
      this.tableIndex = -1
      this.form = {}
      this.form.photoUrls = []
      this.form.videoUrls = []
      this.form.keywords = []
      this.photoList = []
      this.videoList = []
      this.formVisible = true
    },
    currentChange(currentPage) {
      this.currentPage = currentPage
      this.$request.get(`/webDemo/all/${this.pageSize}/${this.currentPage}`)
          .then(res => {
            if (res.code === 200) {
              res.data.rows.forEach(demo => {
                demo.time = demo.time.substring(0, 10)
              })
              this.demos = res.data.rows
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
      this.queryDemoTitle = ''
    }
  }
}
</script>