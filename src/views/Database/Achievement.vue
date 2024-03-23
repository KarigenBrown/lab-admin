<template>
  <div>
    <el-container>
      <el-header>
        <el-select v-model="choice" placeholder="请选择" @change="handleChange">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-header>
      <el-main>
        <div>
          <div v-if="choice === '论文'">
            论文
          </div>
          <div v-else-if="choice === '专利'">
            专利
          </div>
          <div v-else-if="choice === '项目'">
            项目
          </div>
          <div v-else-if="choice === '著作'">
            著作
          </div>
          <div v-else-if="choice === '软著'">
            软著
          </div>
          <div v-else-if="choice === '技术标准'">
            技术标准
          </div>
          <div v-else-if="choice === '竞赛获奖'">
            竞赛获奖
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Achievement',
  data() {
    return {
      options: [{
        value: '论文',
        label: '论文'
      }, {
        value: '专利',
        label: '专利'
      }, {
        value: '项目',
        label: '项目'
      }, {
        value: '著作',
        label: '著作'
      }, {
        value: '软著',
        label: '软著'
      }, {
        value: '技术标准',
        label: '技术标准'
      }, {
        value: '竞赛获奖',
        label: '竞赛获奖'
      }],
      choice: ''
    }
  },
  methods: {
    handleChange(choice) {
      this.$message.info(choice)
      //this.request.get()
    }
  }
}
</script>