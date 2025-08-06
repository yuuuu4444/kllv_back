<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/Events/activities_test.json';
  import Pagination from '@/components/Pagination.vue';

  const tableData = ref(
    rawData.map((item, index) => {
      return {
        activity_no: item.activity_no,
        title: item.title,
        start_date: item.start_date,
        registration_end: item.registration_end,
        applicants: `${item.registered_count} / ${item.capacity_limit}`,
      };
    }),
  );

  const currentPage = ref(1);
  const pageSize = 12;

  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return tableData.value.slice(start, start + pageSize);
  });
</script>

<template>
  <el-container>
    <el-main>
      <div class="panel">
        <div class="panel-filters">
          <div class="panel-filters__input flex gap-4">
            <el-input
              v-model="input4"
              style="width: 240px"
              placeholder="活動名稱"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><search /></el-icon>
              </template>
            </el-input>
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
            prop="activity_no"
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
            prop="registration_end"
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
            <template #default="{ row }">
              <el-button @click="handleEdit(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <Pagination
          :total="tableData.length"
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
