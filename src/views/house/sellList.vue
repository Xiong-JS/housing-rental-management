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
        :data="indents"
        max-height="450"
        style="width: 100%"
        stripe
        ref="multipleTable"
      >
      <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="地区">
                <span>{{ props.row.detailNetherlands }}</span>
              </el-form-item>
             <el-form-item label="小区">
                <span>{{ props.row.community }}</span>
              </el-form-item>
              <el-form-item label="门牌号">
                <span>{{ props.row.houseNumber }}</span>
              </el-form-item>
              <el-form-item label="租金">
                <span>￥{{ props.row.rentalMoney }}</span>
              </el-form-item>
              <el-form-item label="押金">
                <span>￥{{ props.row.cashPledge }}</span>
              </el-form-item>
              <el-form-item label="总金额">
                <span>￥{{ props.row.totalMoney }}</span>
              </el-form-item>
              <el-form-item label="租赁时长">
                <span>{{ props.row.rentalTime }}个月</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="inventoryId">
        </el-table-column>
        <el-table-column label="租赁人" prop="rentalName">
        </el-table-column>
        <el-table-column label="租赁人电话" prop="rentalPhone"> </el-table-column>
        <el-table-column label="支付类型" prop="payType" :formatter="payFormat"> </el-table-column>
        <el-table-column label="钱币类型" prop="moneyType" :formatter="moneyFormat"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime"> </el-table-column>
        <el-table-column label="状态" prop="message"> </el-table-column>
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
      indents: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
    };
  },
  methods: {
    searchBtn() {
      this.getIndents(1)
    },
    handleCurrentChange(val) {
      this.getIndents(val)
    },
    getIndents(page) {
      request({
        url: "/indent/all",
        params: {
          rentalName: this.inputName,
          page: page,
          pageSize: 5,
        },
      }).then((res) => {
        console.log(res.data);
        this.indents = res.data.data;
        this.total = res.data.total
        this.currentPage = res.data.currentPage
        console.log(this.total);
      });
    },
    payFormat(row, column) {
      if (row.payType == 1) {
        return "在线支付";
      } else {
        return "未支付";
      }
    },
    moneyFormat(row, column) {
      if (row.moneyType == 1) {
        return "系统零钱";
      } else {
        return "未支付";
      }
    },
  },
  created() {
    this.getIndents(1);
  },
};
</script>


<style>
</style>