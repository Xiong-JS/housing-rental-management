<template>
  <div>
    <div class="block">
      <el-button
        @click="addBtnDetailNetherlands()"
        type="success"
        size="small"
        class="el-icon-plus"
        style="margin-left: 1200px"
        >新增</el-button
      >
    </div>
    <div class="block" style="margin-top: 20px">
      <el-table
        :data="detailNetherlands"
        max-height="450"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column label="ID" sortable prop="detailNetherlandsId">
        </el-table-column>
        <el-table-column label="城市名称" prop="countryName"> </el-table-column>
        <el-table-column label="地区名称" prop="netherlandsName">
        </el-table-column>
        <el-table-column label="详细地区名称" prop="detailNetherlandsName">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              class="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              type="primary"
              size="small"
              class="el-icon-more"
              @click="lookCommunity(scope.row)"
            >
              查看小区
            </el-button>
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
    <!-- 新增地区 -->
    <el-dialog title="地区增加" :visible.sync="addFormVisible" append-to-body>
      <el-form :model="addDetailNetherlands" ref="addDetailNetherlands">
        <el-form-item
          label="城市"
          :label-width="formLabelWidth"
          prop="countryId"
        >
          <el-select
            v-model="addDetailNetherlands.countryId"
            clearable
            placeholder="请选择城市"
            @visible-change="getCountries"
            @change="countryChange"
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
          prop="netherlandsId"
        >
          <el-select
            v-model="addDetailNetherlands.netherlandsId"
            clearable
            placeholder="请选择地区"
            style="width: 342px"
          >
            <el-option
              v-for="item in netherlands"
              :key="item.netherlandsId"
              :label="item.netherlandsName"
              :value="item.netherlandsId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="详细地区"
          :label-width="formLabelWidth"
          prop="detailNetherlandsName"
        >
          <el-input
            v-model="addDetailNetherlands.detailNetherlandsName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDetailNetherlandsConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 小区信息 -->
    <el-dialog
      :title="detailNetherlandsName + '小区信息'"
      :visible.sync="communityVisible"
      append-to-body
    >
      <div class="block">
        <div class="block">
          <el-button
            @click="addBtnCommunity()"
            type="success"
            size="small"
            class="el-icon-plus"
            >新增</el-button
          >
        </div>
        <div class="block" style="margin-top: 20px">
          <el-table
            :data="communities"
            max-height="450"
            style="width: 100%"
            stripe
            border
            @selection-change="handleSelectionChange"
            ref="multipleTable"
          >
            <el-table-column label="ID" sortable prop="communityId">
            </el-table-column>
            <el-table-column label="城市名称" prop="countryName">
            </el-table-column>
            <el-table-column label="地区名称" prop="netherlandsName">
            </el-table-column>
            <el-table-column
              label="详细地区名称"
              prop="detailNetherlandsName"
              width="200"
            >
            </el-table-column>
            <el-table-column label="小区名称" prop="communityName">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="small"
                  class="el-icon-delete"
                  @click="handleCommunityDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="block">
          <el-pagination
            background
            @current-change="handleCommunityCurrentChange"
            :current-page.sync="communityCurrentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="communityTotal"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>

    <!-- 新增小区 -->
    <el-dialog
      title="小区增加"
      :visible.sync="addCommunityFormVisible"
      append-to-body
    >
      <el-form :model="addCommunity" ref="addCommunity">
        <el-form-item
          label="城市"
          :label-width="formLabelWidth"
          prop="countryId"
        >
          <el-input
            v-model="countryName"
            auto-complete="off"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item
          label="地区"
          :label-width="formLabelWidth"
          prop="netherlandsId"
        >
          <el-input
            v-model="netherlandsName"
            auto-complete="off"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item
          label="详细地区"
          :label-width="formLabelWidth"
          prop="detailNetherlandsId"
        >
          <el-input
            v-model="detailNetherlandsName"
            auto-complete="off"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item
          label="小区"
          :label-width="formLabelWidth"
          prop="community"
        >
          <el-input
            v-model="addCommunity.communityName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCommunityFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCommunityConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../../network/request";
export default {
  data() {
    return {
      countryName: "",
      netherlandsName: "",
      detailNetherlandsName: "",
      countries: [],
      netherlands: [],
      communities: [],
      otherNetherlands: [],
      detailNetherlands: [],
      otherDetailNetherlands: [],
      currentPage: 1,
      communityCurrentPage: 1,
      communityTotal: 0,
      pageSize: 5,
      total: 0,
      addFormVisible: false,
      communityVisible: false,
      addCommunityFormVisible: false,
      formLabelWidth: "120px",
      addDetailNetherlands: {
        countryId: "",
        netherlandsId: "",
        detailNetherlandsName: "",
      },
      addCommunity: {
        countryId: "",
        netherlandsId: "",
        detailNetherlandsId: "",
        communityName: "",
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
            url: "/detailNetherlands",
            method: "delete",
            data: { detailNetherlandsId: row.detailNetherlandsId },
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
    handleCommunityDelete(row){
      this.$confirm("此操作将永久删除该城市, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: "/community",
            method: "delete",
            data: { communityId: row.communityId },
          }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.handleCommunityCurrentChange(1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleCommunityCurrentChange(val) {
      request({
        url: "/community",
        params: {
          limit: val,
          pageSize: this.pageSize,
          detailNetherlandsId: this.addCommunity.detailNetherlandsId,
          netherlandsId: this.addCommunity.netherlandsId,
          countryId: this.addCommunity.countryId,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          this.communities = res.data.data;
          this.communityTotal = res.data.total;
          this.communityCurrentPage = res.data.currentPage;
        }
      });
    },
    lookCommunity(row) {
      this.communityVisible = true;
      this.detailNetherlandsName = row.detailNetherlandsName;
      this.addCommunity.detailNetherlandsId = row.detailNetherlandsId;
      this.addCommunity.netherlandsId = row.netherlandsId;
      this.addCommunity.countryId = row.countryId;
      this.countryName = row.countryName;
      this.netherlandsName = row.netherlandsName;
      this.handleCommunityCurrentChange(1);
    },
    addBtnDetailNetherlands() {
      this.addFormVisible = true;
      this.countries = [];
      this.addDetailNetherlands.netherlandsName = "";
    },
    handleSelectionChange() {},
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      request({
        url: "/detailNetherlands",
        params: {
          limit: val,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            this.detailNetherlands = res.data.data;
            this.currentPage = res.data.currentPage;
            this.total = res.data.total;
          }
        })
        .catch((err) => {});
    },
    addDetailNetherlandsConfirm() {
      request({
        url: "/detailNetherlands",
        method: "put",
        data: {
          detailNetherlandsName: this.addDetailNetherlands
            .detailNetherlandsName,
          countryId: this.addDetailNetherlands.countryId,
          netherlandsId: this.addDetailNetherlands.netherlandsId,
        },
      }).then((res) => {
        this.$message.success("添加成功");
        this.addFormVisible = false;
        this.handleCurrentChange(1);
      });
    },
    addCommunityConfirm() {
      request({
        url: "/community",
        method: "put",
        data: {
          detailNetherlandsId: this.addCommunity.detailNetherlandsId,
          countryId: this.addCommunity.countryId,
          netherlandsId: this.addCommunity.netherlandsId,
          communityName: this.addCommunity.communityName,
        },
      }).then((res) => {
        this.$message.success("添加成功");
        this.addCommunityFormVisible = false;
        this.handleCommunityCurrentChange(1);
      });
    },
    getCountries() {
      request({
        url: "/house/countries",
      }).then((res) => {
        this.countries = res.data.data;
      });
    },
    countryChange(val) {
      request({
        url: "/house/netherlands",
        params: {
          countryId: this.addDetailNetherlands.countryId,
        },
      }).then((res) => {
        this.netherlands = res.data.data;
      });
    },
    countryOtherChange(val) {
      request({
        url: "/house/netherlands",
        params: {
          countryId: this.addCommunity.countryId,
        },
      }).then((res) => {
        this.otherNetherlands = res.data.data;
      });
    },
    netherlandsChange(val) {
      request({
        url: "/house/detailNetherlands",
        params: {
          countryId: this.addCommunity.countryId,
          detailNetherlandsId: this.addCommunity.detailNetherlandsId,
        },
      }).then((res) => {
        this.otherDetailNetherlands = res.data.data;
      });
    },
    addBtnCommunity() {
      this.addCommunityFormVisible = true;
    },
  },
  created() {
    this.handleCurrentChange(1);
  },
};
</script>

<style>
</style>