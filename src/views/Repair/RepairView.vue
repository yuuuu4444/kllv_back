<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, computed, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import 'element-plus/dist/index.css';
  import Pagination from '@/components/Pagination.vue';
  import BaseDialog from '@/components/BaseDialog.vue';

  const { VITE_API_BASE } = import.meta.env;
  const buttonColor = ref('#004b80');
  const textColor = ref('#fff');
  const showDialog = ref(false);
  const showReplyDialog = ref(false); // 新增：回復狀態 Dialog
  const targetRow = ref(null); // 被操作的那一列
  const replyNote = ref(''); // 已處理回覆內容
  const isSavingReply = ref(false);
  const selectedRepair = ref(null); // 被選的
  const loadingCats = ref(false);
  const categories = ref([]);
  const filterCategory = ref('');
  const filterStatus = ref('');
  // const replyFormRef = ref(null);

  onMounted(async () => {
    loadingCats.value = true;
    try {
      const res = await fetch(`${VITE_API_BASE}/api/repair/categories_get.php`);
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
        return '待處理';
      case STATUS.DONE:
        return '已處理';
      case STATUS.REJECTED:
        return '不受理';
      default:
        return '待處理';
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

  // 面板用的狀態選項
  const statusOptions = [
    { label: toStatusText(STATUS.PENDING), value: STATUS.PENDING },
    { label: toStatusText(STATUS.DONE), value: STATUS.DONE },
    { label: toStatusText(STATUS.REJECTED), value: STATUS.REJECTED },
  ];

  const reports = ref([]);

  onMounted(async () => {
    const res = await fetch(`${VITE_API_BASE}/api/repair/repair_get.php`);
    const raw = await res.json();

    const data = raw.data || [];

    reports.value = data.map((r) => {
      const process_status = sanitizeStatus(r.status);
      return {
        ...r,
        category_no: r.category_no,
        category: r.category_name, // 顯示用
        process_status,
        repair_no: r.repair_no,
        repair_code: r.repair_code,
        description: r.description,
        reporter_id: r.reporter_id,
        reporter_name: r.reporter_name,
        reporter_phone: r.reporter_phone,
      };
    });
    console.log('[reports sample]', reports.value.slice(0, 3));
    console.log('[categories raw]', categories.value);
  });

  const filteredReports = computed(() => {
    return reports.value.filter((r) => {
      // 分類篩選
      const matchCategory = !filterCategory.value || r.category_no == filterCategory.value;
      // 狀態篩選
      const matchStatus =
        filterStatus.value == null ? true : r.process_status == filterStatus.value;

      return matchCategory && matchStatus;
    });
  });

  const currentPage = ref(1);
  const pageSize = 12;

  const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredReports.value.slice(start, start + pageSize);
  });

  // 先記住當前列的狀態（在 select 聚焦時）
  function rememberPrevStatus(row) {
    row._prevStatus = row.process_status;
  }

  async function saveStatus(row, newStatus) {
    try {
      const res = await fetch(`${VITE_API_BASE}/api/repair/reply_save.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          repair_no: Number(row.repair_no),
          status: Number(newStatus), // 這裡一定要帶 3
        }),
      });
      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      // 成功 → 同步 UI
      row.process_status = newStatus;
      row.status_text = toStatusText(newStatus);
      ElMessage.success('狀態已更新');
    } catch (err) {
      // 失敗 → 還原 UI
      row.process_status = row._prevStatus;
      row.status_text = toStatusText(row._prevStatus);
      ElMessage.error(err.message || '更新失敗');
    }
  }

  function onStatusChange(row, val) {
    if (row._prevStatus === undefined) {
      row._prevStatus = row.process_status;
    }
    row.process_status = sanitizeStatus(val);
    row.status_text = toStatusText(row.process_status);
    if (row.process_status === STATUS.DONE) {
      targetRow.value = row;
      // 初始化回覆表單
      replyNote.value = '';
      isSavingReply.value = false;
      showReplyDialog.value = true;
    } else if (row.process_status === STATUS.REJECTED) {
      return saveStatus(row, STATUS.REJECTED);
    }
  }

  function onReplyDialogClose() {
    if (!isSavingReply.value && targetRow.value) {
      targetRow.value.process_status = STATUS.PENDING;
      targetRow.value.status_text = toStatusText(targetRow.value.process_status);
    }

    isSavingReply.value = false;
  }

  async function handleSubmit() {
    if (!targetRow.value?.repair_no) {
      ElMessage.error('找不到案件編號');
      return;
    }

    if (!replyNote.value.trim()) {
      ElMessage.error('請輸入回覆內容');
      return;
    }

    console.log('[payload]', {
      repair_no: targetRow.value?.repair_no,
      reply_content: replyNote.value?.trim(),
    });

    try {
      isSavingReply.value = true;

      const res = await fetch(`${VITE_API_BASE}/api/repair/reply_save.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          repair_no: targetRow.value.repair_no,
          reply_content: replyNote.value.trim(),
          status: 2,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      targetRow.value.reply_content = replyNote.value.trim();
      targetRow.value.process_status = 2;
      targetRow.value.status_text = toStatusText(2);
      if (data.data?.resolved_at) {
        targetRow.value.resolved_at = data.data.resolved_at;
      }

      ElMessage.success('已儲存回覆');
      showReplyDialog.value = false;
    } catch (error) {
      console.error(error);
      ElMessage.error('儲存失敗，請稍後再試');
      isSavingReply.value = false;
    }
  }

  const selectedPhotoList = computed(() => {
    const imgs = selectedRepair.value?.images || [];
    return imgs
      .map((it) => (typeof it === 'string' ? it : it.image_path))
      .filter(Boolean)
      .map((p) => {
        if (p.startsWith('http')) return p; // 完整 URL
        return `${VITE_API_BASE}${p}`;
      });
  });

  async function openDetail(row) {
    showDialog.value = true;
    selectedRepair.value = { ...row, _loading: true };

    try {
      const res = await fetch(`${VITE_API_BASE}/api/repair/repair_detail_get.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repair_no: Number(row.repair_no) }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} - ${txt}`);
      }

      const data = await res.json();
      if (data.status !== 'success' || !data.data) {
        throw new Error(data.message || '載入失敗');
      }

      const d = data.data;
      selectedRepair.value = {
        ...row,
        ...d,
        category: d.category_name,
        images: d.images || [],
        _loading: false,
      };
    } catch (error) {
      error.value = error.message || '未知錯誤';
    }
  }
</script>

<template>
  <el-container>
    <el-main>
      <div class="panel">
        <div class="panel-filters">
          <div class="table-filters__select">
            <el-select
              v-model="filterStatus"
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
              v-model="filterCategory"
              placeholder="類型"
              :loading="loadingCats"
              @change="
                (val) => {
                  console.log('[filterCategory]', val, typeof val);
                  currentPage = 1;
                }
              "
              style="width: 240px"
              clearable
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
            prop="repair_code"
            label="案件NO"
            width="100"
          />
          <el-table-column
            prop="reporter_name"
            label="通報人"
          />
          <el-table-column
            prop="reporter_phone"
            label="聯絡電話"
          />
          <el-table-column
            prop="category"
            label="案件類型"
          />
          <el-table-column
            prop="reported_at"
            label="通報日期"
          />
          <el-table-column
            prop="status_text"
            label="狀態"
          >
            <template #default="{ row }">
              <el-select
                v-model="row.process_status"
                placeholder="選擇狀態"
                style="width: 140px"
                @focus="rememberPrevStatus(row)"
                @change="(val) => onStatusChange(row, val)"
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
          <el-table-column
            prop="詳細"
            label="詳細"
            width="200"
          >
            <template #default="{ row }">
              <el-button
                plain
                @click="openDetail(row)"
              >
                查看
              </el-button>
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

      <BaseDialog
        v-model="showDialog"
        title="案件詳細"
        :close-on-click-modal="false"
      >
        <template #body>
          <div v-if="selectedRepair">
            <div class="dialog_text">
              <p>案件No.：</p>
              <p>{{ selectedRepair.repair_code }}</p>
            </div>
            <div class="dialog_text">
              <p>案件類型：</p>
              <p>{{ selectedRepair.category }}</p>
            </div>
            <div class="dialog_text">
              <p>通報日期：</p>
              <p>{{ selectedRepair.reported_at }}</p>
            </div>
            <div class="dialog_text">
              <p>聯絡電話：</p>
              <p>0912123123</p>
            </div>
            <div class="dialog_text">
              <p>通報人：</p>
              <p>王小明</p>
            </div>
            <div class="dialog_text">
              <p>情形描述：</p>
              <p>{{ selectedRepair.description }}</p>
            </div>
            <div class="dialog_text">
              <p>圖片：</p>
              <div
                class="dialog__photos"
                v-if="selectedPhotoList.length"
              >
                <img
                  class="dialog__photo"
                  v-for="(src, i) in selectedPhotoList"
                  :key="src + i"
                  :src="src"
                  alt="維修通報照片"
                />
              </div>
              <p v-else>無上傳照片</p>
            </div>
          </div>
        </template>
      </BaseDialog>

      <BaseDialog
        v-model="showReplyDialog"
        title="維修通報回復"
        @update:modelValue="
          (val) => {
            if (!val) onReplyDialogClose();
          }
        "
      >
        <template #body>
          <el-form :model="{ replyNote }">
            <el-form-item>
              <el-input
                v-model="replyNote"
                type="textarea"
                :rows="4"
                placeholder="請輸入回覆內容"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>

        <template #footer>
          <el-form>
            <el-button
              type="primary"
              :style="{
                backgroundColor: buttonColor,
                color: textColor,
              }"
              @click="handleSubmit"
              class="form__save-btn"
            >
              儲存
            </el-button>
          </el-form>
        </template>
      </BaseDialog>
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

  .dialog_text {
    // width: 600px;
    display: flex;
    margin-bottom: 10px;
    p {
      font-size: 18px;
    }
  }

  .dialog {
    &__photos {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin: 20px auto;
      width: 80%;
      flex-wrap: wrap;
      overflow: hidden;
    }

    &__photo {
      width: 30%;
      object-fit: cover;
      flex: 1 1 1;
    }
  }

  .form__save-btn {
    width: 100%;
    height: 35px;
  }
</style>
