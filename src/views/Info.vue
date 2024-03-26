<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-image :src="userInfo.photoUrl"></el-image>
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
        <el-upload :show-file-list="false">
          <el-image v-if="form.photoUrl" :src="form.photoUrl"/>
          <i v-else class="el-icon-plus"></i>
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
      userInfo: {
        id: 1,
        name: '123',
        number: '123',
        photoUrl: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        identity: '在校生',
        grade: '123',
        graduationTime: '',
        graduationDestination: '',
        contact: '联系方式',
        research: '研究方向',
        achievement: '成就',
        introduction: '简介',
      },
      formVisible: false,
      form: {}
    }
  },
  methods: {
    editUser() {
      this.form = JSON.parse(JSON.stringify(this.userInfo))
      this.formVisible = true
    },
    updateUserInfo() {
      this.$request.put('/', this.userInfo)
          .then(res => {
            this.userInfo = this.form
            this.formVisible = false
          }).catch(e => {
        this.userInfo = this.form
        this.formVisible = false
        this.$message.error('结果未到数据库中修改')
      })
    }
  }
}
</script>
<script setup>
</script>