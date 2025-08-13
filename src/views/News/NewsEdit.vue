<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/News/news_test.json';
  import QuillEditor from '@/components/QuillEditor.vue';

  // 分類選項
  const categoryOptions = [
    { label: '公告', value: 1 },
    { label: '活動', value: 2 },
    { label: '補助', value: 3 },
    { label: '施工', value: 4 },
    { label: '防災', value: 5 },
  ];

  // 表單實例(Element Plus)
  const formRef = ref(null);
  const formData = ref({
    title: '',
    category: '',
    image: '',
    content: '',
  });

  // 驗證規則(Element Plus)
  const rules = {
    title: [{ required: true, message: '請輸入標題', trigger: 'blur' }],
    category: [{ required: true, message: '請選擇類型', trigger: 'change' }],
    image: [{ required: true, message: '請上傳圖片', trigger: 'change' }],
    content: [{ required: true, message: '請輸入內容', trigger: 'blur' }],
  };

  // 編輯編號
  const props = defineProps({
    news_no: {
      type: [String, Number],
      default: null,
    },
  });

  // 路由
  const router = useRouter();

  // 掛載初始資料：掛載後，若為編輯模式，讀取該筆消息資料填入表單
  onMounted(() => {
    // console.log('news_no from props:', props.news_no);

    // 編輯模式
    if (props.news_no) {
      // 從 rawData 中找到對應的消息資料
      const newsItem = rawData.find((item) => Number(item.news_no) === Number(props.news_no));
      if (newsItem) {
        // 填入表單資料
        formData.value.title = newsItem.title || '';
        formData.value.category = newsItem.category_no || '';
        formData.value.image = newsItem.image || '';
        formData.value.content = newsItem.content || '';
      } else {
        // 找不到該筆消息資料，則回列表
        alert('找不到該筆消息資料');
        router.push('/news');
      }
    }
  });

  // imgBB API Key
  const imgBBApiKey = '85f73586dc14a612f501432fed339a45';

  // 上傳圖片，串 imgBB API 取 url
  async function uploadImage(file) {
    const form = new FormData();
    form.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBApiKey}`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        formData.value.image = data.data.url; // 存到表單欄位
        alert('圖片上傳成功');
      } else {
        alert('圖片上傳失敗');
      }
    } catch (error) {
      alert('圖片上傳錯誤');
      console.error(error);
    }
  }

  // 選擇圖片
  function selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) uploadImage(file);
    };
  }

  // 當前日期
  function getToday() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  // 送出表單
  function submitForm() {
    // 驗證表單
    formRef.value.validate((valid) => {
      if (!valid) return;

      const published_at = getToday();

      // 編輯模式
      if (props.news_no) {
        const index = rawData.findIndex((item) => Number(item.news_no) === Number(props.news_no));
        if (index !== -1) {
          rawData[index] = {
            ...rawData[index],
            title: formData.value.title,
            category_no: formData.value.category,
            image: formData.value.image,
            content: formData.value.content,
            published_at,
          };
        }
      }
      // 新增模式
      else {
        const newNews = {
          news_no: rawData.length ? Math.max(...rawData.map((n) => n.news_no)) + 1 : 1,
          title: formData.value.title,
          category_no: formData.value.category,
          image: formData.value.image,
          content: formData.value.content,
          published_at,
          status: 0,
        };
        rawData.push(newNews);
      }

      console.log('表單送出成功', formData.value);
      router.push('/news');
      // 完成返回列表
    });
  }
</script>

<template>
  <el-container>
    <el-main>
      <el-form
        class="form"
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <div class="form__input input-group">
          <el-form-item
            class="input-group__item title"
            prop="title"
            label="消息標題"
          >
            <el-input
              v-model="formData.title"
              placeholder="請輸入標題"
            />
          </el-form-item>
          <el-form-item
            class="input-group__item category"
            prop="category"
            label="消息類型"
          >
            <el-select
              v-model="formData.category"
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
          <div class="form__input input-group">
            <el-form-item
              class="input-group__item image"
              prop="title"
              label="消息圖片"
            >
              <el-input
                v-model="formData.image"
                placeholder="請上傳圖片"
                readonly
              >
                <template #append>
                  <el-button
                    type="primary"
                    @click="selectImage"
                  >
                    上傳
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form__text-editor">
          <el-form-item
            prop="content"
            label="消息內容"
          >
            <QuillEditor v-model="formData.content" />
          </el-form-item>
        </div>

        <div class="form__button">
          <Button
            type="primary"
            @click="submitForm"
          >
            儲存
          </Button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
  .form {
    display: flex;
    flex-direction: column;
    width: 76.9%;
    margin: 40px 0;
    padding: 0 40px;
    gap: 40px;
    .input-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      gap: 40px;
      .title {
        width: 60%;
      }
      .category {
        width: 30%;
      }
      .image {
        width: 100%;
      }
    }
    &__text-editor {
      width: 100%;
      :deep(.el-form-item) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      :deep(.el-form-item__content) {
        display: block !important;
        width: 100%;
      }
    }
    &__button {
      margin-top: 30px;
      text-align: right;
    }
  }
</style>
