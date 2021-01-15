<template>
  <div>
    我是user
<p>{{$store.state.manager}}</p>
  </div>
  
</template>

<script>
import * as types from '../../store/mutations-type-string'
import request from "../../network/request";
export default {
  data() {
    return {
      users: []
    };
  },
  beforeCreate() {
    var urlHead = "";
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
    request({
      url:'/manager/managerById',
      params:{
        id:id
      }
    }).then(res=>{
      if(res.data.code == "200"){
        this.$store.commit(types.SETMANAGER,res.data.data[0])
      }
      
    })
  },
  //data初始化后el还没绑定时
  created() {
    request({
      url: "/user/userList",
      params: {
        limit: 1,
        num: 10,
      },
    })
      .then((res) => {
        console.log(res);
        this.users = res.data;
      })
      .catch((err) => {});
    console.log(this.users);
    console.log("------");
  },
};
</script>


<style scoped>
</style>