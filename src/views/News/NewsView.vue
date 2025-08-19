<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import Pagination from '@/components/Pagination.vue';

  const { VITE_API_BASE } = import.meta.env;

  // 狀態資料
  const statusOptions = [
    { label: '未發布', value: 0 },
    { label: '已發布', value: 2 },
    { label: '已取消', value: 3 },
  ];

  // 分類資料
  const categoryOptions = ref([]);
  const fetchNewsCategoryData = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE}/news/categories_get.php`);
      const data = await res.json();
      
      categoryOptions.value = data.data.map(item => {
        return {
          value: item.category_no,
          label: item.category_name,
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  // 消息資料
  const tableData = ref([]);
  const fetchNewsData = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE}/news/news_get.php`);
      const data = await res.json();
      
      tableData.value = data.data.map(item => {
        return {
          news_no: item.news_no,
          title: item.title,
          category_no: item.category_no,
          category_label: item.category_name,
          published_at: item.published_at,
          status: item.status,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  // 過濾消息
  const statusFilter = ref(null);
  const categoryFilter = ref(null);
  const filteredTableData = computed(() => {
    return tableData.value.filter((item) => {
      const statusMatch = item.status === statusFilter.value || !statusFilter.value;
      const categoryMatch = item.category_no === categoryFilter.value || !categoryFilter.value;
      return statusMatch && categoryMatch;
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
  const updateNewsPostsStatus = async (news_no, status) => {
    try {
      const res = await fetch(`${VITE_API_BASE}/news/status_post_update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          news_no: news_no,
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

  // onMounted
  onMounted(async() => {
    await fetchNewsData();
    await fetchNewsCategoryData();
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
          <div class="table-filters__select">
            <el-select
              v-model="categoryFilter"
              placeholder="類型"
              style="width: 240px"
              clearable
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <RouterLink to="/news/edit">
          <Button>
            新增消息
            <el-icon><Plus /></el-icon>
          </Button>
        </RouterLink>
      </div>
      <div class="table">
        <el-table
          :data="currentPageData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="news_no"
            label="消息NO"
            width="100"
          />
          <el-table-column
            prop="title"
            label="消息標題"
          />
          <el-table-column
            prop="category_label"
            label="消息類型"
          />
          <el-table-column
            prop="published_at"
            label="消息日期"
          />
          <el-table-column
            prop="status"
            label="狀態"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.status"
                style="width: 140px"
                @change="(status) => updateNewsPostsStatus(row.news_no, status)"
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
            prop="manipulate"
            label="操作"
            width="200"
          >
            <template #default="{ row }">
              <RouterLink :to="`/news/edit/${row.news_no}`">
                <el-button
                  icon="Edit"
                  circle
                />
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
