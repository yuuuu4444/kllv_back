<script setup>
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    modelValue: Boolean,
    title: String,
    width: {
      type: String,
      default: '500px',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const close = () => {
    emit('update:modelValue', false);
  };
</script>

<template>
  <div class="dialog">
    <el-dialog
      :model-value="modelValue"
      align-center
      @close="close"
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
