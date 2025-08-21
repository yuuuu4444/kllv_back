<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import QuillEditor from '@/components/QuillEditor.vue';

  const { VITE_API_BASE } = import.meta.env;

  // 路由
  const router = useRouter();

  // 當前日期
  const getToday = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // 分類資料
  const categoryOptions = ref([]);
  const fetchNewsCategoryData = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE}/api//news/categories_get.php`);
      const data = await res.json();

      categoryOptions.value = data.data.map((item) => {
        return {
          value: item.category_no,
          label: item.category_name,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 消息編號
  const props = defineProps({
    news_no: {
      type: Number,
      default: null,
    },
  });

  // 消息資料
  // 表單實例(Element Plus Form 標籤)
  const formRef = ref(null);
  const formData = ref({
    title: '',
    category_no: '',
    image: '',
    content: '',
    published_at: getToday(),
  });
  const fetchNewsData = async () => {
    if (!props.news_no) return;

    try {
      const res = await fetch(`${VITE_API_BASE}/api//news/news_get2.php`);
      const data = await res.json();

      const item = data.data.find((i) => i.news_no == props.news_no);
      formData.value = {
        title: item.title,
        category_no: item.category_no,
        image: item.image,
        content: item.content,
        published_at: item.published_at,
      };
    } catch (error) {
      console.error(error);
      router.push('/news');
    }
  };

  // 驗證規則(Element Plus Form 標籤)
  const rules = {
    title: [{ required: true, message: '請輸入標題', trigger: 'blur' }],
    category_no: [{ required: true, message: '請選擇類型', trigger: 'change' }],
    image: [{ required: false, message: '請上傳圖片', trigger: 'change' }],
    content: [{ required: true, message: '請輸入內容', trigger: 'blur' }],
  };

  // imgBB API Key
  const imgBBApiKey = '85f73586dc14a612f501432fed339a45';

  // 上傳圖片，串 imgBB API 取 url
  const uploadImage = async (file) => {
    const form = new FormData();
    form.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBApiKey}`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        formData.value.image = data.data.url;
        ElMessage.success('上傳成功');
      } else {
        ElMessage.error('上傳失敗');
      }
    } catch (error) {
      ElMessage.error('上傳錯誤');
      console.error(error);
    }
  };

  // 選擇圖片
  const selectImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) uploadImage(file);
    };
  };

  // 送出表單
  const submitForm = async () => {
    // 驗證表單
    formRef.value.validate(async (valid) => {
      if (!valid) return;

      // 判斷是新增還是編輯
      const apiUrl = props.news_no
        ? `${VITE_API_BASE}/api//news/news_post_update.php`
        : `${VITE_API_BASE}/api//news/news_post_create.php`;

      // 準備資料
      const payload = {
        news_no: Number(props.news_no), // 編輯模式
        title: formData.value.title,
        category_no: formData.value.category_no,
        image: formData.value.image,
        content: formData.value.content,
        published_at: formData.value.published_at,
        status: 0,
      };

      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (data.status === 'success') {
          ElMessage.success('更新成功');
          router.push('/news');
        } else {
          ElMessage.error('更新失敗');
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('更新錯誤');
      }
    });
  };

  // onMounted
  onMounted(async () => {
    await fetchNewsData();
    await fetchNewsCategoryData();
  });
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
            prop="category_no"
            label="消息類型"
          >
            <el-select
              v-model="formData.category_no"
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
        <div class="form__input input-group">
          <el-form-item
            class="input-group__item image"
            prop="image"
            label="．消息圖片"
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
    gap: 20px;
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
