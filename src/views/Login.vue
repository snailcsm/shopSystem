<template>
  <div class="login-page">
    <div class="login-box">
      <img src="../assets/css/login.png" height="400" width="400" class="login-img"/>
      <el-form class="login-form"
               :model="loginData"
               :rules="loginRule"
               ref="loginRef">
        <!--账号-->
        <el-form-item prop="account">
          <el-input v-model="loginData.account" prefix-icon="iconfont icon-zhucedengluyonghuming" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-mima" v-model="loginData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="login-button-box">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button>注册</el-button>
          <div>
            <el-button type="text" @click="reset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginData:{
          account: "snail",
          password: "123456",
        },
        loginRule: {
          account: [
            {required: true, message: '请输入登录账号', trigger: 'blur'},
            {min: 5, max: 10, message: '长度在 5 到 10个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
            ],

        },
        test:{
          token:"aqevdefgdvcvdsf12ssw"
        }
      }
    },
    methods: {
      //点击重置表单
      reset() {
        console.log(this);
        this.$refs.loginRef.resetFields();
      },
      login(){
        this.$refs.loginRef.validate((vaild,obj)=>{
         if(vaild){
           this.$message.success("验证成功，发送请求");
           //在这里发送登录请求,

           //以下是假装登录成功后的信息
           //1、存储token到sessionStorage中
           window.sessionStorage.setItem('token',this.test.token);
           //2、跳转到主页
           this.$router.push("/home")
         }else{
           //验证失败了
           this.$message.error(obj[Object.keys(obj)[0]][0].message);
         }
        })
      }
    }
  }
</script>

<style scoped>
  .login-page {
    width: 100%;
    height: 100%;
    background: #07415c;
  }

  .login-box {
    width: 400px;
    height: 300px;
    background: #fff;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    box-shadow: 0 0 20px #03192d;
  }

  .login-img {
    width: 30%;
    height: auto;
    margin: 0 auto;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 50%;
  }

  .login-form {
    display: block;
    width: 80%;
    margin: -8% auto;
  }

  .login-button-box {
    text-align: center;
  }
</style>
