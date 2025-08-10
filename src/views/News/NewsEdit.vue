<script setup>
  import { ref } from 'vue';
  import Button from '@/components/Button.vue';
  import QuillEditor from '@/components/QuillEditor.vue';

  const title = ref('');
  const category = ref('');
  const content = ref('');

  const categoryOptions = [
    { label: '公告', value: 1 },
    { label: '活動', value: 2 },
    { label: '補助', value: 3 },
    { label: '施工', value: 4 },
    { label: '防災', value: 5 },
  ];

  function submitForm() {
    console.log({
      title: title.value,
      category: category.value,
      content: content.value,
    });
  }
</script>

<template>
  <el-container>
    <el-main>
      <form class="form">
        <div class="form__input input-group">
          <el-form-item
            class="input-group__item title"
            label="消息標題"
          >
            <el-input
              id="title"
              v-model="title"
              placeholder="請輸入標題"
            />
          </el-form-item>
          <el-form-item
            class="input-group__item category"
            label="消息類型"
          >
            <el-select
              id="category"
              v-model="category"
              placeholder="請選擇類型"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="form__text-editor">
          <QuillEditor v-model="content" />
        </div>

        <div class="form__button">
          <Button
            type="primary"
            @click="submitForm"
          >
            送出
          </Button>
        </div>
      </form>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
  .el-main {
    padding: 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    width: 76.9%;
    margin: 40px 0;
    padding: 0 40px;
    gap: 40px;
    .input-group {
      display: flex;
      width: 100%;
      gap: 40px;
      &__item {
        display: flex;
      }
      .title {
        width: 800px;
      }
      .category {
        width: 360px;
      }
    }
    &__text-editor {
      width: 100%;
      height: 400px;
      min-height: 400px;
    }
    &__button {
      margin-top: 30px;
      text-align: right;
    }
  }
</style>
