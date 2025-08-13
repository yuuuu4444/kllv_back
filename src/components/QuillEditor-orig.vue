<script setup>
  import { QuillEditor } from '@vueup/vue-quill';
  import { onMounted, ref } from 'vue';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['update:modelValue']);

  const editorRef = ref(null);

  const imgBBApiKey = '85f73586dc14a612f501432fed339a45'; // imgBB API Key

  onMounted(() => {
    const quill = editorRef.value?.getQuill();
    if (!quill) return;

    // 取得 Quill 的 toolbar 模組
    // 自訂 handler，點工具列的「圖片」按鈕時會執行這段函式，取代預設行為
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
      const input = Object.assign(document.createElement('input'), {
        // 用 Object.assign 一次設定多個屬性，比多行 setAttribute 更精簡
        type: 'file',
        accept: 'image/*',
      });
      input.click();

      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;

        // 建立 FormData，上傳圖片檔案，串 imgBB API
        const formData = new FormData();
        formData.append('image', file);
        fetch(`https://api.imgbb.com/1/upload?key=${imgBBApiKey}`, {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              // 插入圖片到編輯器
              quill.root.querySelector('img')?.remove(); // 移除原圖，永遠一張
              quill.insertEmbed(0, 'image', data.data.url); // 新增圖片置頂
              quill.insertText(1, '\n'); // 圖片後面換行
              quill.setSelection(2); // 游標移到空行
              console.log('圖片上傳成功', data.data.url);
              alert('圖片上傳成功，請稍等 2 ~ 3 分鐘');
            } else {
              alert('圖片上傳失敗');
            }
          })
          .catch(() => {
            alert('圖片上傳錯誤');
          });
      };
    });
  });
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
        ['link', 'image'],
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
