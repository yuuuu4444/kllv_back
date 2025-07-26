<script setup>
  import { RouterLink, RouterView, useRoute } from 'vue-router';
  import Header from '@/components/Header.vue';
  import Nav from '@/components/Nav.vue';

  const route = useRoute();
</script>

<template>
  <RouterView v-if="route.meta.layout === 'none'" />
  <div
    v-else
    class="common-layout"
  >
    <Header></Header>
    <el-container>
      <Nav></Nav>
      <el-container>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
  .common-layout {
    height: 100vh;
  }

  .el-main {
    border: 1px solid #ccc;
    padding: 0;
    box-sizing: border-box;
  }
</style>
