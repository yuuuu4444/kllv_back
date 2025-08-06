<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/Community/post_reports_test.json';
  import Pagination from '@/components/Pagination.vue';

  const tableData = ref(
    rawData.map((item, index) => {
      let categories = '';
      switch (item.reason_no) {
        case 1:
          categories = '仇恨言論';
          break;

        case 2:
          categories = '暴力內容';
          break;

        case 3:
          categories = '詐騙、不實資訊';
          break;

        case 4:
          categories = '自我傷害、自殺';
          break;

        case 5:
          categories = '霸凌、騷擾';
          break;

        default:
          categories = '未分類';
          break;
      }
      return {
        report_no: item.report_no,
        post: '測試ABC',
        reason: categories,
        reporter_id: item.reporter_id,
        reported_at: item.reported_at,
        status: '未審理',
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
              placeholder="原因"
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
            label="檢舉NO"
            width="100"
          />
          <el-table-column
            prop="post"
            label="檢舉貼文"
          />
          <el-table-column
            prop="reason"
            label="檢舉原因"
          />
          <el-table-column
            prop="reporter_id"
            label="檢舉者"
          />
          <el-table-column
            prop="reported_at"
            label="檢舉時間"
          />
          <el-table-column
            prop="status"
            label="狀態"
            width="200"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.狀態"
                placeholder="選擇狀態"
                style="width: 140px"
              >
                <el-option
                  label="未審理"
                  value="未審理"
                />
                <el-option
                  label="已審理"
                  value="已審理"
                />
                <el-option
                  label="不受理"
                  value="不受理"
                />
              </el-select>
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
