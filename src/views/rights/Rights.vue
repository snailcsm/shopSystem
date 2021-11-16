<template>
<div class="right">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

  <div class="page-contain">
    <!--分类tab-->
    <el-tabs v-model="tabActiveName"
             type="card"
             @tab-click="changeRightTab"
             tab-position="top"
    >
      <el-tab-pane label="全部" name="all">全部</el-tab-pane>
      <el-tab-pane label="一级权限" name="first">一级权限</el-tab-pane>
      <el-tab-pane label="二级权限" name="second">二级权限</el-tab-pane>
      <el-tab-pane label="三级权限" name="third">三级权限</el-tab-pane>
    </el-tabs>
    <!--权限列表-->
    <el-table
      class="rights-table"
      :data="rightData"
      border
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
       >
      </el-table-column>
      <el-table-column
        prop="leval"
        label="等级"
        width="360"
        >
        <template slot-scope="scope">
        <el-tag v-if="scope.row.leval===1">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.leval==2"> 二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
    export default {
        name: "Rights",
      data(){
        return{
          serverData:[],
          rightData:[],
          tabActiveName:'all',
        }
      },
      created() {
        this.getRightData();
      },
      methods:{
        //发送网络请求获取角色数据
        getRightData(){
          this.$http.get('/rights').then((res=>{
            console.log(res.data)
            this.rightData=res.data;
            this.serverData=res.data;
          }))
        },
        changeRightTab(tab){
          if(tab.index==0){
           return  this.rightData=this.serverData;
          }
          this.rightData=this.serverData.filter(item=>{
            return item.leval==tab.index;
          })
        }
      }
    }
</script>

<style scoped>

  .rights-table{
    margin-top: -1px;
  }


</style>
