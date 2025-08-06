<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/admin/admin_test.json';
  import Pagination from '@/components/Pagination.vue';
  import BaseDialog from '@/components/BaseDialog.vue';
  const buttonColor = ref('#004b80');
  const textColor = ref('#fff');
  const value = ref('');
  const nameSearch = ref('');
  const showDialog = ref(false);

  const options = [
    { label: '全部', value: '' },
    { label: '已啟用', value: '已啟用' },
    { label: '已停用', value: '已停用' },
  ];

  // 從json檔內取資料套入table內
  const rawTableData = ref(
    rawData.map((item, index) => {
      // console.log(item);
      return {
        id: index + 1,
        full_name: item.full_name,
        admin_id: item.admin_id,
        password: item.password,
        is_active: item.is_active,
        active: item.is_active ? '已啟用' : '已停用',
      };
    }),
  );

  const updateStatus = (row, val) => {
    row.is_active = val === '已啟用';
    row.active = val;
  };

  const filteredTableData = computed(() => {
    return rawTableData.value.filter((item) => {
      const statusMatch = !value.value || item.active === value.value;
      const nameMatch = !nameSearch.value || item.full_name.includes(nameSearch.value);
      return statusMatch && nameMatch;
    });
  });

  // 控制每一頁呈現的資料長度
  const currentPage = ref(1); // 記錄目前在第幾頁
  const pageSize = 12; // 每頁要顯示的資料數

  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredTableData.value.slice(start, start + pageSize);
  });

  const form = ref({
    full_name: '',
    admin_id: '',
    password: '',
  });

  const resetForm = () => {
    form.value = {
      full_name: '',
      admin_id: '',
      password: '',
    };
  };

  const handleSubmit = () => {
    if (!form.value.full_name || !form.value.admin_id || !form.value.password) {
      ElMessage.error('請填寫完整資訊');
      return;
    }

    console.log('新增資料：', form.value);
    ElMessage.success('新增成功');
    showDialog.value = false;
    resetForm();
  };
</script>

<template>
  <el-container>
    <el-main>
      <div class="panel">
        <div class="panel-filters">
          <div class="table-filters__select">
            <el-select
              v-model="value"
              placeholder="狀態"
              style="width: 240px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="panel-filters__input flex gap-4">
            <el-input
              v-model="nameSearch"
              style="width: 240px"
              placeholder="姓名"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        <Button
          plain
          @click="showDialog = true"
        >
          新增管理員
          <el-icon><Plus /></el-icon>
        </Button>
      </div>
      <div class="table">
        <el-table
          :data="currentPageData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="序號"
            width="100"
          />
          <el-table-column
            prop="full_name"
            label="姓名"
          />
          <el-table-column
            prop="admin_id"
            label="帳號"
          />
          <el-table-column
            prop="password"
            label="密碼"
          />
          <el-table-column
            prop="active"
            label="狀態"
            width="200"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.active"
                placeholder="選擇狀態"
                style="width: 140px"
                @change="(val) => updateStatus(row, val)"
              >
                <el-option
                  label="已啟用"
                  value="已啟用"
                />
                <el-option
                  label="已停用"
                  value="已停用"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <Pagination
          :total="rawTableData.length"
          :page-size="pageSize"
          v-model:currentPage="currentPage"
        />
      </div>

      <BaseDialog
        v-model="showDialog"
        title="新增管理員"
      >
        <template #body>
          <el-form
            label-position="top"
            :model="form"
          >
            <el-form-item label="姓名">
              <el-input v-model="form.full_name" />
            </el-form-item>

            <el-form-item label="帳號">
              <el-input v-model="form.admin_id" />
            </el-form-item>

            <el-form-item label="密碼">
              <el-input v-model="form.password" />
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <el-form>
            <el-button
              type="primary"
              :style="{
                backgroundColor: buttonColor,
                color: textColor,
              }"
              @click="handleSubmit"
              class="form__save-btn"
            >
              儲存
            </el-button>
          </el-form>
        </template>
      </BaseDialog>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
  .el-main {
    padding: 0;
  }

  .panel {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    margin: 30px 0;
  }

  .panel-filters {
    display: flex;
    gap: 20px;
  }

  ::v-deep(.el-table__header th) {
    background-color: rgba(0, 75, 128, 0.5);
    color: #fff;
    text-align: center;
  }

  ::v-deep(.el-table__body td) {
    text-align: center;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 40px 0;
    padding-right: 50px;
  }

  .form__save-btn {
    width: 100%;
    height: 35px;
  }
</style>
