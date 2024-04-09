<template>
  <div>
    <el-form :model="userInfo">
      <el-form-item label="姓名" prop="name">
        {{ userInfo.name }}
        <el-checkbox v-model="userInfoHidden.name">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item label="学工号" prop="number">
        {{ userInfo.number }}
        <el-checkbox v-model="userInfoHidden.number">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        {{ userInfo.contact }}
        <el-checkbox v-model="userInfoHidden.contact">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item label="身份" prop="identity">
        {{ userInfo.identity }}
        <el-checkbox v-model="userInfoHidden.identity">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item v-if="userInfo.identity === '在校生'" label="年级" prop="grade">
        {{ userInfo.grade }}
        <el-checkbox v-model="userInfoHidden.grade">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item v-if="userInfo.identity === '毕业生'" label="毕业时间" prop="graduationTime">
        {{ userInfo.graduationTime }}
        <el-checkbox v-model="userInfoHidden.graduationTime">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item
          v-if="userInfo.identity === '毕业生'"
          label="毕业去向"
          prop="graduationDestination">
        {{ userInfo.graduationDestination }}
        <el-checkbox v-model="userInfoHidden.graduationDestination">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item label="研究方向" prop="research">
        {{ userInfo.research }}
        <el-checkbox v-model="userInfoHidden.research">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item label="成就" prop="achievement">
        {{ userInfo.achievement }}
        <el-checkbox v-model="userInfoHidden.achievement">隐藏</el-checkbox>
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
        {{ userInfo.introduction }}
        <el-checkbox v-model="userInfoHidden.introduction">隐藏</el-checkbox>
      </el-form-item>
      <el-button @click="updateHiddenFields">确定</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Persona',
  data() {
    return {
      userInfo: {},
      userInfoHidden: {}
    }
  },
  created() {
    const userNumber = sessionStorage.getItem('number')
    this.$request.get('/webMember/' + userNumber)
        .then(res => {
          this.userInfo = res.data
          this.userInfo.hiddenFields = this.userInfo.hiddenFields === '' ? [] : this.userInfo.hiddenFields.split(',')
          this.userInfoHidden = JSON.parse(JSON.stringify(this.userInfo))
          Object.keys(this.userInfoHidden).forEach(key => this.userInfoHidden[key] = false)
          this.userInfo.hiddenFields.forEach(field => this.userInfoHidden[field] = true)
        }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    updateHiddenFields() {
      let hiddenFields = []
      Object.keys(this.userInfoHidden).forEach(key => {
        if (this.userInfoHidden[key]) {
          hiddenFields.push(key)
        }
      })
      this.userInfo.hiddenFields = hiddenFields.join(',')
      this.$request.put('/webMember', this.userInfo)
          .then(res => {
            this.$message.success('修改成功')
          }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>