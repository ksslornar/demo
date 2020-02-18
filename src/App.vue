<template>
  <div id="app">
    <p>上次更新时间{{timeUpdate}}，每隔10分钟自动更新</p>
    <button class="button" @click="handUpdata">手动刷新</button>
    <table class="table-content" >
    <tr>
      <th v-for='(item,index) in thData' :key="index" :name="item.name" >
      {{item.title}}
      <div class="icon-sort">
        <span @click="sortList(item.name,'asc')"></span>
        <span @click="sortList(item.name,'desc')"></span>
      </div>
      </th>
    </tr>
    <tr v-for='(item,index) in allSchoolInfos' :key="index">
      <td v-for='(itemTd,i) in thData' :key="i">
        <p v-if="itemTd.name=='timeStamp'">{{item[itemTd.name].split(' ')[1]}}</p>
        <p v-else >{{item[itemTd.name]}}</p>
      </td>
    </tr>
  </table>
    
  </div>
</template>

<script>
import {FetchGet} from "@/axios/index";
export default {
  data(){
    return{
        thData:[   // 表格头部数据
          {title:"机构",name:"schoolName"},
          {title:"更新时间",name:"timeStamp"},
          {title:"排课数",name:"totalClassNum"},
          {title:"正在上课课节数",name:"inClassNum"},
          {title:"预计人数",name:"totalTargetAttendNum"},
          {title:"正在上课人数",name:"totalAttendNum"},
        ],
        timeUpdate:'',     //上次更新时间
        allSchoolInfos:[], //表格数据
        timerName:null     //定时器
    }
  },
  created() {
      this.getData();
  },
  mounted(){
    this.getCurrentTime();
  },
  methods:{
    getData(){
      FetchGet("/mediaService/interview/frontend")
        .then(res => {
          this.allSchoolInfos=res.allSchoolInfos;
        })
    },
    getCurrentTime(){
      let _this=this;
      let myDate = new Date();
      let h=myDate.getHours();
          h=h>9?h:'0'+h; 
      let m=myDate.getMinutes(); 
          m=m>9?m:'0'+m; 
      let s=myDate.getSeconds(); 
          s=s>9?s:'0'+s; 
          _this.timeUpdate=h+":"+m+":"+s;
          clearInterval(this.timeName);
          _this.timeName=setInterval(function () {  //10分钟自动刷新
             _this.getData();
            _this.getCurrentTime();
          }, 60000);
    },
    handUpdata(){   //手动刷新
      clearInterval(this.timeName);
      this.getCurrentTime();
      this.getData();
    },
    sortList(key,order){ //数字进行排序
      if(this.allSchoolInfos.length<2) return;
      return this.allSchoolInfos.sort(function(a,b){
          if(key=='schoolName'){  //机构排序
            return order=='asc' ? (a[key].localeCompare(b[key], 'zh')) : (b[key].localeCompare(a[key], 'zh'))
          }else{
            var x,y;
            if(key=='timeStamp'){  //时间排序
                x = new Date(a[key]).getTime(); 
                y = new Date(b[key]).getTime(); 
            }else{
              x = parseInt(a[key]);
              y = parseInt(b[key]);
            }
            return order=='asc' ? ((x<y)?-1:((x>y)?1:0)):((x>y)?-1:((x<y)?1:0));
          }        
      })
    }
  }

}
</script>

<style>
body{
  margin:0;
  padding:0;
  background:#f0f2f5;
  font-size:14px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding:60px 100px;
  
}
.table-content{
  width:100%;
  border-collapse:collapse;
  border-spacing:0; 
}
.table-content td,.table-content th{
  border-bottom:1px solid #e8e8e8;
  height:54px;
}
.table-content td{
  background:#f0f2f5;
  text-align:center;
}
.table-content th{
  background:#fafafa;
  font-weight:normal;
}
.button{
  width:88px;
  height:32px;
  color:#fff;
  text-align:center;
  line-height:32px;
  font-size:14px;
  border-radius:4px;
  border:0;
  background:#1890ff;
  cursor:pointer;
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.icon-sort{
  display:inline-block;
}
.icon-sort span{
  display:block;
  width:8px;
  height:5px;
  background:url(assets/img/sort.png) no-repeat;
  background-size:cover;
  background-position:0 0;
  cursor:pointer;
}
.icon-sort span:last-child{
  background-position:0 -7px;
  margin-top:2px;
}
</style>
