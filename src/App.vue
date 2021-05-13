<template>
  <div id="app">
    <div v-if="uToken != null">
      <el-container style="width: 100%; height: 100%; position: fixed">
        <el-header>
          <div class="personal" v-popover:popover>
            <span>{{ manager.managerName }}</span>
          </div>
        </el-header>
        <el-container>
          <el-aside width="200px">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              style="text-align: left"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="iconfont icon-account-fill"></i>
                  <span>人员信息</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">
                    <router-link to="/user" active-class="active">
                      用户信息</router-link
                    >
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="iconfont icon-zhufang"></i>
                  <span>住房管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1">
                    <router-link to="/audit" active-class="active">
                      住房审核</router-link
                    >
                  </el-menu-item>
                  <el-menu-item index="2-2">
                    <router-link to="/houseInfo" active-class="active">
                      住房信息</router-link
                    >
                  </el-menu-item>
                  <el-menu-item index="2-3">
                    <router-link to="/rental" active-class="active"
                      >出租管理</router-link
                    >
                  </el-menu-item>
                  <el-menu-item index="2-4">
                    <router-link to="/sellList" active-class="active"
                      >订单管理</router-link
                    >
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="iconfont icon-jichuxinxi"></i>
                  <span>系统基础管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="3-1">
                    <router-link to="/carousel" active-class="active">
                      轮播图信息管理</router-link
                    >
                  </el-menu-item>
                  <el-menu-item index="3-2">
                    <router-link to="/country" active-class="active">
                      城市信息管理</router-link
                    >
                  </el-menu-item>
                  <el-menu-item index="3-3">
                    <router-link to="/netherlands" active-class="active">
                      地区信息管理</router-link
                    >
                  </el-menu-item>
                  <el-menu-item index="3-4">
                    <router-link to="/detailNetherlands" active-class="active">
                      详细地区&小区信息管理</router-link
                    >
                  </el-menu-item>
                  <el-menu-item index="3-5">
                    <router-link to="/comment" active-class="active">
                      评论管理</router-link
                    >
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="iconfont icon-graph"></i>
                  <span>图表统计</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="4-1">
                    <router-link to="/graph" active-class="active">
                      图表统计</router-link
                    >
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-container>
            <el-main
              ><keep-alive><router-view></router-view></keep-alive
            ></el-main>
            <el-footer>@2021-01 2021-06</el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
    <div v-else>
      {{ loginFailed() }}
    </div>
    <el-popover ref="popover" placement="bottom" width="100" trigger="hover">
      <div>
        <div class="exit" @click="exit">
          <i class="iconfont icon-exit" style="margin-left: 10px"></i
          ><span style="margin-left: 10px">退出</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import request from "./network/request";
export default {
  data() {
    return {
      manager: {},
      uToken:localStorage.getItem('uToken')
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    loginFailed() {
      this.$message.error("未登录，请登录！");
      setTimeout(() => {
        window.location.href =
          "http://127.0.0.1:8083/housing-rental-management/login.html";
      }, 1000);
    },
    personalCenter(id) {},
    exit() {
      request({
        url: "/exit",
        params: {
          tokenKey: localStorage.getItem("uToken").split(":")[0],
        },
      }).then((res) => {
        if (res.data.code == 200) {
          localStorage.removeItem("uToken")
          localStorage.removeItem("id")
          this.$message.success("退出成功!");
          setTimeout(() => {
            window.location.href =
              "http://127.0.0.1:8083/housing-rental-management/login.html";
          }, 1000);
        }
      });
    },
  },
  beforeCreate() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURIComponent(
          strs[i].split("=")[1]
        );
      }
    }
    let uToken = theRequest.uToken;
    let id = theRequest.id;
    localStorage.setItem("uToken", uToken);
    localStorage.setItem("id", id);
  },
  created() {
    request({
      url: "/manager/managerById",
      params: {
        id: localStorage.getItem("id"),
      },
    }).then((res) => {
      this.manager = res.data.data;
    });
  },
};
</script>

<style>
@import url("./assets/img/icon/iconfont.css");
.el-header {
  background-color: white;
  color: #333;
  line-height: 60px;
}
.personal {
  float: right;
  margin-right: 120px;
  cursor: pointer;
}
.el-footer {
  background-color: #e2e2e2;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: rgb(84, 92, 100);
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #f5f5f5;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.active {
  color: orange;
  text-decoration: none;
}
a {
  text-decoration: none;
  color: white;
}

/* 解决表格对不齐的问题，但是未解决 */
.el-table th.gutter {
  display: table-cell !important;
}
.exit {
  padding: 5px 0 5px 0;
}
.exit:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}
.personal-center {
  padding: 5px 0 5px 0;
}
.personal-center:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}
</style>
