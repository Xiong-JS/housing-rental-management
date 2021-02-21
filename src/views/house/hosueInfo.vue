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
      <el-button
        @click="addBtnHouseInfo"
        type="success"
        size="small"
        class="el-icon-plus"
        style="margin-left: 20px"
        >新增</el-button
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
        <el-table-column label="登录用户" prop="userName"> </el-table-column>
        <el-table-column label="发布人" prop="releaseName"> </el-table-column>
        <el-table-column label="发布人电话" prop="releasePhone">
        </el-table-column>
        <el-table-column label="城市" prop="country"> </el-table-column>
        <el-table-column label="县区" prop="netherlands"> </el-table-column>
        <el-table-column label="详细区域" prop="detailNetherlands">
        </el-table-column>
        <el-table-column label="小区" prop="community"> </el-table-column>
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
    <!-- <el-dialog title="用户修改" :visible.sync="editFormVisible" append-to-body>
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
    </el-dialog> -->

    <!-- 新增用户 -->
    <el-dialog title="住房增加" :visible.sync="addFormVisible" append-to-body>
      <el-form :model="addHouseInfo" :inline="true" class="demo-form-inline">
        <el-form-item label="发布人" :label-width="formLabelWidth">
          <el-input
            v-model="addHouseInfo.releaseName"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="发布人电话" :label-width="formLabelWidth">
          <el-input
            v-model="addHouseInfo.releasePhone"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-select
            v-model="addHouseInfo.countryId"
            placeholder="请选择城市"
            @change="countryChange"
            style="width: 210px"
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
        <el-form-item label="地区" :label-width="formLabelWidth">
          <el-select
            v-model="addHouseInfo.netherlandsId"
            clearable
            placeholder="请选择地区"
            @change="netherlandsChange"
            style="width: 210px"
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
        <el-form-item label="详细地区" :label-width="formLabelWidth">
          <el-select
            v-model="addHouseInfo.detailNetherlandsId"
            clearable
            placeholder="请选择详细地区"
            @change="detailNetherlandsChange"
            style="width: 210px"
          >
            <el-option
              v-for="item in detailNetherlands"
              :key="item.detailNetherlandsId"
              :label="item.detailNetherlandsName"
              :value="item.detailNetherlandsId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小区" :label-width="formLabelWidth">
          <el-select
            v-model="addHouseInfo.communityId"
            clearable
            placeholder="请选择小区"
            @change="communityChange"
            style="width: 210px"
          >
            <el-option
              v-for="item in communities"
              :key="item.communityId"
              :label="item.communityName"
              :value="item.communityId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号" :label-width="formLabelWidth">
          <el-input
            v-model="addHouseInfo.houseNumber"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="租房类型" :label-width="formLabelWidth">
          <el-select
            v-model="addHouseInfo.rentalType"
            clearable
            placeholder="请选择住房类型"
            style="width: 210px"
          >
            <el-option label="合租" value="1"></el-option>
            <el-option label="整租" value="2"></el-option>
            <el-option label="公寓" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报价" :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="addHouseInfo.quote"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="整租面积" :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="addHouseInfo.area"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="室" :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="addHouseInfo.room"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="厅" :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="addHouseInfo.hall"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="卫" :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="addHouseInfo.toilet"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="楼层" :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="addHouseInfo.floor"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="总楼层" :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="addHouseInfo.totalFloor"
            auto-complete="off"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item label="房子类型" :label-width="formLabelWidth">
          <el-select
            v-model="addHouseInfo.houseType"
            clearable
            placeholder="请选择房子类型"
            style="width: 210px"
          >
            <el-option label="楼梯房" value="0"></el-option>
            <el-option label="电梯房" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特色" :label-width="formLabelWidth">
          <el-checkbox-group v-model="addHouseInfo.characters">
            <el-checkbox label="月付" name="character"></el-checkbox>
            <el-checkbox label="精装房" name="character"></el-checkbox>
            <el-checkbox label="有阳台" name="character"></el-checkbox>
            <el-checkbox label="家电齐全" name="character"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-form :model="addHouseInfo">
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addHouseInfo.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
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
              v-if="addHouseInfo.img"
              :src="addHouseInfo.img"
              class="avatar"
              style="width: 100px; height: 100px"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHouseConfirm">确 定</el-button>
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
      Netherlands: "",
      Quote: "",
      RentalType: "",
      inputName: "",
      country: "",
      detailSearch: false,
      countries: [],
      netherlands: [],
      detailNetherlands: [],
      communities: [],
      houseInfos: [],
      currentPage: 1,
      total: 0,
      pageSize: 8,
      multipleSelection: [],
      editFormVisible: false,
      addFormVisible: false,
      houseInfosIds: [],
      uploadUrl: "http://localhost:8080/imgUpload",
      headers: { "u-token": localStorage.getItem("uToken") },
      imgData: "",
      // formData: {
      //   id: "",
      //   userName: "",
      //   userAccount: "",
      //   userPassword: "",
      //   userImg: "",
      //   userRegisterTime: "",
      //   userWallet: "",
      // },
      addHouseInfo: {
        releaseName: "",
        releasePhone: "",
        countryId: "",
        detailNetherlandsId: "",
        netherlandsId: "",
        communityId: "",
        houseNumber: "",
        rentalType: "",
        quote: "",
        area: "",
        room: "",
        hall: "",
        toilet: "",
        floor: "",
        totalFloor: "",
        houseType: "",
        description: "",
        characters: [],
        img: "",
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.addHouseInfo.img = res.data;
      this.$message.success("上传成功");
    },
    countryChange(val) {
      // this.addHouseInfo.countryId = val;
      // this.netherlands = []
      // this.detailNetherlands = []
      // this.communities = []
      request({
        url: "/house/netherlands",
        params: {
          countryId: val,
        },
      }).then((res) => {
        this.netherlands = res.data.data;
      });
    },
    netherlandsChange(val) {
      // this.addHouseInfo.netherlandsId = val
      // this.detailNetherlands = []
      // this.communities = []
      request({
        url: "/house/detailNetherlands",
        params: {
          countryId: this.addHouseInfo.countryId,
          netherlandsId: val,
        },
      }).then((res) => {
        this.detailNetherlands = res.data.data;
      });
    },
    detailNetherlandsChange(val) {
      // this.addHouseInfo.detailNetherlandsId = val
      // this.communities = []
      request({
        url: "/house/communities",
        params: {
          countryId: this.addHouseInfo.countryId,
          netherlandsId: this.addHouseInfo.netherlandsId,
          detailNetherlandsId: val,
        },
      }).then((res) => {
        this.communities = res.data.data;
      });
    },
    communityChange(val) {
      // this.addHouseInfo.communityId = val
      console.log(val);
    },
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
    handleEdit(index, row) {
      this.formData.id = row.id;
      this.formData.userName = row.userName;
      this.formData.userAccount = row.userAccount;
      this.formData.userPassword = row.userPassword;
      // this.formData.userImg = row.userImg;
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
          // userImg: this.formData.userImg,
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
    // deleteBtnUsers() {
    //   this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.userIds.join(",");
    //       console.log(this.userIds);
    //       request({
    //         url: "/user/usersDelete",
    //         method: "post",
    //         data: JSON.stringify(this.userIds),
    //       }).then((res) => {
    //         this.$message({
    //           type: "success",
    //           message: "删除成功!",
    //         });
    //         this.handleCurrentChange(1);
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });

    //   for (let i = 0; i < this.multipleSelection.length; i++) {
    //     this.userIds[i] = this.multipleSelection[i].id;
    //   }
    // },
    addBtnHouseInfo() {
      request({
        url: "/house/countries",
      }).then((res) => {
        this.countries = res.data.data;
      });
      this.addHouseInfo.releaseName = "";
      this.addHouseInfo.releasePhone = "";
      this.countries = [];
      this.Netherlands = [];
      this.detailNetherlands = [];
      this.communities = [];
      (this.addHouseInfo.houseNumber = ""),
        (this.addHouseInfo.rentalType = ""),
        (this.addHouseInfo.quote = ""),
        (this.addHouseInfo.area = ""),
        (this.addHouseInfo.room = ""),
        (this.addHouseInfo.hall = ""),
        (this.addHouseInfo.toilet = ""),
        (this.addHouseInfo.floor = ""),
        (this.addHouseInfo.totalFloor = ""),
        (this.addHouseInfo.houseType = ""),
        (this.addHouseInfo.description = ""),
        (this.addHouseInfo.characters = []),
        (this.addHouseInfo.img = "");
      this.imgData = {
        path: "bishe/house",
      };
      this.addFormVisible = true;
    },
    addHouseConfirm() {
      request({
        url: "/house",
        method: "post",
        data: {
          releaseName: this.addHouseInfo.releaseName,
          releasePhone: this.addHouseInfo.releasePhone,
          countryId: this.addHouseInfo.countryId,
          netherlandsId: this.addHouseInfo.netherlandsId,
          detailNetherlandsId: this.addHouseInfo.detailNetherlandsId,
          communityId: this.addHouseInfo.communityId,
          houseNumber: this.addHouseInfo.houseNumber,
          rentalType: this.addHouseInfo.rentalType,
          quote: this.addHouseInfo.quote,
          area: this.addHouseInfo.area,
          room: this.addHouseInfo.room,
          hall: this.addHouseInfo.hall,
          toilet: this.addHouseInfo.toilet,
          floor: this.addHouseInfo.floor,
          totalFloor: this.addHouseInfo.totalFloor,
          houseType: this.addHouseInfo.houseType,
          description: this.addHouseInfo.description,
          characters: this.addHouseInfo.characters.toString(),
          img: this.addHouseInfo.img,
          managerId:this.$store.state.manager.id
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
    deleteBtnHouseInfos() {},
  },
  //data初始化后el还没绑定时
  created() {
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