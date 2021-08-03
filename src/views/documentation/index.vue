<template>
  <div class="documentationPage">
    <div class="searchWrapper">
      <el-select v-model="value" placeholder="下载状态" clearable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" style="margin-left:20px" @click="handleSearch">搜索</el-button>
    </div>
    <div class="tableWrapper">
      <div style="margin-bottom:10px">Tip：表格线可左右拖动</div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="id"
          label="文献ID"
        />
        <el-table-column
          prop="mobile"
          label="手机"
        />
        <el-table-column
          prop="journal"
          label="刊期"
        />
        <el-table-column
          prop="title"
          label="文献标题"
        />
        <el-table-column
          prop="source"
          label="来源"
        />
        <el-table-column
          prop="docOutId"
          label="来源内部ID"
        />
        <el-table-column
          prop="createTime"
          label="下载时间"
        />
        <el-table-column
          prop="status"
          label="下载状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status==='SUCCESS'">成功</span>
            <span v-if="scope.row.status==='WAITING'">等待</span>
            <span v-if="scope.row.status==='OVERLIMIT'">超限</span>
            <span v-if="scope.row.status==='FAIL'">失败</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <el-button size="small" type="warning" @click="handleNoFind(scope.row)">没找到</el-button>
            <el-button size="small" type="danger" @click="handleBackPrice(scope.row)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationPage">
      <el-pagination
        :current-page.sync="pageNum"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="uploadWrapper">
      <div class="uploadTitle">上传文件</div>
      <div class="uploadTips">
        同时上传一个或多个文件，最多同时选择50个文件
        <div class="tipsColor">上传成功的会留下，上传失败的会消失</div>
      </div>
      <div class="uploadNum">
        <div>上传成功数量：{{successNum}}，上传失败数：{{failNum}}</div>
        <el-button style="margin-left: 20px;" size="small" type="success" @click="clearUploadNum">清除计数</el-button>
      </div>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl"
        :on-remove="handleRemove"
        :on-success="handleSuccessUpload"
        :file-list="fileList"
        :limit="50"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <el-button style="margin-left: 10px;" size="small" type="danger" @click="deleteUploadFiles">删除所有</el-button>
        <div slot="tip" class="el-upload__tip">文件名必须是文献ID, 例如：4fb3d87baa4ccd72dcd9135fa13bf361.pdf</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { getList, notFound, refund, uploadFiles } from '../../api/literature'
export default {
  name: 'Documentation',
  data() {
    return {
      options: [{
        value: 'SUCCESS',
        label: '成功'
      }, {
        value: 'WAITING',
        label: '等待'
      }, {
        value: 'OVERLIMIT',
        label: '超限'
      }, {
        value: 'FAIL',
        label: '失败'
      }],
      value: '',
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      fileList: [],
      uploadUrl: process.env.VUE_APP_BASE_API + '/doc/ops/docs/upload',
      successNum: 0,
      failNum: 0
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      let params = {
        page: this.pageNum,
        size: this.pageSize
      }
      if (this.value) params.status = this.value
      let result = await getList(params)
      if (result.code === 200) {
        this.tableData = result.data.content
        this.totalCount = result.data.totalElements
      } else {
        this.$message.error(result.message)
      }
    },
    handleSearch() {
      this.pageNum = 1
      this.initData()
    },
    async handleNoFind(row) {
      let result = await notFound({lid: row.id})
      if (result.code === 200) {
        this.$message.success('操作成功！')
        this.initData()
      } else {
        this.$message.error(result.message)
      }
    },
    async handleBackPrice(row) {
      let params = {
        lid: row.id,
        uid: row.user
      }
      let result = await refund(params)
      if (result.code === 200) {
        this.$message.success('操作成功！')
        this.initData()
      } else {
        this.$message.error(result.message)
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.initData()
    },
    clearUploadNum() {
      this.successNum = 0
      this.failNum = 0
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccessUpload(res) {
      this.successNum +=res.data.success
      this.failNum += res.data.error
    },
    deleteUploadFiles() {
      this.fileList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.documentationPage {
  margin: 20px;
  .tableWrapper{
    margin: 20px 0;
  }
  .paginationPage{
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .uploadWrapper{
    .uploadTips{
      margin: 10px 0;
      .tipsColor{
        color: rgb(230, 162, 60)
      }
    }
    .uploadNum{
      border: 1px dashed rgb(230, 162, 60);
      padding: 10px 10px;
      display: flex;
      align-items: center;
      margin: 10px 0;
    }
  }
}
</style>
