<template>
   <div class="user">
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>用户管理</el-breadcrumb-item>
       <el-breadcrumb-item>用户列表</el-breadcrumb-item>
     </el-breadcrumb>
     <div class="page-contain">
       <el-row :gutter="20">
         <el-col :span="6"><div class="grid-content bg-purple">
           <el-input placeholder="请输入搜索内容" v-model="infoKey" clearable @clear="getData">
             <el-button  slot="append" type="primary" icon="el-icon-search" @click="serchUser"></el-button>
           </el-input>
         </div></el-col>
         <el-col :span="4"><div class="grid-content bg-purple">
           <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
         </div></el-col>
       </el-row>
      <!--列表-->
       <el-table
         class="user-table"
         :data="userData"
         style="width: 100%"
         border
       >
         <el-table-column
           label="序号"
           width="60"
           type="index">
         </el-table-column>
         <el-table-column
           prop="name"
           label="姓名"
           width="120">
         </el-table-column>
         <el-table-column
           prop="role"
           label="权限角色"
           width="180">
         </el-table-column>
         <el-table-column
           prop="mobile"
           label="联系方式">
         </el-table-column>
         <el-table-column
           prop="creattime"
           label="注册时间">
         </el-table-column>
         <el-table-column
           label="状态">
           <template slot-scope="scope">
             <el-switch
               v-model="scope.row.state"
             @change="setState(scope.row.id)"
             >
             </el-switch>
           </template>
         </el-table-column>
         <el-table-column
           label="操作"
           width="240">
           <template slot-scope="scope">
             <el-tooltip class="item" effect="light" content="修改用户信息" placement="top">
             <el-button
               type="primary"
               @click="handleEdit(scope.row)"
               icon="el-icon-edit"></el-button></el-tooltip>
             <el-tooltip class="item" effect="light" content="修改用户权限" placement="top">
             <el-button
               type="waring"
               icon="el-icon-setting"
               @click="handleRole(scope.row)"></el-button></el-tooltip>
             <el-tooltip class="item" effect="light" content="删除用户" placement="top">
             <el-button
               type="danger"
               icon="el-icon-delete"
               @click="handleDelete(scope.row)"></el-button> </el-tooltip>
           </template>
         </el-table-column>
       </el-table>

       <!--分页-->
       <el-pagination
         class="user-pagination"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="currenPge"
         :page-sizes="[2, 4, 6, 8,10]"
         :page-size="pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="userCount">
       </el-pagination>


     </div>

     <!--添加用户对话框-->
     <el-dialog title="添加新用户" :visible.sync="addUserDialog" @close="clearInfo">
       <el-form :model="newUser" ref="addUserRef" :rules="rules">
         <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
           <el-input v-model="newUser.name" autocomplete="off"></el-input>
         </el-form-item>
         <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
           <el-input v-model="newUser.mobile" autocomplete="off"></el-input>
         </el-form-item>
         <el-form-item label="权限角色" :label-width="formLabelWidth" prop="role">
           <el-input v-model="newUser.role" autocomplete="off"></el-input>
         </el-form-item>
         <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
           <el-input v-model="newUser.password" type="password"  autocomplete="off"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="closeAdd">取 消</el-button>
         <el-button type="primary" @click="addUser">确 定</el-button>
       </div>
     </el-dialog >

     <!--修改信息对话框-->
     <el-dialog title="修改用户信息" :visible.sync="editUserDialog">
       <el-form :model="editUser" ref="editUserRef" :rules="rules">
         <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
           <el-input v-model="editUser.name" autocomplete="off"></el-input>
         </el-form-item>
         <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
           <el-input v-model="editUser.mobile" autocomplete="off"></el-input>
         </el-form-item>
         <el-form-item label="权限角色" :label-width="formLabelWidth" prop="role">
           <el-input v-model="editUser.role" autocomplete="off"></el-input>
         </el-form-item>
         <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
           <el-input v-model="editUser.password" type="password"  autocomplete="off"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="closeEdit">取 消</el-button>
         <el-button type="primary" @click="editUserMsg">确 定</el-button>
       </div>
     </el-dialog>

     <!--删除对话框-->
     <el-dialog
       title="删除提示"
       :visible.sync="deleteDialog"
       width="30%">
       <span>{{deleteTips}}</span>
       <span slot="footer" class="dialog-footer">
    <el-button @click="closeDelete">取 消</el-button>
    <el-button type="primary" @click="deleteUser">确 定</el-button>
  </span>
     </el-dialog>
     <!--<el-button @click="setState">点击测试数据获取</el-button>-->
   </div>
</template>

<script>
import {nanoid} from 'nanoid'
    export default {
        name: "User",
      /*data(){
          return{
          userData:[{
            id:'001',
            name:'admin',
            mobile:'13211766263',
            role:'超级管理员',
            creatTime:'2021-10-11 12:00',
            state:true
          },
            {
              id:'002',
              name:'张三',
              mobile:'13211765874',
              role:'人事部管理员',
              creatTime:'2021-07-11 21:00',
              state:true
            },
            {
              id:'003',
              name:'小明',
              mobile:'13211765874',
              role:'事务部',
              creatTime:'2021-07-11 19:00',
              state:true
            },
            {
              id:'004',
              name:'小刘',
              mobile:'13211765356',
              role:'销售部',
              creatTime:'2021-07-11 08:00',
              state:false
            }
          ]
        }
      },*/
      data(){
        let mobileRule=(rule,value,callback)=>{
            let rule1 = /^[1]+[3,4,5,6,7,8,9]+\d{9}$/;
            if(!rule1.test(value)){
              return  callback(new Error("电话号码有误，请核对都重新输入"));
            }
            callback();
          }
        return {
          userData: [],
          userCount: 0,
          infoKey: '',
          serverData: [],
          pageSize: 4,
          currenPge: 1,
          newUser: {
            id: '',
            name: '',
            role: '',
            state: true,
            mobile: '',
            password: "",
            creattime: ''
          },
          editUser:{},
          addUserDialog: false,
          editUserDialog:false,
          deleteDialog:false,
          formLabelWidth: '120px',
          rules: {
          name: [
            {required: true, message: '请输入登录账号', trigger: 'blur'},
            {min: 5, max: 10, message: '长度在 5 到 10个字符', trigger: 'blur'}],
            password: [
              {required: true, message: '请输入密码', trigger: 'blur'},
              {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}],
            mobile:[
              {required: true, message: '请输入电话号码', trigger: 'blur'},
              {validator:mobileRule,trigger:'blur'}],
            role:[
              {required: true, message: '请输入角色权限', trigger: 'blur'}
            ]

        },
          deleteTips:"",
          deleteId:''
        }
      },
      created() {
      this.getData();
      },
      methods:{
        getData(){//获取用户信息
          this.$http.get('/user').then(res=>{
            this.serverData=res.data;
            this.userCount=res.data.length;
            this.chanUserData();
          })
        },
        /*更新表格源数据*/
        chanUserData(){
          let start=(this.currenPge-1)*this.pageSize;
          let end=start+this.pageSize;
          end=end>this.userCount?this.userCount:end;
          this.userData=this.serverData.slice(start,end);
          console.log(this.serverData)
          console.log(this.userData);
        },
        /*更改用户状态*/
        setState(id){
          this.$http.post('/setState',{'id':id
          },{
            headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
          }).then(res=>{
            console.log(res)
          },
          err=>{
            console.log(err)
          })
        },
        //修改页码
        handleCurrentChange(value){
          this.currenPge=value;
          this.chanUserData();
          console.log("当前页"+value);
        },
        //修改当前页显示的数量
        handleSizeChange(value){
          this.pageSize=value;
          this.chanUserData();
        },
        //搜索功能
        serchUser(){
          this.serverData=this.serverData.filter(item=>{
              return item.name.indexOf(this.infoKey)>-1;
          })
          this.userCount=this.serverData.length;
         this.chanUserData();
        },
        //打开添加用户对话框
        openAddUserDialog(){
          this.addUserDialog=true;
        },
        //添加用户
        addUser(){
          this.newUser.id=nanoid();
          const myData=new Date();
          this.newUser.creattime=myData.getFullYear()+"-"+myData.getMonth()+"-"+myData.getDay()+" "+myData.getHours()+":"+myData.getMinutes()
          //执行axios post添加数据,没有借口，忽略，仅在本地操作数据

          //校验数据
            this.$refs.addUserRef.validate((value,obj)=>{
                 if(value){
                 this.serverData.unshift(JSON.parse(JSON.stringify(this.newUser)));
                 this.chanUserData();
                 this.$message.success('添加成功！');
                 this.addUserDialog=false;
                 this.userCount++;
               }else{
                return   this.$message.error(obj[Object.keys(obj)[0]][0].message);
                }
            })


        },
        //关闭添加用户对话框
        closeAdd(){

          this.addUserDialog=false;
        },
        clearInfo(){
          this.$refs.addUserRef.resetFields();//清空表格内容
        },
        //点击修改用户
        handleEdit(editObj){
          this.editUser=editObj;
          this.editUserDialog=true;
          console.log(editObj)
        },
        //确定修改
        editUserMsg(){
          this.$refs.editUserRef.validate((value,obj)=>{
            if(value){
              this.serverData.filter(item=>{
                if(item.id===this.editUser.id){
                  item=this.editUser;
                }
              })

              //this.chanUserData();
              this.$message.success('修改成功！');
              this.editUserDialog=false;
            }else{
              this.$message.error(obj[Object.keys(obj)[0]][0].message);
            }
          })
        },
        //关闭修改对话框
        closeEdit(){
          this.$refs.editUserRef.resetFields();//清空表格内容
          this.editUserDialog=false;
        },
        //弹出删除对话框
        handleDelete(obj){
          this.deleteTips="确定删除"+obj.name+"吗？"
          this.deleteDialog=true;
          this.deleteId=obj.id;
        },
        //关闭删除对话框
        closeDelete(){
          this.deleteDialog=false;
          this.deleteTips="";
        },
        //删除用户
        deleteUser(){
          this.serverData=this.serverData.filter(item=>{
         return   item.id!==this.deleteId;
          });
          this.userCount--;
          this.chanUserData();
          this.deleteDialog=false;
        },
        //
        handleRole(){
          this.$message.info("正在施工中~")
        }
      }
    }
</script>

<style scoped>

  .user-table{
    border-radius: 6px;
    overflow: hidden;
  }
.el-input-group__append button.el-button{
  color: #FFF;
  background-color: #409EFF;
  border-color: #409EFF;
}
</style>
