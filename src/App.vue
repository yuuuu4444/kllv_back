<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<!-- <template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template> -->

<template>
  <div>
    <el-button type="primary">
      <el-icon><Edit /></el-icon>
      測試Element
    </el-button>

    <el-icon color="#409EFC" :size="20">
      <Share />
    </el-icon>
  </div>
</template>
