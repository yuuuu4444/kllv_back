<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/Events/events_test.json';
  import QuillEditor from '@/components/QuillEditor.vue';

  // 分類選項
  const categoryOptions = [
    { label: '旅遊', value: 1 },
    { label: '健康', value: 2 },
    { label: '藝文', value: 3 },
    { label: '其他', value: 4 },
  ];

  // 表單實例(Element Plus Form 標籤)
  const formRef = ref(null);
  const formData = ref({
    title: '',
    category: '',
    location: '',
    image: '',
    description: '',
    fee_per_person: '',
    p_limit: '',
    daterange: '',
    reg_deadline: '',
    created_at: getToday(),
  });

  // 驗證規則(Element Plus Form 標籤)
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

  // 編輯編號
  const props = defineProps({
    event_no: {
      type: [String, Number],
      default: null,
    },
  });

  // 路由
  const router = useRouter();

  // 掛載初始資料
  onMounted(() => {
    // 編輯模式
    if (props.event_no) {
      // 從 rawData 中找到對應的消息資料
      const eventsItem = rawData.find((item) => Number(item.event_no) === Number(props.event_no));
      if (eventsItem) {
        // 填入表單資料
        formData.value.title = eventsItem.title || '';
        formData.value.category = eventsItem.category_no || '';
        formData.value.location = eventsItem.location || '';
        formData.value.image = eventsItem.image || '';
        formData.value.description = eventsItem.description || '';
        formData.value.fee_per_person = eventsItem.fee_per_person || '';
        formData.value.p_limit = eventsItem.p_limit || '';
        formData.value.daterange = [eventsItem.start_date, eventsItem.end_date] || [];
        formData.value.reg_deadline = eventsItem.reg_deadline || '';
      } else {
        // 找不到該筆消息資料，返回列表
        alert('找不到該筆消息資料');
        router.push('/events_content');
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

      const created_at = getToday();

      // 編輯模式
      if (props.event_no) {
        const index = rawData.findIndex((item) => Number(item.event_no) === Number(props.event_no));
        if (index !== -1) {
          rawData[index] = {
            ...rawData[index],
            title: formData.value.title,
            category_no: formData.value.category,
            location: formData.value.location,
            image: formData.value.image,
            description: formData.value.description,
            fee_per_person: formData.value.fee_per_person,
            p_limit: formData.value.p_limit,
            start_date: formData.value.daterange[0],
            end_date: formData.value.daterange[1],
            reg_deadline: formData.value.reg_deadline,
            created_at,
          };
        }
      }
      // 新增模式
      else {
        const newEvent = {
          event_no: rawData.length ? Math.max(...rawData.map((n) => n.event_no)) + 1 : 1,
          title: formData.value.title,
          category_no: formData.value.category,
          location: formData.value.location,
          image: formData.value.image,
          description: formData.value.description,
          fee_per_person: formData.value.fee_per_person,
          p_limit: formData.value.p_limit,
          start_date: formData.value.daterange[0],
          end_date: formData.value.daterange[1],
          reg_deadline: formData.value.reg_deadline,
          created_at,
          status: 0,
        };
        rawData.push(newEvent);
      }

      console.log('表單儲存成功', formData.value);
      router.push('/events_content');
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
            label="活動日期"
          >
            <el-date-picker
              v-model="formData.daterange"
              start-placeholder="起"
              range-separator="～"
              end-placeholder="迄"
              value-format="YYYY-MM-DD"
              type="daterange"
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
