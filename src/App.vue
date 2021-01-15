<template>
  <div id="app">
    <el-container style="width:100%;height:100%;position:fixed">
      <el-header>{{$store.state.manager.id}}</el-header>
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
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
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
                <i class="el-icon-menu"></i>
                <span>住房管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">
                  <router-link to="/houseInfo" active-class="active">
                    住房信息</router-link
                  >
                </el-menu-item>
                <el-menu-item index="2-2">
                  <router-link to="/rental" active-class="active">出租信息</router-link>
                  </el-menu-item>
                <el-menu-item index="2-3">
                  <router-link to="/sellList" active-class="active">订单信息</router-link>
                  </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main><keep-alive><router-view></router-view></keep-alive></el-main>
          <el-footer>@2021-01 2021-06</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import HouseInfo from "./components/house/hosueInfo";

export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    
  },
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
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

</style>
