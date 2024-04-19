<template>
  <div>
    <el-container>
      <el-header style="display: flex; flex-direction: column; align-items: flex-start">
        <div style="width: 270px ;display: flex; align-items: center; justify-content: space-between">
          <el-input
              v-model="queryActivityTitle"
              size="mini"
              style="width: 200px"
              placeholder="查询活动"/>
          <el-button @click="queryActivity">查询</el-button>
        </div>
        <el-button @click="addActivity">新增</el-button>
      </el-header>
      <el-main>
        <el-table
            :data="activities"
            stripe
            border>
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="时间" prop="date"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button @click="editActivity(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteActivity(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
          <el-form :model="form">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="时间" prop="date">
              <el-date-picker v-model="form.date" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="简介" prop="introduction">
              <el-input v-model="form.introduction" placeholder="简介"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <el-input type="textarea" autosize v-model="form.content" placeholder="内容">
              </el-input>
            </el-form-item>
          </el-form>
          <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
          <el-input v-model="rawName" placeholder="请输入图片名称"></el-input>
          <el-upload ref="photos"
                     :action="encodeURI(encodeURI(`http://localhost:8081/webActivity/${this.form.title}/photo/upload`))"
                     list-type="picture"
                     :multiple="false"
                     :auto-upload="false"
                     :file-list="photoList"
                     name="photos"
                     :on-change="handleChangePhoto"
                     :before-remove="handleRemovePhoto"
                     :on-success="handleUploadPhotoSuccess"
                     :on-preview="downloadPhoto"
                     :data="{'photoName': JSON.stringify(this.photoName)}"
                     :headers="{token: this.token}">
            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
            <el-button type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-button type="warning" @click="formVisible = false">取消</el-button>
          <el-button type="success" @click="updateActivity">确定</el-button>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: 'Activity',
  data() {
    return {
      token: sessionStorage.getItem('token'),
      photoList: [],
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      date: '',
      rawName: '',
      activities: [],
      formVisible: false,
      tableIndex: -1,
      form: {},
      queryActivityTitle: '',
      photoName: {},
    };
  },
  created() {
    this.$request.get('/webActivity/all')
        .then(res => {
          if (res.code === 200) {
            res.data.forEach(activity => {
              activity.date = activity.date.substring(0, 10)
            })
            this.activities = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    queryActivity() {
      this.$request.get('/webActivity/' + this.queryActivityTitle)
          .then(res => {
            if (res.code === 200) {
              this.activities = res.data
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    deleteActivity(index, activity) {
      this.$request.delete('/webActivity/' + activity.id)
          .then(res => {
            if (res.code === 200) {
              this.activities.splice(index, 1)
              this.$message.success('删除活动成功')
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
        this.$message.error(err)
      })
    },
    downloadPhoto(file) {
      let url = `http://localhost:8081/webActivity/${this.form.title}/photo/download/${file.name}`
      url = encodeURI(encodeURI(url))
      window.open(url)
    },
    addActivity() {
      this.tableIndex = -1
      this.form = {}
      this.form.urls = []
      this.photoList = []
      this.formVisible = true
    },
    submitUpload() {
      this.$refs.photos.submit()
    },
    editActivity(index, activity) {
      this.form = JSON.parse(JSON.stringify(activity))
      this.tableIndex = index
      this.photoList = []
      if (this.form.urls === '') {
        this.form.urls = []
      } else {
        this.form.urls = this.form.urls.split('\n')
        this.photoList = this.form.urls.map(photoUrl => {
          const fileName = photoUrl.substring(photoUrl.lastIndexOf('/') + 1)
          return {url: photoUrl, name: fileName}
        })
      }
      this.photoName = {}
      this.formVisible = true
    },
    handleChangePhoto(file, fileList) {
      if (file.status === 'ready') { // 添加文件
        this.date = moment(this.date).format('YYYY-MM-DD')
        const newName = this.date + '_' + this.rawName + file.name.substring(
            file.name.lastIndexOf('.')
        )
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
        const index = this.form.urls.indexOf(file.url)
        this.form.urls.splice(index, 1)
      }
    },
    handleUploadPhotoSuccess(response, file, fileList) {
      if (this.tableIndex !== -1) { // 修改
        this.form.urls = this.form.urls.concat(response.data.urls.split('\n'))
      } else { // 新增
        this.form.urls = response.data.urls.split('\n')
      }
    },
    updateActivity() {
      this.formVisible = false
      this.form.date = moment(this.form.date).format('YYYY-MM-DD')
      this.form.date += ' 00:00:00'
      this.form.urls = this.form.urls.join('\n')
      if (this.tableIndex === -1) { // 增加
        this.$request.post('/webActivity', this.form)
            .then(res => {
              if (res.code === 200) {
                this.form.id = res.data.id
                this.activities.push(this.form)
                this.$set(this.activities, this.activities.length - 1, this.form)
                this.$message.success('新增活动成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      } else { // 修改
        this.$request.put('/webActivity', this.form)
            .then(res => {
              if (res.code === 200) {
                this.$set(this.activities, this.tableIndex, this.form)
                this.$message.success('修改活动成功')
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
          this.$message.error(err)
        })
      }
      this.form.date = this.form.date.substring(0, 10)
    },
  }
}
</script>