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
    <el-dialog :visible.sync="formVisible">
      <el-form>

      </el-form>
      <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
      <el-input v-model="rawName" placeholder="请输入图片名称"></el-input>
      <el-upload ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList"
                 :on-change="handleAdd" :on-success="handleUploadSuccess"
                 :auto-upload="false" list-type="picture" :headers="{token: user.token}">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";

export default {
  name: 'Demo',
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
      demos: [
        {
          id: 1,
          title: '标题',
          time: '时间',
          group: '组',
          introduction: '简介',
          photoUrls: 'urls',
          location: '地点',
          content: '内容',
          keywords: '关键字',
        },
      ],
      formVisible: false
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
    editDemo(index, demo) {
      this.formVisible = true
    },
    deleteDemo(index, demo) {
    },
  }
}
</script>