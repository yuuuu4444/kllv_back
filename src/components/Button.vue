<script setup>
  import { RouterLink } from 'vue-router';
  import 'element-plus/dist/index.css';
  import { ref } from 'vue';

  const buttonColor = ref('#004b80');
  const textColor = ref('#fff');
</script>

<template>
  <div class="mb-4">
    <el-button
      :style="{ backgroundColor: buttonColor, color: textColor }"
      class="button"
    >
      <slot />
    </el-button>
  </div>
</template>
