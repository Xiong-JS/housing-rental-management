<template>
  <div>
    <div class="block">
      <el-button
        @click="addBtnNetherlands('addNetherlands')"
        type="success"
        size="small"
        class="el-icon-plus"
        style="margin-left: 1200px"
        >新增</el-button
      >
    </div>
    <div class="block" style="margin-top: 20px">
      <el-table
        :data="netherlands"
        max-height="450"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column label="ID" sortable prop="netherlandsId">
        </el-table-column>
        <el-table-column label="城市名称" prop="countryName"> </el-table-column>
        <el-table-column label="地区名称" prop="netherlandsName">
        </el-table-column>

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
    <el-dialog title="地区增加" :visible.sync="addFormVisible" append-to-body>
      <el-form :model="addNetherlands" ref="addNetherlands">
        <el-form-item
          label="城市"
          :label-width="formLabelWidth"
          prop="countryId"
        >
          <el-select
            v-model="addNetherlands.countryId"
            clearable
            placeholder="请选择城市"
            @visible-change="countryChange"
            style="width: 342px"
          >
            <el-option
              v-for="item in countries"
              :key="item.countryId"
              :label="item.countryName"
              :value="item.countryId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="地区"
          :label-width="formLabelWidth"
          prop="netherlandsName"
        >
          <el-input
            v-model="addNetherlands.netherlandsName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNetherlandsConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../../network/request";
export default {
  data() {
    return {
      countries: [],
      netherlands: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      addFormVisible: false,
      formLabelWidth: "120px",
      addNetherlands: {
        countryId: "",
        netherlandsName: "",
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
            url: "/netherlands",
            method: "delete",
            data: { netherlandsId: row.netherlandsId },
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
    addBtnNetherlands(formName) {
      this.addFormVisible = true;
      this.addNetherlands.countryId = '';
      this.addNetherlands.netherlandsName = "";
    },
    handleSelectionChange() {},
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      request({
        url: "/netherlands",
        params: {
          limit: val,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            this.netherlands = res.data.data;
            this.currentPage = res.data.currentPage;
            this.total = res.data.total;
          }
        })
        .catch((err) => {});
    },
    addNetherlandsConfirm() {
      request({
        url: "/netherlands",
        method: "put",
        data: {
          netherlandsName: this.addNetherlands.netherlandsName,
          countryId: this.addNetherlands.countryId,
        },
      }).then((res) => {
        this.$message.success("添加成功");
        this.addFormVisible = false;
        this.handleCurrentChange(1);
      });
    },
    countryChange() {
      request({
        url: "/house/countries",
      }).then((res) => {
        this.countries = res.data.data;
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