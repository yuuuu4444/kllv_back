<script setup>
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    modelValue: Boolean,
    title: String,
    width: {
      type: String,
      default: '800px',
    },
  });

  const emit = defineEmits(['update:modelValue', 'close', 'closed']);

  const handleClose = () => {
    emit('update:modelValue', false); // 關閉對話框本身
    emit('close'); // 告訴父層「已關閉」
  };

  const handleClosed = () => {
    emit('closed'); // 動畫結束後再補一個（可選）
  };
</script>

<template>
  <div class="dialog">
    <el-dialog
      :model-value="modelValue"
      :width="width"
      align-center
      @close="handleClose"
      @closed="handleClosed"
    >
      <template #title>
        <div class="dialog__title">
          <h3 class="dialog__title-text">{{ title }}</h3>
        </div>
      </template>

      <div class="dialog__body">
        <slot name="body" />
      </div>

      <template #footer>
        <div class="dialog__footer">
          <slot name="footer" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .dialog {
    &__title {
      padding: 0 24px;
      padding-top: 24px;

      &-text {
        text-align: center;
        font-size: 28px;
        font-weight: bold;
      }
    }

    &__body {
      padding: 24px;
    }

    &__footer {
      padding: 0 24px;
      padding-bottom: 24px;
    }
  }
</style>
