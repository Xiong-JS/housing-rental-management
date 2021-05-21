<template>
  <div>
    <div class="block">
      <el-input
        v-model="inputName"
        placeholder="租赁人"
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
        :data="rentalSituations"
        max-height="450"
        style="width: 100%"
        stripe
        ref="multipleTable"
      >
        <el-table-column label="租户姓名" prop="rentalName">
        </el-table-column>
        <el-table-column label="地区" prop="detailNetherlands">
        </el-table-column>
        <el-table-column label="小区" prop="community"> </el-table-column>
        <el-table-column label="门牌号" prop="houseNumber"> </el-table-column>
        <el-table-column label="租赁时间" prop="startDate" width="200px"> </el-table-column>
        <el-table-column label="退租时间" prop="endDate" width="200px"> </el-table-column>
        <el-table-column label="应租月份" prop="shouldMonth"> </el-table-column>
        <el-table-column label="实租月份" prop="inFactMonth"> </el-table-column>
        <el-table-column label="退还金额" prop="returnMoney"> </el-table-column>
        <el-table-column label="状态" prop="state" :formatter="stateFormat">
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        background
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
import request from "../../network/request";
export default {
  data() {
    return {
      inputName: "",
      rentalSituations: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
    };
  },
  methods: {
    searchBtn() {
      this.getRentalSituation(1)
    },
    handleCurrentChange(val) {
      this.getRentalSituation(val)
    },
    getRentalSituation(page) {
      request({
        url: "/rental_situation/all",
        params: {
          rentalName: this.inputName,
          page: page,
          pageSize: 5,
        },
      }).then((res) => {
        console.log(res.data);
        this.rentalSituations = res.data.data;
        this.total = res.data.total
        this.currentPage = res.data.currentPage
        console.log(this.total);
      });
    },
    stateFormat(row, column) {
      if (row.state == 0) {
        return "未租赁";
      } else if (row.state == 1) {
        return "正在租赁";
      }
    },
    getManager(){
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
        return
      }
    });
  },
  },
  created() {
    this.getManager()
    this.getRentalSituation(1);
  },
};
</script>


<style>
</style>