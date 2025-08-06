<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/Repair/repair_reports_test.json';
  import Pagination from '@/components/Pagination.vue';

  const tableData = ref(
    rawData.map((item, index) => {
      let categories = '';
      switch (item.category_no) {
        case 1:
          categories = '路燈損壞';
          break;

        case 2:
          categories = '公共設施損壞';
          break;

        case 3:
          categories = '道路坑洞';
          break;

        case 4:
          categories = '其他';
          break;

        default:
          categories = '未分類';
          break;
      }
      return {
        report_no: item.report_no,
        user: item.user_account,
        phone: '0987987987',
        categories: categories,
        time: item.created_at,
        status: '待處理',
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
          <div class="table-filters__select">
            <el-select
              v-model="value"
              placeholder="類型"
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
        </div>
      </div>
      <div class="table">
        <el-table
          :data="currentPageData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="report_no"
            label="案件NO"
            width="100"
          />
          <el-table-column
            prop="user"
            label="通報人"
          />
          <el-table-column
            prop="phone"
            label="聯絡電話"
          />
          <el-table-column
            prop="categories"
            label="案件類型"
          />
          <el-table-column
            prop="time"
            label="通報日期"
          />
          <el-table-column
            prop="status"
            label="狀態"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.狀態"
                placeholder="選擇狀態"
                style="width: 140px"
              >
                <el-option
                  label="待處理"
                  value="待處理"
                />
                <el-option
                  label="已處理"
                  value="已處理"
                />
                <el-option
                  label="不受理"
                  value="不受理"
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
