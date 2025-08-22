<script setup>
  import { computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import 'element-plus/dist/index.css';
  import { ElMessage } from 'element-plus';
  import { useAuthStore } from '@/stores/auth';

  const router = useRouter();
  const route = useRoute();
  const auth = useAuthStore();

  const showLogout = computed(
    () => auth.isLoggedIn && route.path !== '/' && route.path !== '/login',
  );

  async function handleLogout() {
    try {
      await auth.logout(); // 會打 /api/admin/logout.php 並清掉 Pinia 狀態
    } catch (e) {
      // 即使呼叫失敗，也一樣把前端狀態清掉並導回登入頁
    } finally {
      ElMessage.success('已登出');
      router.replace('/'); // 用 replace 避免返回鍵回到受保護頁
    }
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
    <div v-if="showLogout">
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
