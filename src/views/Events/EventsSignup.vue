<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed, onMounted } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  // import rawData from '@/assets/data/Events/activities_test.json';
  import Pagination from '@/components/Pagination.vue';
  import { useRouter } from 'vue-router';

  // 引入環境變數&準備ref
  const { VITE_API_BASE } = import.meta.env;
  const tableData = ref([]); // 用於儲存從 API 獲取的「真實」活動列表
  const isLoading = ref(true); // 用於追蹤載-入狀態，提升使用者體驗
  const router = useRouter(); // 初始化 router
  const searchInput = ref(''); // 用於綁定搜尋框的輸入值

  // 在 onMounted 中呼叫 API 
  // 頁面元件被掛載到畫面上時，自動執行一次。
  onMounted(async () => {
    isLoading.value = true;
    try {
      // 呼叫events_get.php API
      const response = await fetch(`${VITE_API_BASE}/api/events/events_get.php`);
      if (!response.ok) {
        throw new Error('API 請求失敗');
      }
      
      const result = await response.json();

      if (result.status === 'success') {
        // 將API回傳的真實資料，存入tableData。
        tableData.value = result.data.map(item => {
          return {
            ...item, // 保留所有從 API 來的原始欄位 (event_no, title, etc.)
            applicants: `${item.p_count || 0} / ${item.p_limit}` // 組合報名名額字串
          };
        });
      } else {
        throw new Error(result.message || '獲取活動資料失敗');
      }
    } catch (error) {
      console.error("獲取活動列表時發生錯誤:", error);
      alert("無法載入活動列表，請稍後再試。");
    } finally {
      isLoading.value = false;
    }
  });

  // 處理跳轉 & 篩選
  // 當使用者點擊「查看」按鈕時，要執行的函式
  const handleViewRegistrations = (row) => {
    // 使用 router.push 進行頁面跳轉
    // 將跳轉到一個新的路由，並把活動的 event_no 當作參數帶過去
    router.push(`/events_signup_content/${row.event_no}`);
  };

  // 搜尋功能
  const filteredTableData = computed(() => {
    if (!searchInput.value) {
      return tableData.value;
    }
    return tableData.value.filter(item => 
      item.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );
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
          <div class="panel-filters__input flex gap-4">
            <el-input
              v-model="searchInput"
              style="width: 240px"
              placeholder="活動名稱"
              clearable
            >
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <div class="table" v-loading="isLoading">
        <el-table
          :data="currentPageData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="event_no"
            label="活動NO"
            width="100"
          />
          <el-table-column
            prop="title"
            label="活動名稱"
          />
          <el-table-column
            prop="start_date"
            label="活動日期"
          />
          <el-table-column
            prop="reg_deadline"
            label="報名截止"
          />
          <el-table-column
            prop="applicants"
            label="報名名額"
          />
          <el-table-column
            prop="application_order"
            label="報名訂單"
          >
            <!-- 將 handleEdit 改為更有意義的 handleViewRegistrations -->
            <template #default="{ row }">
              <el-button @click="handleViewRegistrations(row)">查看</el-button>
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
