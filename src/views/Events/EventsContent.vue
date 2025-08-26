<script setup>
  import { RouterLink } from 'vue-router';
  import { ref, computed, onMounted } from 'vue';
  import 'element-plus/dist/index.css';
  import { ElMessage } from 'element-plus';
  import Button from '@/components/Button.vue';
  import Pagination from '@/components/Pagination.vue';

  const { VITE_API_BASE } = import.meta.env;

  // 1保持 statusOptions和categoryOptions結構
  const statusOptions = [
  { label: '未發布', value: '0' },
  { label: '已發布', value: '2' },
  { label: '已取消', value: '3' },
];
  const categoryOptions = ref([]);
  const isLoading = ref(true);

  // 2建立fetchEventsData和fetchCategoriesData兩個獨立函式
  const tableData = ref([]);
  const fetchEventsData = async () => {
    try {
      //呼叫後台專用的events_get_admin.php
      const res = await fetch(`${VITE_API_BASE}/api/events/events_get_admin.php`);
      const data = await res.json();
      if (data.status === 'success') {
        tableData.value = data.data;
      }
    } catch (error) { console.error('獲取活動資料失敗:', error); }
  };

  const fetchCategoriesData = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE}/api/events/events_categories_get.php`);
      const data = await res.json();
      if (data.status === 'success') {
        // 把API回傳的資料直接map成el-select需要的{ label, value }格式
        categoryOptions.value = data.data.map(item => ({
          label: item.category_name,
          value: item.category_no,
        }));
      }
    } catch (error) { console.error('獲取分類資料失敗:', error); }
  };

  // 3建立updateEventStatus
  const updateEventStatus = async (event_no, status) => {
    try {
      const res = await fetch(`${VITE_API_BASE}/api/events/events_status_update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ event_no, status }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        ElMessage.success('狀態更新成功');
      } else {
        ElMessage.error('狀態更新失敗: ' + data.message);
      }
    } catch (error) { ElMessage.error('更新請求失敗'); }
  };

  // 4在onMounted中依序呼叫這些函式
  onMounted(async () => {
    isLoading.value = true;
    await fetchEventsData();
    await fetchCategoriesData();
    isLoading.value = false;
  });

  // 5修改filteredTableData的篩選邏輯
  const statusFilter = ref(null); // 改成null更符合el-select clearable的行為
  const categoryFilter = ref(null);
  const filteredTableData = computed(() => {
    return tableData.value.filter((item) => {
      const statusMatch = item.status == statusFilter.value || !statusFilter.value;
      const categoryMatch = item.category_no == categoryFilter.value || !categoryFilter.value;
      return statusMatch && categoryMatch;
    }).map(item => ({
      // 仍需要.map只為了加上category_label
      ...item,
      category_label: item.category_name 
    }));
  });

  const currentPage = ref(1);
  const pageSize = 12;
  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredTableData.value.slice(start, start + pageSize);
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
            >
              <!-- 增加一個「全部」的選項 -->
              <el-option label="全部狀態" value="" />
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="table-filters__select">
            <el-select
              v-model="categoryFilter"
              placeholder="類型"
              style="width: 240px"
            >
              <!-- 增加一個「全部」的選項 -->
              <el-option label="全部分類" value="" />
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <RouterLink to="/events_content/edit">
          <Button>
            新增活動
            <el-icon><Plus /></el-icon>
          </Button>
        </RouterLink>
      </div>
      <!--增加 v-loading 來顯示載入狀態 -->
      <div class="table" v-loading="isLoading">
        <el-table
          :data="currentPageData"
          border
          style="width: 100%"
        >
          <el-table-column prop="event_no" label="活動NO" width="100"/>
          <el-table-column prop="title" label="活動標題"/>
          <el-table-column prop="category_label" label="活動類型"/>
          <el-table-column prop="start_date" label="活動時間">
            <template #default="{ row }">
              <!-- 使用 JavaScript 的 slice(0, 16) 方法，只取前 16 個字元 (YYYY-MM-DD HH:mm) -->
              <span>{{ row.start_date ? row.start_date.slice(0, 16) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="狀態">
            <template #default="{ row }">
              <el-select
                v-model="row.status"
                style="width: 140px"
                @change="(newStatus) => updateEventStatus(row.event_no, newStatus)"
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
          <!-- <el-table-column prop="status" label="狀態">
            <template #default="{ row }">
              <el-select v-model="row.status" style="width: 140px" @change="handleStatusChange(row)">
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </template>
          </el-table-column> -->
          <el-table-column prop="manipulate" label="操作" width="200">
            <template #default="{ row }">
              <RouterLink :to="`/events_content/edit/${row.event_no}`">
                <el-button icon="Edit" circle />
              </RouterLink>
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
