<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/Events/activities_test.json';
  import Pagination from '@/components/Pagination.vue';

  const tableData = ref(
    rawData.map((item, index) => {
      let categories = '';
      switch (item.category_no) {
        case 1:
          categories = '旅遊';
          break;

        case 2:
          categories = '健康';
          break;

        case 3:
          categories = '藝文';
          break;

        case 4:
          categories = '其他';
          break;

        default:
          categories = '未分類';
          break;
      }
      return {
        活動NO: item.activity_no,
        活動標題: item.title,
        活動類型: categories,
        活動日期: item.start_date,
        狀態: '未發布',
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
            prop="活動NO"
            label="活動NO"
            width="100"
          />
          <el-table-column
            prop="活動標題"
            label="活動標題"
          />
          <el-table-column
            prop="活動類型"
            label="活動類型"
          />
          <el-table-column
            prop="活動日期"
            label="活動日期"
          />
          <el-table-column
            prop="狀態"
            label="狀態"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.狀態"
                placeholder="選擇狀態"
                style="width: 140px"
              >
                <el-option
                  label="未發布"
                  value="未發布"
                />
                <el-option
                  label="已發布"
                  value="已發布"
                />
                <el-option
                  label="已取消"
                  value="已取消"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="操作"
            label="操作"
            width="200"
          >
            <template #default="{ row }">
              <el-button
                icon="Edit"
                circle
                @click="handleEdit(row)"
              />
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
