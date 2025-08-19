<script setup>
  import { RouterLink } from 'vue-router';
  import { ref, computed, onMounted } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  // import rawData from '@/assets/data/Events/events_test.json'; //假資料
  import Pagination from '@/components/Pagination.vue';

  // 引入環境變數 & 準備 ref
  const { VITE_API_BASE } = import.meta.env;
  const tableData = ref([]); // 用於儲存從 API 獲取的活動列表
  const categoryOptions = ref([]); // 用於儲存從 API 獲取的分類列表
  const isLoading = ref(true); // 用於追蹤載入狀態

  const statusFilter = ref('');
  const statusOptions = [
    { label: '未發布', value: 0 },
    { label: '已發布', value: 2 },
    { label: '已取消', value: 3 },
  ];
  const categoryFilter = ref('');

  // 在 onMounted 中呼叫 API ---
  onMounted(async () => {
    isLoading.value = true;
    try {
      const [eventsRes, categoriesRes] = await Promise.all([
        fetch(`${VITE_API_BASE}/api/events/events_get.php`),
        fetch(`${VITE_API_BASE}/api/events/events_categories_get.php`),
      ]);

      if (!eventsRes.ok || !categoriesRes.ok) throw new Error('API 請求失敗');

      const eventsData = await eventsRes.json();
      const categoriesData = await categoriesRes.json();

      if (eventsData.status === 'success') {
        tableData.value = eventsData.data;
      }
      if (categoriesData.status === 'success') {
        categoryOptions.value = categoriesData.data.map(cat => ({
          label: cat.category_name,
          value: cat.category_no,
        }));
      }
    } catch (error) {
      console.error("獲取活動資料時發生錯誤:", error);
      alert("無法載入活動資料，請稍後再試。");
    } finally {
      isLoading.value = false;
    }
  });

  // 既有的 computed 和分頁邏輯
  const filteredTableData = computed(() => {
    return tableData.value.filter((item) => {
      const statusMatch = statusFilter.value === '' || item.status === statusFilter.value;
      const categoryMatch = categoryFilter.value === '' || item.category_no === categoryFilter.value;
      return statusMatch && categoryMatch;
    }).map(item => ({
      ...item,
      // API 直接回傳 category_name，所以直接用，不再需要手動 find
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
              <el-select v-model="row.status" style="width: 140px">
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </template>
          </el-table-column>
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
