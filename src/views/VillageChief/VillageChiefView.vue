<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/VillageChiefs/village_chiefs_test.json';
  const originalData = ref(rawData);
  const isEditing = ref(false);

  const tableData = ref(
    rawData.map((item) => {
      return {
        id: item.vc_no,
        name: item.vc_name,
        intro: item.vc_intro,
        phone: item.vc_phone,
        email: item.vc_email,
        address: item.vc_address,
      };
    }),
  );

  const findChanges = (original, edited) => {
    const changes = {};
    for (let key in edited) {
      if (edited[key] !== original[key]) {
        changes[key] = edited[key];
      }
    }
    return changes;
  };

  const saveChanges = async () => {
    for (let i = 0; i < tableData.value.length; i++) {
      const original = originalData.value[i];
      const edited = tableData.value[i];

      const changes = findChanges(original, edited);

      if (Object.keys(changes).length > 0) {
        const payload = { id: edited.vc_no, ...changes };

        console.log('更新資料:', payload);
      }
    }

    ElMessage.success('已儲存變更！');
  };

  const handelSave = () => {
    if (isEditing.value) {
      saveChanges();
    }
    isEditing.value = !isEditing.value;
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
      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="姓名"
            width="100"
          >
            <template #default="{ row }">
              <el-input
                v-if="isEditing"
                v-model="row.name"
                type="text"
              />
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="intro"
            label="簡介"
            width="500"
          >
            <template #default="{ row }">
              <el-input
                v-if="isEditing"
                v-model="row.intro"
                type="textarea"
                autosize
              />
              <span v-else>{{ row.intro }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="電話"
          >
            <template #default="{ row }">
              <el-input
                v-if="isEditing"
                v-model="row.phone"
                type="text"
              />
              <span v-else>{{ row.phone }}</span>
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
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
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
