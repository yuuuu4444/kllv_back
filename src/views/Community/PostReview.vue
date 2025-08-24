<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import 'element-plus/dist/index.css';
  import Pagination from '@/components/Pagination.vue';

  const { VITE_API_BASE } = import.meta.env;
  const loading = ref(false);
  const error = ref('');

  const loadingCats = ref(false);
  const categories = ref([]);
  const tableData = ref([]);

  onMounted(async () => {
    loadingCats.value = true;
    try {
      const res = await fetch(`${VITE_API_BASE}/api/community/report_categories_get.php`);
      const data = await res.json();

      // console.log(data.status);
      if (data.status === 'success') categories.value = data.data;
    } catch (e) {
      console.error(e);
    } finally {
      loadingCats.value = false;
    }
  });

  const STATUS = { PENDING: 0, DONE: 2, REJECTED: 3 };
  const toStatusText = (code) => {
    const n = Number(code);
    switch (n) {
      case STATUS.PENDING:
        return '未審理';
      case STATUS.DONE:
        return '已審理';
      case STATUS.REJECTED:
        return '不受理';
      default:
        return '未審理';
    }
  };

  const sanitizeStatus = (code) => {
    const n = Number(code);
    switch (n) {
      case STATUS.PENDING:
      case STATUS.DONE:
      case STATUS.REJECTED:
        return n;
      default:
        return STATUS.PENDING;
    }
  };

  const statusOptions = [
    { label: toStatusText(STATUS.PENDING), value: STATUS.PENDING },
    { label: toStatusText(STATUS.DONE), value: STATUS.DONE },
    { label: toStatusText(STATUS.REJECTED), value: STATUS.REJECTED },
  ];

  onMounted(async () => {
    const res = await fetch(`${VITE_API_BASE}/api/community/post_report_get.php`);
    const raw = await res.json();

    const data = raw.data || [];

    tableData.value = data.map((r) => {
      const process_status = sanitizeStatus(r.status);
      return {
        ...r,
        category_no: Number(r.category_no),
        reason: r.category_name, // 顯示用
        process_status,
        report_no: r.report_no,
        reported_title: r.title,
        reporter_id: r.reporter_id,
        reported_at: r.reported_at,
      };
    });
    console.log('[reports sample]', tableData.value.slice(0, 3));
    console.log('[categories raw]', categories.value);
  });

  const selectedStatus = ref(''); // 狀態下拉
  const selectedReason = ref(''); // 原因下拉

  const filteredReports = computed(() => {
    return tableData.value.filter((r) => {
      // 分類篩選
      const matchReason = !selectedReason.value || r.category_no == selectedReason.value;
      // 狀態篩選
      const matchStatus =
        selectedStatus.value == null ? true : r.process_status == selectedStatus.value;

      return matchReason && matchStatus;
    });
  });

  async function saveStatus(row, newStatus) {
    const next = Number(newStatus);
    const prev = Number(row.process_status);
    row._prevStatus = prev;

    row.process_status = next;
    row._saving = true;

    try {
      const res = await fetch(`${VITE_API_BASE}/api/community/post_report_status_save.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          report_no: Number(row.report_no), // ← 這裡要用 report_no
          status: next, // 0 / 2 / 3
        }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      ElMessage.success('狀態已更新');
    } catch (error) {
      row.process_status = row._prevStatus;
      console.error(error);
      ElMessage.error(error.message || '狀態更新失敗');
    } finally {
      row._saving = false;
    }
  }

  function rememberPrevStatus(row) {
    row._prevStatus = row.process_status;
  }

  const currentPage = ref(1);
  const pageSize = 12;

  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredReports.value.slice(start, start + pageSize);
  });
</script>

<template>
  <el-container>
    <el-main>
      <div class="panel">
        <div class="panel-filters">
          <div class="table-filters__select">
            <el-select
              v-model="selectedStatus"
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
              v-model="selectedReason"
              placeholder="原因"
              style="width: 240px"
              clearable
              :loading="loadingCats"
            >
              <el-option
                v-for="item in categories"
                :key="item.category_no"
                :label="item.category_name"
                :value="Number(item.category_no)"
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
            prop="reported_title"
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
            prop="process_status"
            label="狀態"
            width="200"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.process_status"
                placeholder="選擇狀態"
                style="width: 140px"
                @focus="rememberPrevStatus(row)"
                @change="(val) => saveStatus(row, val)"
              >
                <el-option
                  :label="toStatusText(STATUS.PENDING)"
                  :value="STATUS.PENDING"
                />
                <el-option
                  :label="toStatusText(STATUS.DONE)"
                  :value="STATUS.DONE"
                />
                <el-option
                  :label="toStatusText(STATUS.REJECTED)"
                  :value="STATUS.REJECTED"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <Pagination
          :total="filteredReports.length"
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
