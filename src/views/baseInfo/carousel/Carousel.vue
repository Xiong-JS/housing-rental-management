<template>
  <div>
    <div class="block">
      <el-button
        @click="addBtnCarouse"
        type="success"
        size="small"
        class="el-icon-plus"
        style="margin-left: 1200px"
        >新增</el-button
      >
    </div>
    <div class="block" style="margin-top: 20px">
      <el-table
        :data="carousel"
        max-height="450"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column label="ID" sortable prop="id" width="60">
        </el-table-column>
        <el-table-column label="轮播图样图">
          <template slot-scope="scope">
            <el-image
              style="width: 150px; height: 100px; object-fit: contain"
              :src="scope.row.imgUrl"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="轮播图地址" prop="imgUrl" width="450">
        </el-table-column>
        <el-table-column label="轮播图标题" prop="imgTitle"> </el-table-column>

        <el-table-column fixed="right" label="操作" width="170">
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
              class="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
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
    <!-- 修改对话框 -->
    <el-dialog title="标题修改" :visible.sync="editFormVisible" append-to-body>
      <el-form :model="formData">
        <el-form-item label="轮播图标题" :label-width="formLabelWidth">
          <el-input v-model="formData.imgTitle" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCarouselConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog title="轮播图增加" :visible.sync="addFormVisible" append-to-body>
      <el-form :model="addCarousel">
        <el-form-item label="轮播图" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :data="imgData"
          >
            <img
              v-if="addCarousel.imgUrl"
              :src="addCarousel.imgUrl"
              class="avatar"
              style="width: 100px; height: 100px"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input
            v-model="addCarousel.imgTitle"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCarouselConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../../network/request";
export default {
  data() {
    return {
      carousel: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      uploadUrl: "http://localhost:8080/imgUpload",
      headers: { "u-token": localStorage.getItem("uToken") },
      editFormVisible: false,
      addFormVisible: false,
      formLabelWidth: "120px",
      formData: {
        id: 0,
        imgTitle: "",
      },
      imgData: "",
      addCarousel: {
        imgUrl: "",
        imgTitle: "",
      },
    };
  },
  methods: {
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该轮播图, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: "/carousel",
            method: "delete",
            data: { id: row.id },
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
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.formData.imgTitle = row.imgTitle;
      this.formData.id = row.id;
    },
    editCarouselConfirm() {
      request({
        url: "/carousel",
        method: "patch",
        data: {
          id: this.formData.id,
          imgTitle: this.formData.imgTitle,
        },
      }).then((res) => {
        this.$message.success("修改成功!");
        this.handleCurrentChange(1);
      });
      this.editFormVisible = false;
    },
    addBtnCarouse() {
      this.addFormVisible = true;
      this.imgData = {
        path: "bishe/carousel",
      };
      this.addCarousel.imgTitle = "";
      this.addCarousel.imgUrl = "";
    },
    handleSelectionChange() {},
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      request({
        url: "/carousel",
        params: {
          limit: val,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          // console.log(res.data);
          console.log(res.data.code);
          if (res.data.code == "200") {
            console.log(res.data.data);
            this.carousel = res.data.data;
            this.currentPage = res.data.currentPage;
            this.total = res.data.total;
          }
        })
        .catch((err) => {});
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.addCarousel.imgUrl = res.data;
      this.$message.success("上传成功");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      return isJPG;
    },
    addCarouselConfirm() {
      request({
        url: "/carousel",
        method: "put",
        data: {
          imgUrl: this.addCarousel.imgUrl,
          imgTitle: this.addCarousel.imgTitle,
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
    request({
      url: "/carousel",
      params: {
        limit: 1,
        pageSize: this.pageSize,
      },
    })
      .then((res) => {
        this.carousel = res.data.data;
        this.total = res.data.total;
        console.log(res);
      })
      .catch((err) => {});
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>