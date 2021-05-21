<template>
  <div>
    <div class="block">
      <el-button
        @click="addBtnCountry"
        type="success"
        size="small"
        class="el-icon-plus"
        style="margin-left: 1200px"
        >新增</el-button
      >
    </div>
    <div class="block" style="margin-top: 20px">
      <el-table
        :data="country"
        max-height="450"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column label="ID" sortable prop="countryId">
        </el-table-column>
        <el-table-column label="城市名称" prop="countryName"> </el-table-column>

        <el-table-column fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              class="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 新增 -->
    <el-dialog title="城市增加" :visible.sync="addFormVisible" append-to-body>
      <el-form :model="addCountry">
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input
            v-model="addCountry.countryName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCountryConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../../network/request";
export default {
  data() {
    return {
      country: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      addFormVisible: false,
      formLabelWidth: "120px",
      addCountry: {
        countryName: "",
      },
    };
  },
  methods: {
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该城市, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: "/country",
            method: "delete",
            data: { countryId: row.countryId },
          }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.handleCurrentChange(1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addBtnCountry() {
      this.addFormVisible = true;
      this.addCountry.countryName = "";
    },
    handleSelectionChange() {},
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      request({
        url: "/country",
        params: {
          limit: val,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            this.country = res.data.data;
            this.currentPage = res.data.currentPage;
            this.total = res.data.total;
          }
        })
        .catch((err) => {});
    },
    addCountryConfirm() {
      request({
        url: "/country",
        method: "put",
        data: {
          countryName: this.addCountry.countryName,
        },
      }).then((res) => {
        this.$message.success("添加成功");
        this.addFormVisible = false;
        this.handleCurrentChange(1);
      });
    },
    getManager() {
      request({
        url: "/manager/managerById",
        params: {
          id: localStorage.getItem("id"),
        },
      }).then((res) => {
        if (res.data.msg == "NoUser" || res.data.code == "000004") {
          this.$message.error("未登录,请登录!");
          setTimeout(() => {
            window.location.href =
              "http://127.0.0.1:8083/housing-rental-management/login.html";
          }, 1000);
          return;
        }
      });
    },
  },
  created() {
    this.getManager();
    this.handleCurrentChange(1);
  },
};
</script>

<style>
</style>