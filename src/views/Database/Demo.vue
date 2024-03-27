<template>
  <div>
    <el-table :data="demos">
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="时间" prop="time"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="editDemo(scope.$index, scope.row)">编辑</el-button>
          <el-button @click="deleteDemo(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="组" prop="group">
          <el-input v-model="form.group" placeholder="组"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="form.introduction" placeholder="简介"></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" placeholder="地点"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" autosize v-model="form.content" placeholder="内容"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-tag closable v-for="tag in form.keywords" :key="tag" @close="handleTagClose(tag)">{{ tag }}</el-tag>
          <el-input v-model="newTag" placeholder="新关键字"></el-input>
          <el-button @click="addNewTag">增加</el-button>
        </el-form-item>
      </el-form>
      <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
      <el-input v-model="rawName" placeholder="请输入图片名称"></el-input>
      <el-upload ref="photo" action="https://jsonplaceholder.typicode.com/posts/" :file-list="photoList"
                 :on-change="handleAddPhoto" :on-success="handleUploadPhotoSuccess" :on-preview="downloadPhoto"
                 :auto-upload="false" list-type="picture" :headers="{token: user.token}">
        <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadPhoto">上传到服务器
        </el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-upload ref="video" action="https://jsonplaceholder.typicode.com/posts/" :file-list="videoList"
                 :on-success="handleUploadVideoSuccess" :on-preview="downloadVideo"
                 :auto-upload="false" :headers="{token: user.token}">
        <el-button slot="trigger" size="small" type="primary">选取视频</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadVideo">上传到服务器
        </el-button>
      </el-upload>
      <el-button @click="formVisible = false">取消</el-button>
      <el-button @click="updateDemo">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: 'Demo',
  data() {
    return {
      photoList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      videoList: [
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
      demos: [
        {
          id: 1,
          title: '标题',
          time: '时间',
          group: "组",
          introduction: '简介',
          photoUrls: 'urls',
          videoUrls: 'urls',
          location: '地点',
          content: '内容',
          keywords: '1,2,3,4',
        },
      ],
      formVisible: false,
      tableIndex: -1,
      form: {},
      newTag: ''
    };
  },
  methods: {
    submitUploadPhoto() {
      this.$refs.photo.submit();
    },
    handleUploadPhotoSuccess(response, file, fileList) {
      this.photoList = fileList
    },
    handleAddPhoto(file, fileList) {
      this.date = moment(this.date).format('YYYY-MM-DD')
      file.name = this.date + '_' + this.rawName + file.name.substring(file.name.lastIndexOf('.'))
      this.rawName = ''
      this.date = ''
    },
    editDemo(index, activity) {
      this.formVisible = true
      this.form = activity
      this.tableIndex = index
      this.form.keywords = this.form.keywords.split(',')
    },
    deleteDemo(index, activity) {
      this.$request.delete('/')
          .then(res => {
            this.demos.splice(index, 1)
          }).catch(e => {
        this.$message.error(index + '在数据库中未被删除')
        this.demos.splice(index, 1)
      })
    },
    downloadPhoto(file) {
      window.open(file.url)
    },
    updateDemo() {
      this.$request.put('/', this.form)
          .then(res => {
            this.formVisible = false
            this.$set(this.demos, this.tableIndex, this.form)
          }).catch(e => {
        this.formVisible = false
        this.$set(this.demos, this.tableIndex, this.form)
      })
    },
    submitUploadVideo() {
      this.$refs.video.submit();
    },
    handleUploadVideoSuccess(response, file, fileList) {
      this.videoList = fileList
    },
    downloadVideo(file) {
      window.open(file.url)
    },
    handleTagClose(tag) {
      this.form.keywords.forEach((value, index, array) => {
        if (tag === value) {
          this.$message.info(JSON.stringify(tag))
          array.splice(index, 1)
        }
      })
    },
    addNewTag() {
      this.form.keywords.push(this.newTag)
    }
  }
}
</script>