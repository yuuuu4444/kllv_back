<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed } from 'vue';
  import 'element-plus/dist/index.css';
  import Button from '@/components/Button.vue';
  import rawData from '@/assets/data/Users/households_test.json';
  import Pagination from '@/components/Pagination.vue';

  const tableData = ref(
    rawData.map((item, index) => {
      return {
        household_code: item.household_code,
        address: item.address,
        user: '王小明',
        user_id: item.creator_user_id,
        phone: '0987987987',
        email: 'abc123@gmail.com',
        status: '未認證',
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
            prop="household_code"
            label="戶籍NO"
            width="100"
          />
          <el-table-column
            prop="address"
            label="戶籍地址"
          />
          <el-table-column
            prop="user"
            label="家長"
          />
          <el-table-column
            prop="user_id"
            label="帳號"
          />
          <el-table-column
            prop="phone"
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
                v-model="row.狀態"
                placeholder="選擇狀態"
                style="width: 140px"
              >
                <el-option
                  label="已認證"
                  value="已認證"
                />
                <el-option
                  label="未認證"
                  value="未認證"
                />
                <el-option
                  label="不通過"
                  value="不通過"
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
