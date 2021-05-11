<template>
  <div>
    <div id="rentalPeople" :style="{ height: '300px' }"></div>
    <div>
      <el-row>
        <el-col :span="12"
          ><div id="houseRate" style="height: 250px; margin-left: 80px"></div
        ></el-col>
        <el-col :span="12" style="text-align: left"
          ><div id="scoreRate" style="height: 250px"></div
        ></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import request from "../../network/request";
export default {
  data() {
    return {
      rentalPeople: {},
      houseRate: {},
      scoreRate: {},
    };
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let rentalPeople = this.$echarts.init(
        document.getElementById("rentalPeople")
      );
      let houseRate = this.$echarts.init(document.getElementById("houseRate"));
      let scoreRate = this.$echarts.init(document.getElementById("scoreRate"));
      rentalPeople.setOption({
        title: { text: "销量前十房源地区" },
        tooltip: {},
        xAxis: {
          data: this.rentalPeople.netherlands,
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: this.rentalPeople.nums,
          },
        ],
      });
      houseRate.setOption({
        title: {
          text: "房源类型占比",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "60%",
            data: [
              {
                value: this.houseRate.nums1[0],
                name: this.houseRate.rentalTypes[0],
              },
              {
                value: this.houseRate.nums1[1],
                name: this.houseRate.rentalTypes[1],
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
      scoreRate.setOption({
        title: {
          text: "评分前五房源",
          left: "left",
          top: 0,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          x: "250px",
          y: "0px",
          right: "right",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["25%", "53%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "10",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: this.scoreRate.aveScore[0],
                name: this.scoreRate.communitiesScore[0],
              },
              {
                value: this.scoreRate.aveScore[1],
                name: this.scoreRate.communitiesScore[1],
              },
              {
                value: this.scoreRate.aveScore[2],
                name: this.scoreRate.communitiesScore[2],
              },
              {
                value: this.scoreRate.aveScore[3],
                name: this.scoreRate.communitiesScore[3],
              },
              {
                value: this.scoreRate.aveScore[4],
                name: this.scoreRate.communitiesScore[4],
              },
            ],
          },
        ],
      });
    },
  },
  created() {
    request({
      url: "/graph",
    }).then((res) => {
      console.log(res);
      this.rentalPeople = res.data.rentalPeople;
      this.houseRate = res.data.houseTypes;
      this.scoreRate = res.data.houseScores;
      console.log(this.houseRate);
      console.log(this.scoreRate);
      this.drawLine();
    });
  },
};
</script>

<style>
</style>