<template>
    <div>这里是Home组件
  <el-button type="default" @click="signOut">退出</el-button>
    </div>
</template>

<script>
    export default {
        name: "Home",
        methods:{
          signOut(){
            window.sessionStorage.clear();//清空sessionStorage
            this.$router.push('/login')
          }
        }
    }
</script>

<style scoped>

</style>
