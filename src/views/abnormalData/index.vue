<template>
  <div class="sourceDataPage">
    <div class="tableWrapper">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        height="650"
      >
        <el-table-column
          prop="title"
          label="标题"
        />
        <el-table-column
          prop="volume"
          label="日期"
        />
        <el-table-column
          prop="type"
          label="类型"
        />
        <el-table-column
          prop="source"
          label="来源"
        />
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="45%">
      <el-form ref="form" label-width="120px">
        <el-form-item label="采集网站">
          <span>{{detailsInfo.site}}</span>
        </el-form-item>
        <el-form-item label="网站对应ID">
          <span>{{detailsInfo.key}}</span>
        </el-form-item>
        <el-form-item label="发布年份">
          <span>{{detailsInfo.years}}</span>
        </el-form-item>
        <el-form-item label="数量">
          <span>{{detailsInfo.num}}</span>
        </el-form-item>
        <el-form-item label="爬取时间">
          <span>{{detailsInfo.created}}</span>
        </el-form-item>
        <el-form-item label="标题">
          <span>{{detailsInfo.title}}</span>
        </el-form-item>
        <el-form-item label="文献地址">
          <span>{{detailsInfo.url}}</span>
        </el-form-item>
        <el-form-item label="关键字">
          <span>{{detailsInfo.keywordList}}</span>
        </el-form-item>
        <el-form-item label="页码">
          <span>{{detailsInfo.pagination}}</span>
        </el-form-item>
        <el-form-item label="摘要">
          <span>{{detailsInfo.summary}}</span>
        </el-form-item>
        <el-form-item label="单位">
          <span>{{detailsInfo.unitList}}</span>
        </el-form-item>
        <el-form-item label="期数">
          <span>{{detailsInfo.volume}}</span>
        </el-form-item>
        <el-form-item label="作者">
          <span>{{detailsInfo.authorList}}</span>
        </el-form-item>
        <el-form-item label="CN">
          <span>{{detailsInfo.cn}}</span>
        </el-form-item>
        <el-form-item label="名称">
          <span>{{detailsInfo.journalName}}</span>
        </el-form-item>
        <el-form-item label="来源">
          <span>{{detailsInfo.source}}</span>
        </el-form-item>
        <el-form-item label="是否入库">
          <span>{{detailsInfo.checkFlag==0?'未入库':'已入库'}}</span>
        </el-form-item>
        <el-form-item label="文献类型">
          <span>{{detailsInfo.type}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAbnormalDataList, abnormalDataDelete } from '../../api/sourceData'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      tableData: [],
      dialogVisible: false,
      detailsInfo: {}
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let result = await getAbnormalDataList(params)
      if (result.code === 200) {
        this.tableData = result.data.results || result.data.list
        this.totalCount = result.data.total
      } else {
        this.$message.err(result.message)
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.initData()
    },
    handleView(row) {
      this.detailsInfo = row
      this.dialogVisible = true
    },
    async handleDelete(row) {
      this.$confirm('是否删除此数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let result = await abnormalDataDelete(row.id)
          if (result.code === 200) {
            this.$message.success('操作成功！')
            this.initData()
          } else {
            this.$message.error(result.message)
          }
        }).catch(() => {        
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.sourceDataPage {
  margin: 20px;
  .tableWrapper{
    margin: 20px 0;
  }
  .paginationPage{
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>