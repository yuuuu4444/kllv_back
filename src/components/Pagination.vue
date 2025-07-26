<script setup>
  import { RouterLink } from 'vue-router';
  import 'element-plus/dist/index.css';

  defineProps({
    total: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 12,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  });

  const emit = defineEmits(['update:currentPage']);

  function handlePageChange(page) {
    emit('update:currentPage', page);
  }
</script>

<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @current-change="handlePageChange"
  />
</template>
