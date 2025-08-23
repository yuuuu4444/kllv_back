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
      <Nav v-if="route.path !== '/Dashboard'" ></Nav>
      <el-container>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<!-- <template> -->
  <!--  如果 layout 是 none，就只顯示 <RouterView /> -->
  <!-- <RouterView v-if="route.meta.layout === 'none'"></RouterView> -->

  <!--  如果 layout 是 header-only，就只顯示 Header + RouterView -->
  <!-- <div v-else-if="route.meta.layout === 'header-only'" class="header-only-layout">
    <Header></Header>
    <RouterView></RouterView>
  </div> -->

  <!--  預設 Layout：Header + Nav + el-container -->
  <!-- <div v-else class="common-layout">
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
</template> -->

<style scoped lang="scss">
  .common-layout {
    height: 100vh;
  }

  .el-main {
    border: 1px solid #ccc;
    padding: 0;
    box-sizing: border-box;
  }
  .header-only-layout {
  height: 100vh;
  background-color: #fff; // 可選：避免 layout 閃爍
}
</style>
















