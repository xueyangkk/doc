<template>
  <div class="statisicsDataPage">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="请选择日期时间">
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleChangeDate"
          align="right">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="userNumWrapper">
      <div class="wrapperTitle">今日用户统计</div>
      <el-table
        :data="userTableData"
        center
        style="width: 100%">
        <el-table-column prop="row1" label="安卓 - 中文" align="center"></el-table-column>
        <el-table-column prop="row2" label="安卓 - 英文" align="center"></el-table-column>
        <el-table-column prop="row3" label="苹果 - 中文	" align="center"></el-table-column>
        <el-table-column prop="row4" label="苹果 - 英文	" align="center"></el-table-column>
        <el-table-column prop="row5" label="微信 - 中文	" align="center"></el-table-column>
        <el-table-column prop="row6" label="微信 - 英文	" align="center"></el-table-column>
        <el-table-column prop="row7" label="其他 - 中文	" align="center"></el-table-column>
        <el-table-column prop="row8" label="其他 - 英文" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="userNumWrapper">
      <div class="wrapperTitle">今日服务器统计</div>
      <div>缓存包括远程</div>
      <el-table
        :data="serveData"
        style="width: 100%">
        <el-table-column prop="title" label="" align="center"></el-table-column>
        <el-table-column prop="wf" label="万方" align="center"></el-table-column>
        <el-table-column prop="wp" label="维普" align="center"></el-table-column>
        <el-table-column prop="zw" label="知网" align="center"></el-table-column>
        <el-table-column prop="pm" label="PubMed" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getAllData } from '../../api/sourceData'
export default {
  data() {
    return {
      form: {
        date: ''
      },
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      userTableData: [],
      serveData: []
    }
  },
  methods: {
    handleChangeDate(val) {
      if (val) {
        this.initData()
      } else {
        this.userTableData = []
        this.serveData = []
      }
    },
    async initData() {
      let params = {}
      if (this.form.date) params.startTime = new Date(this.form.date[0]).getTime()
      if (this.form.date) params.endTime = new Date(this.form.date[1]).getTime()
      let result = await getAllData(params)
      if (result.code === 200) {
        this.serveData = [
          {title: '从缓存', wf: result.data.daySource[1].fromCache, wp: result.data.daySource[2].fromCache, zw: result.data.daySource[3].fromCache, pm: result.data.daySource[0].fromCache},
          {title: '从远程', wf: result.data.daySource[1].fromRemote, wp: result.data.daySource[2].fromRemote, zw: result.data.daySource[3].fromRemote, pm: result.data.daySource[0].fromRemote}
        ]
        this.userTableData = [
          { 
            row1: result.data.dayClient[2].count,
            row2: result.data.dayClient[3].count,
            row3: result.data.dayClient[4].count,
            row4: result.data.dayClient[5].count,
            row5: result.data.dayClient[6].count,
            row6: result.data.dayClient[7].count,
            row7: result.data.dayClient[8].count,
            row8: result.data.dayClient[9].count
          }
        ]
        console.log('111', result)
      } else {
        this.$message.error(result.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.statisicsDataPage{
  margin: 20px;
  .userNumWrapper{
    margin-top: 20px;
    .wrapperTitle{
      font-size: 26px;
      font-weight: bold;
      color: #999;
      margin: 10px 0;
    }
  }
}
</style>