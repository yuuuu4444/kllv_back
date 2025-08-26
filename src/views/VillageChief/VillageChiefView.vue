<script setup>
  import { useRouter } from 'vue-router';
  import { ref, computed, onMounted } from 'vue';
  import 'element-plus/dist/index.css';
  import { ElMessage, ElIcon } from 'element-plus';
  import { Plus } from '@element-plus/icons-vue';
  import Button from '@/components/Button.vue';
  import { useAuthStore } from '@/stores/auth';
  // import rawData from '@/assets/data/VillageChiefs/village_chiefs_test.json';
  // const originalData = ref(rawData);
  // const isEditing = ref(false);
  // const tableData = ref(
  //   rawData.map((item) => {
  //     return {
  //       id: item.vc_no,
  //       name: item.vc_name,
  //       intro: item.vc_intro,
  //       phone: item.vc_phone,
  //       email: item.vc_email,
  //       address: item.vc_address,
  //     };
  //   }),
  // );
  const auth = useAuthStore();
  const router = useRouter();
  const { VITE_API_BASE } = import.meta.env;

  const originalData = ref([]); // 用來存放從 API 獲取的、未經修改的原始資料
  const tableData = ref([]); // 用來綁定到 Element Plus 表格，會在編輯模式下被修改
  const isEditing = ref(false);
  const isLoading = ref(true);
  const imageUrl = ref(''); // 用於 el-upload 的圖片預覽 URL

  // GET里長資料
  async function fetchVillageChief() {
    isLoading.value = true;
    try {
      const apiUrl = `${VITE_API_BASE}/api/about/village_chief_get.php`;
      const res = await fetch(apiUrl, {
        credentials: 'include',
      });
      if (!res.ok) {
        if (res.status === 401) auth.logout(); // Session 過期自動登出
        throw new Error(`HTTP 錯誤: ${res.status}`);
      }

      const data = await res.json();
      if (data.status !== 'success') throw new Error(data.message || '取得資料失敗');

      // 使用深層複製來分別儲存原始資料和可編輯資料
      originalData.value = JSON.parse(JSON.stringify(data.data));
      tableData.value = data.data;

      // 如果資料庫中有頭像路徑，則設定圖片預覽 URL
      if (data.data.length > 0 && data.data[0].profile_image) {
        const imagePath = data.data[0].profile_image;
        imageUrl.value = imagePath.startsWith('http') ? imagePath : `${VITE_API_BASE}${imagePath}`;
      } else {
        imageUrl.value = '';
      }
    } catch (error) {
      ElMessage.error(error.message || '资料载入失败');
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(() => {
    if (!auth.isLoggedIn) {
      auth.fetchMe().then((isSuccess) => {
        if (isSuccess) fetchVillageChief();
        else router.push('/admin/login');
      });
    } else {
      fetchVillageChief();
    }
  });

  // const findChanges = (original, edited) => {
  //   const changes = {};
  //   for (let key in edited) {
  //     if (edited[key] !== original[key]) {
  //       changes[key] = edited[key];
  //     }
  //   }
  //   return changes;
  // };

  const findChanges = (original, edited) => {
    const changes = {};
    const keysToCompare = ['fullname', 'introduction', 'phone_number', 'email', 'address'];

    for (const key of keysToCompare) {
      if (original[key] !== edited[key]) {
        changes[key] = edited[key];
      }
    }
    return changes;
  };

  // const saveChanges = async () => {
  //   for (let i = 0; i < tableData.value.length; i++) {
  //     const original = originalData.value[i];
  //     const edited = tableData.value[i];

  //     const changes = findChanges(original, edited);

  //     if (Object.keys(changes).length > 0) {
  //       const payload = { id: edited.vc_no, ...changes };

  //       console.log('更新資料:', payload);
  //     }
  //   }

  //   ElMessage.success('已儲存變更！');
  // };

  //POST修改里長資料
  const saveChanges = async () => {
    // 因為里長只有一位，直接處理 tableData[0]
    if (tableData.value.length === 0) {
      ElMessage.warning('目前沒有可編輯的資料');
      isEditing.value = false;
      return;
    }

    const original = originalData.value[0];
    const edited = tableData.value[0];
    const changes = findChanges(original, edited);

    if (Object.keys(changes).length === 0) {
      ElMessage.info('資料未變更');
      isEditing.value = false;
      tableData.value = JSON.parse(JSON.stringify(originalData.value)); //還原儲存前狀態
      return;
    }

    const payload = { chief_id: edited.chief_id, ...changes };
    try {
      const apiUrl = `${VITE_API_BASE}/api/about/village_chief_update_post.php`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'success') throw new Error(data.message || '儲存失敗');

      // 儲存成功後，將編輯後的資料更新回原始資料
      originalData.value = JSON.parse(JSON.stringify(tableData.value));
      ElMessage.success('已儲存變更！');
      isEditing.value = false;
    } catch (error) {
      ElMessage.error(error.message || '儲存失敗');
      tableData.value = JSON.parse(JSON.stringify(originalData.value));
    }
  };

  const handelSave = () => {
    if (isEditing.value) {
      // 如果現在是儲存模式，就只呼叫 saveChanges
      // 由 saveChanges 內部的邏輯來決定是否要退出編輯模式
      saveChanges();
    } else {
      // 如果現在是編輯模式，才切換狀態進入編輯模式
      isEditing.value = true;
    }
  };

  //里長頭貼更新上傳
  const handleAvatarSuccess = (response, uploadFile) => {
    if (response.status === 'success') {
      const newImageUrl = `${VITE_API_BASE}${response.data.url}?t=${new Date().getTime()}`;
      imageUrl.value = newImageUrl;

      if (originalData.value[0]) {
        originalData.value[0].profile_image = response.data.url;
      }

      ElMessage.success('圖片上傳成功！');
    } else {
      ElMessage.error(response.message || '圖片上傳失敗');
    }
  };

  const beforeAvatarUpload = (rawFile) => {
    const isJpgOrPng = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';
    const isLt5M = rawFile.size / 1024 / 1024 < 5;

    if (!isJpgOrPng) ElMessage.error('大頭照只能是 JPG 或 PNG 格式!');
    if (!isLt5M) ElMessage.error('圖片大小不能超過 5MB');
    return isJpgOrPng && isLt5M;
  };
</script>

<template>
  <el-container>
    <el-main>
      <div class="panel">
        <Button @click="handelSave">
          {{ isEditing ? '儲存' : '編輯' }}
        </Button>
      </div>
      <div
        v-if="isLoading"
        class="table-loading"
      >
        載入中...
      </div>
      <div
        v-else-if="tableData.length === 0"
        class="table-empty"
      >
        資料庫中尚無里長資料。
      </div>
      <div
        v-else
        class="table"
      >
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="fullname"
            label="姓名"
            width="100"
          >
            <template #default="{ row }">
              <el-input
                v-if="isEditing"
                v-model="row.fullname"
                type="text"
              />
              <span v-else>{{ row.fullname }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="introduction"
            label="簡介"
            width="500"
          >
            <template #default="{ row }">
              <el-input
                v-if="isEditing"
                v-model="row.introduction"
                type="textarea"
                autosize
              />
              <span v-else>{{ row.introduction }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone_number"
            label="電話"
          >
            <template #default="{ row }">
              <el-input
                v-if="isEditing"
                v-model="row.phone_number"
                type="text"
              />
              <span v-else>{{ row.phone_number }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="信箱"
          >
            <template #default="{ row }">
              <el-input
                v-if="isEditing"
                v-model="row.email"
                type="textarea"
                autosize
              />
              <span v-else>{{ row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
          >
            <template #default="{ row }">
              <el-input
                v-if="isEditing"
                v-model="row.address"
                type="textarea"
                autosize
              />
              <span v-else>{{ row.address }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="image-panel">
        <div class="image-panel__title">里長圖片管理</div>
        <div class="image-panel__row">
          <div class="image-panel__label">里長個人大頭照</div>
          <el-upload
            class="avatar-uploader"
            :action="`${VITE_API_BASE}/api/about/village_chief_avatarupload_post.php`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :with-credentials="true"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
            />
            <el-icon
              v-else
              class="avatar-uploader-icon"
            >
              <Plus />
            </el-icon>
          </el-upload>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
  .el-main {
    padding: 0;
  }

  .panel {
    display: flex;
    justify-content: flex-end;
    padding: 0 50px;
    margin: 30px 0;
  }

  .table {
    margin-bottom: 20px;
  }

  ::v-deep(.el-table__header th) {
    background-color: rgba(0, 75, 128, 0.5);
    color: #fff;
    text-align: center;
  }

  ::v-deep(.el-table__body td) {
    text-align: center;
  }

  .image-panel {
    border: 1px solid #ddd;
    .image-panel__title {
      padding: 10px 0;
      text-align: center;
      background-color: rgba(0, 75, 128, 0.5);
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .image-panel__row {
      display: flex;
      flex-direction: column;
      .image-panel__label {
        text-align: center;
        padding: 10px 0;
        color: rgb(96, 98, 102);
        font-size: 14px;
        border-bottom: 1px solid #ddd;
      }

      .avatar-uploader {
        width: 300px;
        height: 250px;
        border: 1px dashed #d9d9d9;
        display: flex;
        justify-content: center;
        cursor: pointer;
        border-radius: 6px;
        overflow: hidden;
        margin: 20px 0;
        align-self: center;
        ::v-deep(.el-upload) {
          width: 100%;
        }
        .avatar {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #999;
      }

      .avatar-uploader:hover {
        border-color: var(--el-color-primary);
        .avatar-uploader-icon {
          color: var(--el-color-primary);
        }
      }
    }
  }
</style>
