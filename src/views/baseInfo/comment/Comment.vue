<template>
  <div>
    <div class="block">
      <el-input
        v-model="content"
        placeholder="内容"
        style="width: 200px"
      ></el-input>
      <el-button
        @click="searchBtn"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 20px"
        size="small"
        >搜索</el-button
      >
    </div>
    <div class="block" style="margin-top: 20px">
      <el-table
        :data="commentMain"
        max-height="450"
        style="width: 100%"
        stripe
        ref="multipleTable"
      >
        <el-table-column label="评论ID" prop="id"> </el-table-column>
        <el-table-column label="评论人" prop="userName"> </el-table-column>
        <el-table-column label="内容" prop="content"> </el-table-column>
        <el-table-column label="地区" prop="detailNetherlands">
        </el-table-column>
        <el-table-column label="小区" prop="community"> </el-table-column>
        <el-table-column label="门牌号" prop="houseNumber"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              class="el-icon-edit"
              @click="lookReply(scope.row)"
              >查看回复</el-button
            >
            <el-button
              type="danger"
              size="small"
              class="el-icon-edit"
              @click="deleteCommentMain(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        background
        @current-change="handleCurrentChangeMain"
        :current-page.sync="mainCurrentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="mainTotal"
      >
      </el-pagination>
    </div>
    <el-dialog title="评论回复" :visible.sync="commentReply" append-to-body>
      <div class="block">
        <el-input
          v-model="deputyContent"
          placeholder="内容"
          style="width: 200px"
        ></el-input>
        <el-button
          @click="searchDeputyBtn"
          type="primary"
          icon="el-icon-search"
          style="margin-left: 20px"
          size="small"
          >搜索</el-button
        >
      </div>
      <div class="block" style="margin-top: 20px">
        <el-table
          :data="commentDeputy"
          max-height="450"
          style="width: 100%"
          stripe
          ref="multipleTable"
        >
          <el-table-column label="评论人" prop="userName"> </el-table-column>
          <el-table-column label="内容" prop="content"> </el-table-column>
          <el-table-column label="被回复人" prop="replyName"> </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="small"
                class="el-icon-edit"
                @click="deleteDeputyComment(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChangeDeputy"
          :current-page.sync="deputyCurrentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="deputyTotal"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../../network/request";
export default {
  data() {
    return {
      content: "",
      commentMain: [],
      commentDeputy: [],
      mainCurrentPage: 1,
      pageSize: 5,
      mainTotal: 0,
      commentReply: false,
      deputyCurrentPage: 1,
      deputyTotal: 0,
      mainId: 0,
      deputyContent: "",
      deleteMain:0,
      deleteDeputy:0
    };
  },
  methods: {
    searchBtn() {
      this.getComments(1);
    },
    searchDeputyBtn() {
      this.getCommentsDeputy(1);
    },
    handleCurrentChangeMain(val) {
      this.getComments(val);
    },
    handleCurrentChangeDeputy(val) {
      this.getCommentsDeputy(val);
    },
    getComments(page) {
      request({
        url: "/comment/all-main",
        params: {
          content: this.content,
          page: page,
          pageSize: 5,
        },
      }).then((res) => {
        this.commentMain = res.data.data;
        this.total = res.data.total;
        this.mainCurrentPage = res.data.currentPage;
      });
    },
    lookReply(row) {
      this.commentReply = true;
      this.mainId = row.id;
      this.getCommentsDeputy(1);
    },
    getCommentsDeputy(val) {
      request({
        url: "/comment/deputy-mainId",
        params: {
          content: this.deputyContent,
          mainId: this.mainId,
          page: val,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        this.commentDeputy = res.data.data;
        this.deputyTotal = res.data.total;
        this.deputyCurrentPage = res.data.currentPage;
      });
    },
    deleteCommentMain(id) {
       this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: "/comment/delete-mainId",
            method: "delete",
            data: { id: id },
          }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getComments(1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deleteDeputyComment(id) {
       this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: "/comment/delete-deputyId",
            method: "delete",
            data: { id: id },
          }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getCommentsDeputy(1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.getComments(1);
  },
};
</script>


<style>
</style>