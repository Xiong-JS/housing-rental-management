<template>
  <div>
    <div class="block">
      <el-input
        v-model="inputName"
        placeholder="用户姓名"
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
      <el-button
        @click="deleteBtnUsers"
        type="danger"
        size="small"
        class="el-icon-delete"
        style="margin-left: 200px"
        >删除</el-button
      >
      <el-button
        @click="addBtnUser"
        type="success"
        size="small"
        class="el-icon-plus"
        style="margin-left: 20px"
        >新增</el-button
      >
    </div>
    <div class="block" style="margin-top: 20px">
      <el-table
        :data="users"
        max-height="450"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="用户姓名">
                <span>{{ props.row.userName }}</span>
              </el-form-item>
              <el-form-item label="用户账号">
                <span>{{ props.row.userAccount }}</span>
              </el-form-item>
              <el-form-item label="用户密码">
                <span>{{ props.row.userPassword }}</span>
              </el-form-item>
              <el-form-item label="用户头像">
                <img
                  :src="props.row.userImg"
                  style="width: 100px; height: 100px"
                />
              </el-form-item>
              <el-form-item label="用户注册时间">
                <span>{{ props.row.userRegisterTime }}</span>
              </el-form-item>
              <el-form-item label="零钱">
                <span>{{ props.row.userWallet }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="用户 ID" sortable prop="id"> </el-table-column>
        <el-table-column label="用户账号" prop="userAccount"> </el-table-column>
        <el-table-column label="用户姓名" prop="userName"> </el-table-column>
        <el-table-column label="用户密码" prop="userPassword">
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
    <el-dialog title="用户修改" :visible.sync="editFormVisible" append-to-body>
      <el-form :model="formData">
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="formData.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" :label-width="formLabelWidth">
          <el-input
            v-model="formData.userAccount"
            auto-complete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input
            v-model="formData.userPassword"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户头像" :label-width="formLabelWidth">
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
              v-if="formData.userImg"
              :src="formData.userImg"
              class="avatar"
              style="width: 100px; height: 100px"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <el-input v-model="addUser.userImg" auto-complete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="用户注册时间" :label-width="formLabelWidth">
          <el-input
            v-model="formData.userRegisterTime"
            auto-complete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="零钱" :label-width="formLabelWidth">
          <el-input
            v-model="formData.userWallet"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增用户 -->
    <el-dialog title="用户增加" :visible.sync="addFormVisible" append-to-body>
      <el-form :model="addUser">
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="addUser.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" :label-width="formLabelWidth">
          <el-input
            v-model="addUser.userAccount"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input
            v-model="addUser.userPassword"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户头像" :label-width="formLabelWidth">
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
              v-if="addUser.userImg"
              :src="addUser.userImg"
              class="avatar"
              style="width: 100px; height: 100px"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <el-input v-model="addUser.userImg" auto-complete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="零钱" :label-width="formLabelWidth">
          <el-input v-model="addUser.userWallet" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as types from "../../store/mutations-type-string";
import request from "../../network/request";

export default {
  data() {
    return {
      users: [],
      inputName: "",
      currentPage: 1,
      total: 0,
      pageSize: 8,
      multipleSelection: [],
      editFormVisible: false,
      addFormVisible: false,
      userIds: [],
      uploadUrl: "http://localhost:8080/imgUpload",
      headers: { "u-token": localStorage.getItem("uToken") },
      imgData: "",
      formData: {
        id: "",
        userName: "",
        userAccount: "",
        userPassword: "",
        userImg: "",
        userRegisterTime: "",
        userWallet: "",
      },
      addUser: {
        id: "",
        userName: "",
        userAccount: "",
        userPassword: "",
        userImg: "",
        userWallet: "",
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      request({
        url: "/user/userList",
        params: {
          page: val,
          num: this.pageSize,
          userName: this.inputName,
        },
      })
        .then((res) => {
          // console.log(res.data);
          if (res.data.code == "200") {
            this.users = res.data.data;
            this.currentPage = res.data.currentPage;
            this.total = res.data.total;
          }
        })
        .catch((err) => {});
    },
    searchBtn() {
      // handleCurrentChange(1);
      this.handleCurrentChange(1);
    },
    handleEdit(index, row) {
      this.formData.id = row.id;
      this.formData.userName = row.userName;
      this.formData.userAccount = row.userAccount;
      this.formData.userPassword = row.userPassword;
      this.formData.userImg = row.userImg;
      this.formData.userRegisterTime = row.userRegisterTime;
      this.formData.userWallet = row.userWallet;
      this.editFormVisible = true;
      this.imgData = {
        path: "bishe/user",
      };
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: "/user/userDelete",
            method: "post",
            data: {
              id: row.id,
            },
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
      // console.log(index, row);
    },
    handleSelectionChange(val) {
      // console.log(val);
      this.multipleSelection = val;
    },
    editUserConfirm() {
      request({
        url: "/user/userEdit",
        method: "post",
        data: {
          id: this.formData.id,
          userName: this.formData.userName,
          userPassword: this.formData.userPassword,
          userImg: this.formData.userImg,
          userWallet: this.formData.userWallet,
        },
      })
        .then((res) => {
          console.log("userEdit", res);
          this.handleCurrentChange(1);
        })
        .catch((err) => {});
      this.editFormVisible = false;
    },
    deleteBtnUsers() {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.userIds.join(",");
          console.log(this.userIds);
          request({
            url: "/user/usersDelete",
            method: "post",
            data: JSON.stringify(this.userIds),
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

      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.userIds[i] = this.multipleSelection[i].id;
      }
    },
    handleAvatarSuccess(res, file) {
      this.addUser.userImg = res.data
      this.formData.userImg = res.data
      this.$message.success("上传成功");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addBtnUser() {
      this.addUser.id = "";
      this.addUser.userName = "";
      this.addUser.userAccount = "";
      this.addUser.userPassword = "";
      this.addUser.userImg = "";
      this.addUser.userWallet = "";
      this.imgData = {
        path: "bishe/user",
      };
      this.addFormVisible = true;
    },
    addUserConfirm() {
      request({
        url: "/user",
        method: "post",
        data: {
          userName: this.addUser.userName,
          userAccount: this.addUser.userAccount,
          userPassword: this.addUser.userPassword,
          userImg: this.addUser.userImg,
          userWallet: this.addUser.userWallet,
        },
      }).then((res) => {
        this.addFormVisible = false;
        if (res.data.code == "000") {
          this.$message.error(res.data.msg);
        } else {
          this.$message.success(res.data.msg);
          this.handleCurrentChange(1);
        }
        console.log(res);
      });
    },
  },
  beforeCreate() {
    request({
      url: "/manager/managerById",
      params: {
        id: localStorage.getItem("id"),
      },
    }).then((res) => {
      if (res.data.code == "200") {
        this.$store.commit(types.SETMANAGER, res.data.data[0]);
      }
    });
  },
  //data初始化后el还没绑定时
  created() {
    request({
      url: "/user/userList",
      params: {
        page: 1,
        num: this.pageSize,
        userName: this.inputName,
      },
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.code == "200") {
          this.users = res.data.data;
          this.currentPage = res.data.currentPage;
          this.total = res.data.total;
        }
      })
      .catch((err) => {});
    // console.log(this.users);
    // console.log("------");
  },
};
</script>


<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-table--border th.gutter:last-of-type {
  display: table-cell !important;
  width: 50px !important;
}
</style>