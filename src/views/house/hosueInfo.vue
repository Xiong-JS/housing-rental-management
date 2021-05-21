<template>
  <div>
    <div class="block">
      <el-select v-model="Netherlands" placeholder="请选择区域">
        <el-option label="无" value="0"> </el-option>
        <el-option label="九龙坡" value="1"> </el-option>
        <el-option label="北碚" value="2"> </el-option>
        <el-option label="南岸" value="3"> </el-option>
        <el-option label="巴南" value="4"> </el-option>
        <el-option label="渝北" value="5"> </el-option>
      </el-select>
      <el-select
        v-model="Quote"
        placeholder="请选择报价"
        style="margin-left: 10px"
      >
        <el-option label="无" value="0"> </el-option>
        <el-option label="3000以下" value="1"> </el-option>
        <el-option label="3000以上" value="2"> </el-option>
      </el-select>

      <el-button
        @click="searchBtn"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 20px"
        size="small"
        >搜索</el-button
      >
      <el-switch
        v-model="detailSearch"
        active-text="查询更多"
        inactive-text="隐藏"
        style="margin-left: 20px"
      >
      </el-switch>
      <el-button
        @click="deleteBtnHouseInfos"
        type="danger"
        size="small"
        class="el-icon-delete"
        style="margin-left: 150px"
        >删除</el-button
      >
    </div>
    <div v-show="detailSearch" style="float: left; margin-left: 140px">
      <el-select v-model="RentalType" placeholder="请选择类型">
        <el-option label="无" value="0"> </el-option>
        <el-option label="合租" value="1"> </el-option>
        <el-option label="整租" value="2"> </el-option>
        <el-option label="公寓" value="3"> </el-option>
      </el-select>
      <el-input
        v-model="inputName"
        placeholder="发布人名称"
        style="width: 200px; margin-left: 10px"
      ></el-input>
    </div>
    <div class="block" style="margin-top: 20px">
      <el-table
        :data="houseInfos"
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
              <el-form-item label="门牌号">
                <span>{{ props.row.houseNumber }}</span>
              </el-form-item>
              <el-form-item label="住房类型">
                <span>{{ rentalTypeConvert(props.row.rentalType) }}</span>
              </el-form-item>
              <el-form-item label="报价">
                <span>{{ props.row.quote }}</span>
              </el-form-item>
              <el-form-item label="押金">
                <span>{{ props.row.cashPledge }}</span>
              </el-form-item>
              <el-form-item label="整套面积">
                <span>{{ props.row.area }}M²</span>
              </el-form-item>
              <el-form-item label="室-厅-卫">
                <span
                  >{{ props.row.room }}-{{ props.row.hall }}-{{
                    props.row.toilet
                  }}</span
                >
              </el-form-item>
              <el-form-item label="所在楼层">
                <span>{{ props.row.floor }}</span>
              </el-form-item>
              <el-form-item label="总楼层">
                <span>{{ props.row.totalFloor }}</span>
              </el-form-item>
              <el-form-item label="房屋类型">
                <span v-if="props.row.houseType == 0">楼梯房</span>
                <span v-if="props.row.houseType == 1">电梯房</span>
              </el-form-item>
              <el-form-item label="发布时间">
                <span>{{ props.row.releaseTime }}</span>
              </el-form-item>

              <el-form-item label="用户头像">
                <img :src="props.row.img" style="width: 100px; height: 100px" />
              </el-form-item>
              <el-form-item label="住房描述">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="特色">
                <span>
                  <p v-if="props.row.monthPay == 1">月付，</p>
                  <p v-if="props.row.balcony == 1">阳台，</p>
                  <p v-if="props.row.hardback == 1">精装修，</p>
                  <p v-if="props.row.homeAppliances == 1">家电齐全</p>
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="房屋 ID" sortable prop="houseId">
        </el-table-column>
        <el-table-column label="发布人" prop="releaseName"> </el-table-column>
        <el-table-column label="发布人电话" prop="releasePhone">
        </el-table-column>
        <el-table-column label="城市" prop="country"> </el-table-column>
        <el-table-column label="县区" prop="netherlands"> </el-table-column>
        <el-table-column label="详细区域" prop="detailNetherlands">
        </el-table-column>
        <el-table-column label="小区" prop="community"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
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
  </div>
</template>

<script>
import request from "../../network/request";
export default {
  data() {
    return {
      Netherlands: "",
      Quote: "",
      RentalType: "",
      inputName: "",
      detailSearch: false,
      houseInfos: [],
      currentPage: 1,
      total: 0,
      pageSize: 8,
      houseIds: [],
      multipleSelection: [],
      formLabelWidth: "120px",
    };
  },
  methods: {
    rentalTypeConvert(val) {
      let type = "合租";
      switch (val) {
        case 1:
          type = "合租";
          break;
        case 2:
          type = "整租";
          break;
        case 3:
          type = "公寓";
          break;
      }
      return type;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      request({
        url: "/house/houseInfos",
        params: {
          page: val,
          netherlands: this.Netherlands == "" ? 0 : this.Netherlands,
          quote: this.Quote == "" ? 0 : this.Quote,
          rentalType: this.RentalType == "" ? 0 : this.RentalType,
          name: this.inputName,
          limit: this.pageSize,
          userName: this.inputName,
        },
      })
        .then((res) => {
          // console.log(res.data);
          if (res.data.code == "200") {
            this.houseInfos = res.data.data;
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
    handleDelete(index, row) {
      console.log(row.houseId);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: "/house/house-delete",
            method: "delete",
            data: {
              houseId: row.houseId,
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
      this.multipleSelection = val;
    },
    deleteBtnHouseInfos() {
      if (this.houseIds.length == 0) {
        this.$message.warning("选择你要删除的数据!");
        return;
      }
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.houseIds[i] = this.multipleSelection[i].houseId;
          }
          this.houseIds.join(",");
          console.log(this.houseIds);
          request({
            url: "/house/houses-delete",
            method: "delete",
            data: JSON.stringify(this.houseIds),
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
  //data初始化后el还没绑定时
  created() {
    this.getManager()
    request({
      url: "/house/houseInfos",
      params: {
        page: 1,
        netherlands: this.Netherlands == "" ? 0 : this.Netherlands,
        quote: this.Quote == "" ? 0 : this.Quote,
        rentalType: this.RentalType == "" ? 0 : this.RentalType,
        name: this.inputName,
        limit: this.pageSize,
        userName: this.inputName,
      },
    })
      .then((res) => {
        // console.log(res.data.data);
        if (res.data.code == "200") {
          this.houseInfos = res.data.data;
          this.currentPage = res.data.currentPage;
          this.total = res.data.total;
        }
      })
      .catch((err) => {});
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