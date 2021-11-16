<template>
  <el-container class="container">
    <!--头部区域-->
    <el-header class="home-header">
      <h2>商品管理后台</h2>
      <el-button type="default" class="sign-out-but" @click="signOut">退出</el-button>
    </el-header>
    <!--主体-->
    <el-container>
      <!--左侧导航-->
      <el-aside :width="isOpen?'200px':'64px'" class="nav-aside">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#353b47"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="!isOpen"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu  v-for="nav in navData" :key="nav.id" :index="navListData[nav.id].path">
            <!--一级导航-->
            <template slot="title">
              <i :class="navListData[nav.id].icon"></i>
              <span>{{nav.title}}</span>
            </template>

            <!--二级导航-->
            <el-menu-item  v-for="subNav in nav.children"
            :key="subNav.id"
             :index="navListData[subNav.id].path"
                           @click="getActivePath(navListData[subNav.id].path)"
            >
              <i :class="navListData[subNav.id].icon"></i>{{subNav.title}}</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-button type="default" :icon="isOpen?'el-icon-caret-left':'el-icon-caret-right'" class="nav-ctrolL-but" @click="ctrollNavOpen"></el-button>
      </el-aside>
      <!--右侧内容展示区-->
      <el-main class="content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        name: "Home",
      data(){
          return{
            navData:[
              {
                "id": "1",
                "title": "用户管理",
                "children": [
                  {
                    "id": "11",
                    "title": "用户列表"
                  }
                ]
              },
              {
                "id": "2",
                "title": "权限管理",
                "children": [
                  {
                    "id": "22",
                    "title": "权限列表"
                  },
                  {
                    "id": "21",
                    "title": "角色列表"
                  }
                ]
              },
              {
                "id": "3",
                "title": "商品管理",
                "children": [
                  {
                    "id": "31",
                    "title": "商品列表"
                  },
                  {
                    "id": "32",
                    "title": "商品分类"
                  }
                ]
              },
              {
                "id": "4",
                "title": "订单管理",
                "children": [
                  {
                    "id": "41",
                    "title": "订单列表"
                  }
                ]
              },
              {
                "id": "5",
                "title": "数据统计",
                "children": [
                  {
                    "id": "51",
                    "title": "数据列表"
                  }
                ]
              }
            ],
            navListData: {
              '1':{icon:'iconfont icon-202yonghu_yonghu3',path:'/user'},
              '2':{icon:'iconfont icon-yonghuguanli',path:'/roles'},
              '3':{icon:'iconfont icon-shangpinjiankong',path:'/goodsList'},
              '4':{icon:'iconfont icon-dingdandingdanchaxun',path:'/orderList'},
              '5':{icon:'iconfont icon-yonghuguanli-hangzhengguanli',path:'dataList'},
              '11':{icon:'iconfont icon-zhucedengluyonghuming',path:'/user'},
              '21':{icon:'iconfont icon-yonghuguanli1',path:'/roles'},
              '22':{icon:'iconfont icon-yonghuguanli2',path:'/rights'},
              '31':{icon:'iconfont icon-shangpinfenlei',path:'/goodsList'},
              '32':{icon:'iconfont icon-shangpinguanli1',path:'/goodsType'},
              '41':{icon:'iconfont icon-shangpinguanli',path:'/orderList'},
              '51':{icon:'iconfont icon-shuju01',path:'/dataList'},
            },
            isOpen:true,
            activePath:''
          }
      },
      created() {
         this.activePath=this.$router.history.current.path;
      //  console.log(this.$router)

         // this.$http.get('nav/index.json').then((res)=>{
          //  console.log(res)
         // })
      },
      methods:{
          signOut(){
            window.sessionStorage.clear();//清空sessionStorage
            this.$router.push('/login')
          },
        ctrollNavOpen(){
            this.isOpen=!this.isOpen;
        },
        getActivePath(path){
            this.activePath=path;
        }
        }
    }
</script>

<style scoped>
  .container{
    height: 100%;
  }
.home-header{
  background: #4d5667;
}
  .nav-aside{
    background: #353b47;
    position: relative;
    overflow: inherit;
  }
  .el-menu{
    border:0;
  }
  .iconfont{
    margin-right :5px;
    color: #fff;
  }
  .el-submenu{
    border-bottom: 1px #939ca5 solid;
  }
  .content{
    background: #3c4451;
  }
  .home-header{
    display: flex;
    justify-content: space-between;
  }
  .home-header h2{
    color: #fff;
    line-height: 60px;
  }
  .sign-out-but{
    background: none;
    color: #fff;
    border-color: #aaa;
    margin: 12px 0;
  }
  .sign-out-but:hover{
    background: #353b47;
    color:rgb(255, 208, 75) ;
    border-color:#4d5667;
  }
  .nav-ctrolL-but{
    position: absolute;
    top: 50%;
    right: -30px;
    width: 30px;
    padding: 20px 0;
    margin-top: -20px;
    font-size: 30px;
    border-radius: 10px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background: #353b47;
    border: navajowhite;
    color: azure;
    box-shadow: 4px 0px 4px #32323d;
  }
  .nav-ctrolL-but:focus, .nav-ctrolL-but:hover{
    background: #353b47;
    color: #fff;
  }
</style>
