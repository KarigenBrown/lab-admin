<template>
  <div>
    <el-table :data="activities">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="时间" prop="time"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="editActivity(scope.$index, scope.row)">编辑</el-button>
          <el-button @click="deleteActivity(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="form.introduction" placeholder="简介"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" autosize v-model="form.content" placeholder="内容"></el-input>
        </el-form-item>
      </el-form>
      <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
      <el-input v-model="rawName" placeholder="请输入图片名称"></el-input>
      <el-upload ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList"
                 :on-change="handleAdd" :on-success="handleUploadSuccess" :on-preview="downloadPhoto"
                 :auto-upload="false" list-type="picture" :headers="{token: user.token}">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-button @click="formVisible = false">取消</el-button>
      <el-button @click="updateActivity">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: 'Activity',
  data() {
    return {
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      date: '',
      rawName: '',
      activities: [
        {
          id: 1,
          title: '标题',
          time: '时间',
          introduction: '简介',
          photoUrls: 'urls',
          content: '内容',
        },
      ],
      formVisible: false,
      tableIndex: -1,
      form: {},
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleUploadSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    handleAdd(file, fileList) {
      this.date = moment(this.date).format('YYYY-MM-DD')
      file.name = this.date + '_' + this.rawName + file.name.substring(file.name.lastIndexOf('.'))
      this.rawName = ''
      this.date = ''
    },
    editActivity(index, activity) {
      this.formVisible = true
      this.form = activity
      this.tableIndex = index
      this.form.keywords = this.form.keywords.split(',')
    },
    deleteActivity(index, activity) {
      this.$request.delete('/')
          .then(res => {
            this.activities.splice(index, 1)
          }).catch(e => {
        this.$message.error(index + '在数据库中未被删除')
        this.activities.splice(index, 1)
      })
    },
    downloadPhoto(file) {
      window.open(file.url)
    },
    updateActivity() {
      this.$request.put('/', this.form)
          .then(res => {
            this.formVisible = false
            this.$set(this.activities, this.tableIndex, this.form)
          }).catch(e => {
        this.formVisible = false
        this.$set(this.activities, this.tableIndex, this.form)
      })
    },
  }
}
</script>