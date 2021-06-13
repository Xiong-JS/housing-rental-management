<template>
  <div>
    <div class="block">
      <el-select v-model="state">
        <el-option label="全部" value="3"> </el-option>
        <el-option label="未审核" value="0"> </el-option>
        <el-option label="审核未通过" value="1"> </el-option>
        <el-option label="审核通过" value="2"> </el-option>
      </el-select>
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
        :data="houseInfos"
        max-height="450"
        style="width: 100%"
        stripe
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

              <el-form-item label="房屋图片">
                <img :src="props.row.img" style="width: 100px; height: 100px" />
              </el-form-item>
              <el-form-item label="住房描述">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="特色">
                <span>
                  <span style="margin-left:5px" v-if="props.row.monthPay == 1">月付</span>
                  <span style="margin-left:5px" v-if="props.row.balcony == 1">阳台</span>
                  <span style="margin-left:5px" v-if="props.row.hardback == 1">精装修</span>
                  <span style="margin-left:5px" v-if="props.row.homeAppliances == 1">家电齐全</span>
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
        <el-table-column
          label="状态"
          prop="auditState"
          :formatter="stateFormat"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              class="el-icon-delete"
              @click="auditCertificate(scope.$index, scope.row)"
              :disabled="scope.row.auditState == 2"
              >审核</el-button
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
    <el-dialog
      title="房产证图片"
      :visible.sync="certificateVisble"
      width="30%"
      center
      append-to-body
    >
      <img
        v-if="certificateImg"
        :src="certificateImg"
        class="avatar"
        style="width: 420px; height: 300px"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="noPass" type="danger">不通过</el-button>
        <el-button type="primary" @click="pass">通 过</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="输入房屋位置"
      :visible.sync="positionVisble"
      width="30%"
      center
      append-to-body
    >
      <el-form
        :inline="true"
        :model="position"
        class="demo-form-inline"
        ref="position"
      >
        <el-form-item
          label="经度"
          :rules="[{ required: true, message: '请输入经度', trigger: 'blur' }]"
        >
          <el-input v-model="position.longitude" placeholder="经度"></el-input>
        </el-form-item>
        <el-form-item
          label="维度"
          :rules="[{ required: true, message: '请输入维度', trigger: 'blur' }]"
        >
          <el-input
            v-model="position.dimensionality"
            placeholder="维度"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('position')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../network/request";
export default {
  data() {
    return {
      houseInfos: [],
      currentPage: 1,
      total: 0,
      pageSize: 5,
      state: "3",
      certificateVisble: false,
      positionVisble: false,
      certificateImg: "",
      houseId: "",
      position: {
        longitude: "",
        dimensionality: "",
      },
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
    auditCertificate(id, row) {
      this.certificateVisble = true;
      this.certificateImg = row.certificateImg;
      this.houseId = row.houseId;
    },
    getUnAuditHouse(val) {
      request({
        url: "/house/auditHouse",
        params: {
          limit: this.pageSize,
          page: val,
          state: this.state,
        },
      }).then((res) => {
        this.houseInfos = res.data.data;
        this.currentPage = res.data.currentPage;
        this.total = res.data.total;
      });
    },
    handleSizeChange(val) {
      this.getUnAuditHouse(val);
    },
    handleCurrentChange(val) {
      this.getUnAuditHouse(val)
    },
    searchBtn() {
      this.getUnAuditHouse(1);
    },
    stateFormat(row, column) {
      if (row.auditState == 0) {
        return "未审核";
      } else if (row.auditState == 1) {
        return "未通过";
      } else {
        return "通过";
      }
    },
    noPass() {
      this.certificateVisble = false;
      request({
        url: "/house/audition",
        method: "post",
        data: {
          auditState: 1,
          houseId: this.houseId,
        },
      }).then((res) => {
        this.getUnAuditHouse(1);
      });
    },
    pass() {
      this.positionVisble = true;
      this.position.longitude = "";
      this.position.dimensionality = "";
    },
    submit(formName) {
      console.log('-'+this.position.longitude+'-');
      if(this.position.longitude == '' || this.position.dimensionality == ''){
        this.$message.error('输入不完整!')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request({
            url: "/house/audition",
            method: "post",
            data: {
              auditState: 2,
              houseId: this.houseId,
              longitude: this.position.longitude,
              dimensionality: this.position.dimensionality,
            },
          }).then((res) => {
            this.getUnAuditHouse(1);
            this.positionVisble = false;
            this.certificateVisble = false;
            this.$message.success("提交成功!")
          });
        } else {
          return false;
        }
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
  created() {
    this.getManager()
    this.getUnAuditHouse(1);
  },
};
</script>

<style>
</style>