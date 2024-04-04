<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-avatar :src="userInfo.photoUrl" shape="square" :size="250" :key="userInfo.photoUrl"></el-avatar>
      </el-col>
      <el-col :span="16">
        <el-descriptions title="用户信息" v-model="userInfo">
          <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="学工号">{{ userInfo.number }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ userInfo.contact }}</el-descriptions-item>
          <el-descriptions-item label="身份">{{ userInfo.identity }}</el-descriptions-item>
          <el-descriptions-item v-if="userInfo.identity === '在校生'" label="年级">
            {{ userInfo.grade }}
          </el-descriptions-item>
          <el-descriptions-item v-if="userInfo.identity === '毕业生'" label="毕业时间">
            {{ userInfo.graduationTime }}
          </el-descriptions-item>
          <el-descriptions-item v-if="userInfo.identity === '毕业生'" label="毕业去向">
            {{ userInfo.graduationDestination }}
          </el-descriptions-item>
          <el-descriptions-item label="研究方向">{{ userInfo.research }}</el-descriptions-item>
          <el-descriptions-item label="成就">{{ userInfo.achievement }}</el-descriptions-item>
          <el-descriptions-item label="简介">{{ userInfo.introduction }}</el-descriptions-item>
        </el-descriptions>
        <el-button @click="editUser">编辑</el-button>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form :model="form">
        <el-upload
            ref="photo"
            action="http://localhost:8081/webMember/photo"
            list-type="picture"
            :limit="1"
            :multiple="false"
            :auto-upload="false"
            :file-list="photoList"
            name="photo"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :data="this.headers">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact">{{ form.contact }}</el-input>
        </el-form-item>
        <el-form-item label="研究方向" prop="research">
          <el-input type="textarea" autosize v-model="form.research">{{ form.research }}</el-input>
        </el-form-item>
        <el-form-item label="成就" prop="achievement">
          <el-input type="textarea" autosize v-model="form.achievement">{{ form.achievement }}</el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input type="textarea" autosize v-model="form.introduction">{{ form.introduction }}</el-input>
        </el-form-item>
      </el-form>
      <el-button @click="formVisible = false">取消</el-button>
      <el-button @click="updateUserInfo">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Info',
  data() {
    return {
      userInfo: {},
      formVisible: false,
      form: {},
      headers: {},
      photoList: []
    }
  },
  created() {
    sessionStorage.setItem('userNumber', '123')

    let userNumber = sessionStorage.getItem('userNumber')
    this.$request.get('/webMember/' + userNumber)
        .then(res => {
          this.userInfo = res.data
          this.photoList.push({url: this.userInfo.photoUrl})
        }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    editUser() {
      this.form = JSON.parse(JSON.stringify(this.userInfo))
      this.formVisible = true
    },
    beforeUpload(file) {
      const extendFileName = file.name.substring(file.name.lastIndexOf('.'))
      this.headers.photoName = this.form.number + extendFileName
    },
    uploadSuccess(response, file, fileList) {
      this.form.photoUrl = response.data.photoUrl
      this.$request.put('/webMember', this.form)
          .then(res => {
            this.userInfo = this.form
            this.formVisible = false
            this.userInfo.photoUrl += '?_=' + new Date().getTime()
            this.$message.success('修改成功')
          }).catch(err => {
        this.$message.error(err)
      })
    },
    updateUserInfo() {
      this.$refs.photo.submit()
    },
  }
}
</script>
<script setup>
</script>