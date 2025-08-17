<script setup>
  import { RouterLink } from 'vue-router';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/News/news_test.json';
  import Pagination from '@/components/Pagination.vue';

  const statusFilter = ref('');
  const statusOptions = [
    { label: '未發布', value: 0 },
    { label: '已發布', value: 2 },
    { label: '已取消', value: 3 },
  ];

  const categoryFilter = ref('');
  const categoryOptions = [
    { label: '公告', value: 1 },
    { label: '活動', value: 2 },
    { label: '補助', value: 3 },
    { label: '施工', value: 4 },
    { label: '防災', value: 5 },
  ];

  const tableData = ref(
    rawData.map((item, index) => {
      const categoryItem = categoryOptions.find((c) => c.value === item.category_no);
      return {
        news_no: item.news_no,
        title: item.title,
        category_no: item.category_no,
        category_label: categoryItem.label,
        published_at: item.published_at,
        status: item.status,
      };
    }),
  );

  const filteredTableData = computed(() => {
    return tableData.value.filter((item) => {
      const statusMatch = statusFilter.value === '' || item.status === statusFilter.value;
      const categoryMatch =
        categoryFilter.value === '' || item.category_no === categoryFilter.value;
      return statusMatch && categoryMatch;
    });
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
