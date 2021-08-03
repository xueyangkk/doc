<template>
  <div class="guidePage">
    <div class="searchWrapper">
      <el-input v-model="searchVal" placeholder="请输入内容" style="width:200px"></el-input>
      <el-button type="primary" style="margin-left:20px" @click="handleSearch">搜索</el-button>
    </div>
    <div class="tableWrapper">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        height="650"
      >
        <el-table-column
          prop="title"
          label="案例标题"
        />
        <!-- <el-table-column
          prop="content"
          label="案例内容"
        /> -->
        <el-table-column
          prop="date"
          label="案例日期"
        />
        <el-table-column
          prop="date"
          label="评分标准"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="scope.row.gradeList">{{JSON.parse(scope.row.gradeList).grade}}</div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleUpdate(scope.row, 'edit')">编辑</el-button>
            <el-button size="small" @click="handleUpdate(scope.row, 'view')">查看</el-button>
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
      :title="diaslogTitle"
      :visible.sync="dialogVisible"
      width="45%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="案例名称">
          <el-input v-model="form.title" :disabled="editId?false:true"></el-input>
        </el-form-item>
        <el-form-item label="案例链接">
          <el-input v-model="form.link" disabled></el-input>
        </el-form-item>
        <el-form-item label="案例内容">
          <el-input type="textarea" v-model="form.content" :rows="10" :disabled="editId?false:true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSureUpdate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="dialogDetails"
      width="50%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="案例名称">
          <span>{{form.title}}</span>
        </el-form-item>
        <el-form-item label="案例链接">
          <span>{{form.link}}</span>
        </el-form-item>
        <el-form-item label="案例内容">
          <span>{{form.content}}</span>
        </el-form-item>
        <el-form-item label="评分标准" v-if="form.gradeList">
          <span>{{JSON.parse(form.gradeList).grade}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDetails = false">取 消</el-button>
        <el-button type="primary" @click="dialogDetails = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCaseList, getCaseDetails, caseUpdate, caseDelete } from '../../api/caseList'
export default {
  name: 'Guide',
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      searchVal: '',
      dialogVisible: false,
      form: {},
      editId: '',
      diaslogTitle: '',
      dialogDetails: false
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
      if (this.searchVal) params.query = this.searchVal
      let result = await getCaseList(params)
      if (result.code === 200) {
        this.tableData = result.data.results
        this.totalCount = result.data.total
      } else {
        this.$message.err(result.message)
      }
    },
    handleSearch() {
      this.pageNum = 1
      this.initData()
    },
    async handleUpdate(row, type) {
      let result = await getCaseDetails({ id: row.id })
      if (result.code === 200) {
        if (type === 'edit') {
          this.diaslogTitle = '编辑'
          this.editId = row.id
          this.dialogVisible = true
        } else {
          this.diaslogTitle = '查看'
          this.editId = ''
          this.dialogDetails = true
        }
        this.form = result.data
      } else {
        this.$message.error(result.message)
      }
    },
    async handleSureUpdate() {
      if (this.editId) {
        let result = await caseUpdate(this.form)
        if (result.code === 200) {
          this.$message.success('操作成功！')
          this.initData()
          this.dialogVisible = false
        }
      } else {
        this.dialogVisible = false
      }
    },
    async handleDelete(row) {
      this.$confirm('是否删除此案例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let result = await caseDelete({ id: row.id })
          if (result.code === 200) {
            this.$message.success('操作成功！')
            this.initData()
          } else {
            this.$message.error(result.message)
          }
        }).catch(() => {        
        });
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.guidePage{
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
