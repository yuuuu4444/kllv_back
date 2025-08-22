<script setup>
  import { ref, onMounted } from 'vue'; // 移除computed
  import { useRouter } from 'vue-router';
  import Button from '@/components/Button.vue';
  // import rawData from '@/assets/data/Events/events_test.json'; // 假資料
  import QuillEditor from '@/components/QuillEditor.vue';

  // 引入環境變數 & 準備 ref
  const { VITE_API_BASE } = import.meta.env;
  const props = defineProps({ event_no: { type: [String, Number], default: null } });
  const router = useRouter();
  const isEditMode = !!props.event_no;

  const formRef = ref(null);
  const formData = ref({
    title: '',
    category: '',
    location: '',
    image: '',
    description: '',
    fee_per_person: '',
    p_limit: '',
    daterange: [], 
    reg_deadline: '',
  });
  const categoryOptions = ref([]); // 分類選項將由 API 填充
  const isLoading = ref(true); // 頁面載入狀態
  const isSubmitting = ref(false); // 表單送出狀態

  const rules = {
    title: [{ required: true, message: '請輸入標題', trigger: 'blur' }],
    category: [{ required: true, message: '請選擇類型', trigger: 'change' }],
    location: [{ required: true, message: '請輸入地點', trigger: 'blur' }],
    image: [{ required: true, message: '請上傳圖片', trigger: 'change' }],
    description: [{ required: true, message: '請輸入內容', trigger: 'blur' }],
    fee_per_person: [{ required: true, message: '請輸入費用', trigger: 'blur' }],
    p_limit: [{ required: true, message: '請輸入名額', trigger: 'blur' }],
    daterange: [{ required: true, message: '請選擇日期', trigger: 'blur' }],
    reg_deadline: [{ required: true, message: '請選擇日期', trigger: 'blur' }],
  };

  // ImgBB API Key
  const imgBBApiKey = '85f73586dc14a612f501432fed339a45';

  // 上傳圖片函式
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
        formData.value.image = data.data.url; // 將獲取到的圖片 URL 存到表單欄位
        alert('圖片上傳成功');
      } else {
        alert('圖片上傳失敗');
      }
    } catch (error) {
      alert('圖片上傳錯誤');
      console.error(error);
    }
  }

  // 觸發檔案選擇的函式
  function selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) uploadImage(file);
    };
    input.click();
  }

  // 改造 onMounted 來獲取真實資料
  onMounted(async () => {
    isLoading.value = true;
    try {
      const catRes = await fetch(`${VITE_API_BASE}/api/events/events_categories_get.php`);
      const catData = await catRes.json();
      if (catData.status === 'success') {
        categoryOptions.value = catData.data.map(c => ({ label: c.category_name, value: c.category_no }));
      }

      if (isEditMode) {
        // 優化：未來可以建立一支只撈一筆的 API
        const eventsRes = await fetch(`${VITE_API_BASE}/api/events/events_get.php`);
        const eventsData = await eventsRes.json();
        if (eventsData.status === 'success') {
          const eventItem = eventsData.data.find(item => Number(item.event_no) === Number(props.event_no));
          if (eventItem) {
            formData.value = {
              title: eventItem.title,
              category: eventItem.category_no,
              location: eventItem.location,
              image: eventItem.image || '',
              description: eventItem.description,
              fee_per_person: eventItem.fee_per_person,
              p_limit: eventItem.p_limit,
              daterange: [eventItem.start_date, eventItem.end_date],
              reg_deadline: eventItem.reg_deadline,
            };
          } else {
            alert('找不到該筆活動資料');
            router.push('/events_content');
          }
        }
      }
    } catch (error) {
      console.error("載入編輯頁面時發生錯誤:", error);
      alert("頁面載入失敗");
    } finally {
      isLoading.value = false;
    }
  });

  // 改造 submitForm 來呼叫真實 API
  async function submitForm() {
    const valid = await formRef.value.validate();
    if (!valid) return;

    isSubmitting.value = true;
    try {
      let url;
      let options;

      if (isEditMode) {
        url = `${VITE_API_BASE}/api/events/events_put.php?event_no=${props.event_no}`;
        const bodyParams = new URLSearchParams();
        for (const key in formData.value) {
          if (key === 'daterange') {
              bodyParams.append('daterange[]', formData.value.daterange[0]);
              bodyParams.append('daterange[]', formData.value.daterange[1]);
          } else {
              bodyParams.append(key, formData.value[key]);
          }
        }
        options = { method: 'PUT', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: bodyParams };
      } else {
        url = `${VITE_API_BASE}/events/events_post.php`;
        const bodyData = new FormData();
        for (const key in formData.value) {
          if (key === 'daterange') {
            bodyData.append('daterange[]', formData.value.daterange[0]);
            bodyData.append('daterange[]', formData.value.daterange[1]);
          } else {
            bodyData.append(key, formData.value[key]);
          }
        }
        options = { method: 'POST', body: bodyData };
      }

      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || '表單提交失敗');
      }

      alert(data.message);
      router.push('/events_content');

    } catch (error) {
      console.error("提交表單時發生錯誤:", error);
      alert(error.message);
    } finally {
      isSubmitting.value = false;
    }
  }
</script>

<template>
  <el-container>
    <el-main v-loading="isLoading">
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
            label="活動標題"
          >
            <el-input
              v-model="formData.title"
              placeholder="請輸入標題"
            />
          </el-form-item>
          <el-form-item
            class="input-group__item category"
            prop="category"
            label="活動類型"
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
        </div>
        <div class="form__input input-group">
          <el-form-item
            class="input-group__item daterange"
            prop="daterange"
            label="活動時間"
          >
            <el-date-picker
              v-model="formData.daterange"
              start-placeholder="起"
              range-separator="～"
              end-placeholder="迄"
              value-format="YYYY-MM-DD HH:mm"
              format="YYYY-MM-DD HH:mm" 
              type="datetimerange"
            />
          </el-form-item>
          <el-form-item
            class="input-group__item deadline"
            prop="reg_deadline"
            label="截止日期"
          >
            <el-date-picker
              v-model="formData.reg_deadline"
              placeholder="請選擇日期"
              value-format="YYYY-MM-DD"
              type="date"
            />
          </el-form-item>
        </div>
        <div class="form__input input-group">
          <el-form-item
            class="input-group__item location"
            prop="location"
            label="活動地點"
          >
            <el-input
              v-model="formData.location"
              placeholder="請輸入地點"
            />
          </el-form-item>
          <el-form-item
            class="input-group__item fee_per_person"
            prop="fee_per_person"
            label="活動費用"
          >
            <el-input
              v-model="formData.fee_per_person"
              placeholder="請輸入費用"
              type="number"
              min="0"
            />
          </el-form-item>
          <el-form-item
            class="input-group__item p_limit"
            prop="p_limit"
            label="活動名額"
          >
            <el-input
              v-model="formData.p_limit"
              placeholder="請輸入名額"
              type="number"
              min="0"
            />
          </el-form-item>
        </div>
        <div class="form__input input-group">
          <el-form-item
            class="input-group__item image"
            prop="image"
            label="活動圖片"
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
            prop="description"
            label="活動內容"
          >
            <QuillEditor v-model="formData.description" />
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
    gap: 10px;
    .input-group {
      display: flex;
      justify-content: space-between;
      width: 100%;
      // gap: 40px;
      .title,
      .daterange {
        width: 60%;
      }
      .category {
        width: 30%;
      }
      .deadline {
        width: 32%;
      }
      .deadline :deep(.el-date-editor) {
        --el-date-editor-width: 100% !important;
      }
      .deadline :deep(.el-date-editor input) {
        text-align: center;
      }
      .location {
        width: 50%;
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
