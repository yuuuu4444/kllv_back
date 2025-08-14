<script setup>
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="ql-outercontainer">
    <QuillEditor
      ref="editorRef"
      theme="snow"
      contentType="html"
      :content="props.modelValue"
      :toolbar="[
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
      ]"
      @update:content="(newValue) => emit('update:modelValue', newValue)"
    />
  </div>
</template>

<style scoped lang="scss">
  .ql-outercontainer {
    width: 100%;
    height: 100%;
    position: relative;

    :deep(.ql-container) {
      width: 100%;
      min-height: 360px !important;
    }

    :deep(.ql-container p img) {
      display: block;
      width: 100%;
      height: auto;
      margin-bottom: 1em;
      object-fit: cover;
    }
  }
</style>
