<script setup>
  import { RouterLink, useRouter } from 'vue-router';
  import 'element-plus/dist/index.css';
  import { ElMessage } from 'element-plus';
  const route = useRouter();

  function handleLogout() {
    // 之後做登入狀態清除可以用
    localStorage.removeItem('userToken');
    ElMessage.success('已登出');
    route.push('/');
  }
</script>

<template>
  <el-header>
    <div>
      <img
        src="../assets/image/backend_logo.svg"
        alt="logo"
      />
    </div>
    <div v-if="route.path !== '/' && route.path !== '/login'">
      <RouterLink to="/Dashboard"><el-button>儀表板</el-button></RouterLink>
      <RouterLink to="/admin"><el-button>資料管理</el-button></RouterLink>
      <el-button @click="handleLogout">登出</el-button>
    </div>
  </el-header>
</template>

<style scoped lang="scss">
  .el-header {
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #004b80;
    div > button {
      color: #fff;
      background-color: transparent;
      border: none;
      font-size: 20px;
    }
  }
  .el-button{
    text-decoration: none;
    color: white;
      background-color: transparent;
      border: none;
      font-size: 20px;

        &:hover{
        background-color: white;
        color: #004b80;
      }
      
  }
  //  a{
  //   text-decoration: none;
  //   color: white;
  //  }

</style>
