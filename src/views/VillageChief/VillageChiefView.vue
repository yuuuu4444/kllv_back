<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/VillageChiefs/village_chiefs_test.json';

  const tableData = ref(
    rawData.map((item) => {
      return {
        姓名: item.vc_name,
        簡介: item.vc_intro,
        電話: item.vc_phone,
        信箱: item.vc_email,
        地址: item.vc_address,
      };
    }),
  );
</script>

<template>
  <el-container>
    <el-main>
      <div class="panel">
        <Button>編輯</Button>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="姓名"
            label="姓名"
            width="100"
          />
          <el-table-column
            prop="簡介"
            label="簡介"
            width="500"
          />
          <el-table-column
            prop="電話"
            label="電話"
          />
          <el-table-column
            prop="信箱"
            label="信箱"
          />
          <el-table-column
            prop="地址"
            label="地址"
          />
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
