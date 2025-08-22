<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import 'element-plus/dist/index.css';
  import Pagination from '@/components/Pagination.vue';

  const { VITE_API_BASE } = import.meta.env;

  // 狀態資料
  const statusOptions = [
    { label: '未認證', value: 0 },
    { label: '已認證', value: 2 },
    { label: '不通過', value: 3 },
  ];

  // 戶籍資料
  const tableData = ref([]);
  const fetchHouseholdsData = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE}/api//login/households_get2.php`);
      const data = await res.json();

      tableData.value = data.data.map((item) => {
        return {
          household_no: item.household_no,
          address: item.address,
          creator_name: item.creator_name,
          creator_id: item.creator_id,
          phone_number: item.phone_number,
          email: item.email,
          status: item.status,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 過濾戶籍
  const statusFilter = ref(null);
  const filteredTableData = computed(() => {
    return tableData.value.filter((item) => {
      const statusMatch = item.status === statusFilter.value || !statusFilter.value;
      return statusMatch;
    });
  });

  // 設定分頁
  const currentPage = ref(1);
  const pageSize = 12;

  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredTableData.value.slice(start, start + pageSize);
  });

  // 更新狀態
  const updateHouseholdsStatus = async (household_no, status) => {
    try {
      const res = await fetch(`${VITE_API_BASE}/api//login/status_post_update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          household_no: household_no,
          status: status,
        }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        ElMessage.success('更新成功');
      } else {
        ElMessage.error('更新失敗');
      }
    } catch (error) {
      console.error(error);
      ElMessage.error('更新錯誤');
    }
  };

  // 成員資料
  const membersData = ref([]);

  // 隱藏彈窗
  const isDialogVisible = ref(false);

  // 打開彈窗
  const openDialog = async (row) => {
    try {
      const res = await fetch(
        `${VITE_API_BASE}/api/login/members_get2.php?household_no=${row.household_no}`,
      );
      const data = await res.json();
      if (data.status === 'success') {
        membersData.value = data.data;
        isDialogVisible.value = true;
      } else {
        ElMessage.error('查看失敗');
      }
    } catch (error) {
      console.error(error);
      ElMessage.error('查看錯誤');
    }
  };

  // onMounted
  onMounted(async () => {
    await fetchHouseholdsData();
  });
</script>

<template>
  <el-container>
    <el-main>
      <div class="panel">
        <div class="panel-filters">
          <div class="table-filters__select">
            <el-select
              v-model="statusFilter"
              placeholder="狀態"
              style="width: 240px"
              clearable
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="currentPageData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="household_no"
            label="戶籍NO"
            width="100"
          />
          <el-table-column
            prop="address"
            label="戶籍地址"
          />
          <el-table-column
            prop="creator_name"
            label="家長"
          />
          <el-table-column
            prop="creator_id"
            label="帳號"
          />
          <el-table-column
            prop="phone_number"
            label="電話"
          />
          <el-table-column
            prop="email"
            label="電子信箱"
          />
          <el-table-column
            prop="status"
            label="狀態"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.status"
                style="width: 140px"
                @change="(status) => updateHouseholdsStatus(row.household_no, status)"
              >
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="詳細"
            label="詳細"
            width="200"
          >
            <template #default="{ row }">
              <el-button @click="openDialog(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <Pagination
          :total="filteredTableData.length"
          :page-size="pageSize"
          v-model:currentPage="currentPage"
        />
      </div>
    </el-main>
    <el-dialog
      v-model="isDialogVisible"
      title="戶籍成員資料"
      width="1000px"
    >
      <el-table
        :data="membersData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="user_id"
          label="帳號"
        />
        <el-table-column
          prop="fullname"
          label="姓名"
        />
        <el-table-column
          prop="gender"
          label="性別"
        />
        <el-table-column
          prop="birth_date"
          label="出生日期"
        />
        <el-table-column
          prop="id_number"
          label="身分證字號"
        />
        <el-table-column
          prop="phone_number"
          label="電話"
        />
        <el-table-column
          prop="email"
          label="電子信箱"
        />
      </el-table>
    </el-dialog>
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
</style>
