<script setup>
    import { ref, onMounted, computed } from 'vue';
    import Pagination from '@/components/Pagination.vue';
    import { ElDialog, ElButton, ElTable, ElTableColumn, ElContainer, ElMain, ElIcon, ElInput } from 'element-plus';
    import { Search } from '@element-plus/icons-vue';

    const props = defineProps({
    event_no: { type: [String, Number], required: true }
    });

    const { VITE_API_BASE } = import.meta.env;

    // --- State Management ---
    const orders = ref([]);
    const participants = ref([]);
    const eventTitle = ref('');
    const isLoading = ref(true);
    const activeTab = ref('orders');
    const searchInput = ref('');

    const isDialogVisible = ref(false);
    const dialogData = ref([]);
    const isLoadingDialog = ref(false);

    // --- API Calls ---
    async function fetchOrders() {
    isLoading.value = true;
    try {
        const response = await fetch(`${VITE_API_BASE}/api/events/events_registrations_get.php?event_no=${props.event_no}`);
        if (!response.ok) throw new Error('API 請求失敗');
        const result = await response.json();
        if (result.status === 'success') {
        orders.value = result.data;
        eventTitle.value = result.event_title;
        }
    } catch (error) { console.error("獲取訂單列表失敗:", error); } 
    finally { isLoading.value = false; }
    }

    async function fetchParticipants() {
    isLoading.value = true;
    try {
        const response = await fetch(`${VITE_API_BASE}/api/events/events_participants_get.php?event_no=${props.event_no}`);
        if (!response.ok) throw new Error('API 請求失敗');
        const result = await response.json();
        if (result.status === 'success') {
        participants.value = result.data;
        }
    } catch (error) { console.error("獲取名單列表失敗:", error); } 
    finally { isLoading.value = false; }
    }

    onMounted(() => {
    fetchOrders();
    });

    async function switchTab(tabName) {
    activeTab.value = tabName;
    if (tabName === 'participants' && participants.value.length === 0) {
        await fetchParticipants();
    }
    }

    async function viewOrderDetails(regNo) {
    isDialogVisible.value = true;
    isLoadingDialog.value = true;
    try {
        const response = await fetch(`${VITE_API_BASE}/api/events/events_registration_detail_get.php?reg_no=${regNo}`);
        if (!response.ok) throw new Error('API 請求失敗');
        const result = await response.json();
        if (result.status === 'success') {
        dialogData.value = result.data;
        }
    } catch (error) {
        console.error(`獲取訂單 ${regNo} 詳情失敗:`, error);
        alert(`載入訂單詳情失敗`);
    } finally {
        isLoadingDialog.value = false;
    }
    }

    const statusOptions = [ { label: '已完成', value: 1 }, { label: '未完成', value: 0 }];
    const currentPage = ref(1);
    const pageSize = 12;

    //搜尋不分大小寫
    const filteredParticipants = computed(() => {
        if (!searchInput.value) return participants.value;
        const lowerCaseSearch = searchInput.value.toLowerCase();
        return participants.value.filter(p => 
        p.fullname.toLowerCase().includes(lowerCaseSearch)
        );
    });

    const pagedOrders = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        return orders.value.slice(start, start + pageSize);
    });

    const pagedParticipants = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        return filteredParticipants.value.slice(start, start + pageSize);
    });
</script>

<template>
    <el-container>
        <el-main style="padding: 0;">
        
        <div class="content-wrapper">
            <!-- <h2 class="page-subtitle">{{ eventTitle ? eventTitle + '：' : '' }}：報名管理</h2> -->
            <h2 class="page-subtitle">{{ eventTitle }} 報名管理</h2>
            <!-- <h2 class="page-subtitle">{{ event.title}}：報名管理</h2> -->

            <div class="panel">
            <div class="panel-filters">
                <div class="tab-button-group">
                    <button 
                    :class="['tab-button', { 'is-active': activeTab === 'orders' }]" 
                    @click="switchTab('orders')"
                    >
                    訂單列表
                    </button>
                    <button 
                    :class="['tab-button', { 'is-active': activeTab === 'participants' }]" 
                    @click="switchTab('participants')"
                    >
                    名單列表
                    </button>
                </div>
                
                <el-input v-if="activeTab === 'participants'" v-model="searchInput" style="width: 240px" placeholder="搜尋參與者姓名">
                <template #prefix><el-icon><Search /></el-icon></template>
                </el-input>
            </div>
            <!-- <el-button type="success">匯出名單</el-button> -->
            </div>
        </div>
        
        <div class="table-wrapper" v-loading="isLoading">
            <div v-show="activeTab === 'orders'">
            <el-table :data="pagedOrders" border style="width: 100%">
                <el-table-column prop="reg_no" label="訂單No." />
                <el-table-column prop="fullname" label="報名人" />
                <el-table-column prop="p_total" label="報名人數" />
                <el-table-column prop="fee_total" label="報名費用" />
                <el-table-column prop="registered_at" label="報名時間" />
                <el-table-column prop="payment_name" label="付款方式" />
                <el-table-column label="狀態">
                <template #default="{ row }">
                    <el-select v-model="row.status"><el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value"/></el-select>
                </template>
                </el-table-column>
                <el-table-column label="名單">
                <template #default="{ row }">
                    <el-button @click="viewOrderDetails(row.reg_no)">查看</el-button>
                </template>
                </el-table-column>
            </el-table>
            </div>

            <div v-show="activeTab === 'participants'">
            <el-table :data="pagedParticipants" border style="width: 100%">
                <el-table-column prop="plist_no" label="報名No." />
                <el-table-column prop="fullname" label="報名人" />
                <el-table-column prop="phone_number" label="電話" />
                <el-table-column prop="id_number" label="身份證字號" />
                <el-table-column prop="birth_date" label="出生日期" />
                <el-table-column prop="econtact_name" label="緊急聯絡人" />
                <el-table-column prop="econtact_phone" label="緊急聯絡人電話" />
            </el-table>
            </div>
        </div>

        <div class="content-wrapper">
            <div class="pagination">
            <Pagination :total="activeTab === 'orders' ? orders.length : filteredParticipants.length" :page-size="pageSize" v-model:currentPage="currentPage" />
            </div>
        </div>

        <el-dialog v-model="isDialogVisible" title="訂單參與者名單" width="70%">
            <div v-loading="isLoadingDialog">
            <el-table :data="dialogData" border style="width: 100%">
                <el-table-column prop="fullname" label="報名人" />
                <el-table-column prop="phone_number" label="電話" />
                <el-table-column prop="id_number" label="身份證字號" />
                <el-table-column prop="birth_date" label="出生日期" />
                <el-table-column prop="econtact_name" label="緊急聯絡人" />
                <el-table-column prop="econtact_phone" label="緊急聯絡人電話" />
            </el-table>
            </div>
        </el-dialog>

        </el-main>
    </el-container>
</template>

<style scoped lang="scss">
    .content-wrapper {
        padding: 0 50px;
    }
    .page-subtitle {
        font-size: 24px;
        font-weight: bold;
        margin: 30px 0 20px 0;
        text-align: left;
    }
    .panel {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    .panel-filters { display: flex; align-items: center; gap: 20px; }

    .table-wrapper {
        width: 100%;
    }

    .tab-button-group {
        display: inline-flex;
    }
    .tab-button {
        padding: 8px 16px;
        border: 1px solid #409eff;
        background-color: #ffffff;
        color: #409eff;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
        &:not(:last-child) {
            margin-right: -1px; 
        }
    }
    .tab-button:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    .tab-button:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .tab-button:hover {
        background-color: #ecf5ff;
    }
    .tab-button.is-active {
        background-color: #409eff;
        color: #ffffff;
        border-color: #409eff;
        position: relative;
        z-index: 1;
    }

    ::v-deep(.el-table__header th) {
        background-color: rgba(0, 75, 128, 0.5);
        color: #fff;
        text-align: center;
    }
    ::v-deep(.el-table__body td) { text-align: center; }

    .pagination {
        display: flex;
        justify-content: flex-end;
        margin: 40px 0;
    }
</style>