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
    </div>
    <div class="block" style="margin-top: 20px">
      <el-table :data="users" height="450" style="width: 100%">
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
                  src="../../assets/img/p_big3.jpg"
                  style="width: 100px; height: 100px"
                />
                <span>{{ props.row.userImg }}</span>
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

        <el-table-column fixed="right" label="操作" width="200">
          <template>
            <el-button type="danger" size="small" class="el-icon-delete"
              >删除</el-button
            >
            <el-button type="primary" size="small" class="el-icon-edit"
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
          console.log(res.data);
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
      this.handleCurrentChange(1)
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
        userName:this.inputName
      },
    })
      .then((res) => {
        console.log(res.data);
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
</style>