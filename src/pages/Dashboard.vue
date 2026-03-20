<template>
  <CContainer fluid class="invoice-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header mb-4">
      <CRow class="align-items-center">
        <CCol>
          <div class="d-flex align-items-center">
            <CIcon icon="cil-list-rich" class="dashboard-icon me-3" />
            <div>
              <h4 class="dashboard-title mb-1">Invoice Dashboard</h4>
            </div>
          </div>
        </CCol>
        <CCol xs="auto">
          <CBadge color="primary" class="fs-6" v-show="hasPermission('view')">
            Total: {{ filteredData.length }} invoices
          </CBadge>
        </CCol>
      </CRow>
    </div>

    <!-- Stats Cards -->
  <!-- Stats Cards -->
<CRow class="mb-4" v-show="hasPermission('view')">
  <CCol :md="3" :sm="6" class="mb-3">
    <CCard class="stats-card h-100">
      <CCardBody class="d-flex align-items-center">
        <div class="stats-icon-wrapper bg-primary-subtle me-3">
          <CIcon :icon="cilMoney" class="text-primary" />
        </div>
        <div class="w-100">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <div class="stats-value fw-bold">
              {{ getTotalAmount() }}
            </div>
            <CDropdown variant="btn-group" direction="bottom-end">
              <CDropdownToggle color="transparent" size="sm" class="p-0 border-0">
                <CIcon icon="cil-options" class="text-muted" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem 
                  @click="selectedCurrency = 'USD'" 
                  :class="{ 'active': selectedCurrency === 'USD' }"
                >
                  USD
                </CDropdownItem>
                <CDropdownItem 
                  @click="selectedCurrency = 'INR'" 
                  :class="{ 'active': selectedCurrency === 'INR' }"
                >
                  INR
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
          <div class="stats-label text-medium-emphasis">
            Total Amount 
            <CBadge color="primary" class="ms-1 fs-xxs">
              {{ selectedCurrency }}
            </CBadge>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </CCol>
  <CCol :md="3" :sm="6" class="mb-3">
    <CCard class="stats-card h-100">
      <CCardBody class="d-flex align-items-center">
        <div class="stats-icon-wrapper bg-success-subtle me-3">
          <CIcon icon="cil-check" class="text-success" />
        </div>
        <div>
          <div class="stats-value fw-bold">
            {{ getCompletedCount() }}
          </div>
          <div class="stats-label text-medium-emphasis">Completed</div>
        </div>
      </CCardBody>
    </CCard>
  </CCol>
  <CCol :md="3" :sm="6" class="mb-3">
    <CCard class="stats-card h-100">
      <CCardBody class="d-flex align-items-center">
        <div class="stats-icon-wrapper bg-warning-subtle me-3">
          <CIcon :icon="cilClock" class="text-warning" />
        </div>
        <div>
          <div class="stats-value fw-bold">
            {{ getPendingCount() }}
          </div>
          <div class="stats-label text-medium-emphasis">Pending</div>
        </div>
      </CCardBody>
    </CCard>
  </CCol>
  <CCol :md="3" :sm="6" class="mb-3">
    <CCard class="stats-card h-100">
      <CCardBody class="d-flex align-items-center">
        <div class="stats-icon-wrapper bg-danger-subtle me-3">
          <CIcon :icon="cilX" class="text-info" />
        </div>
        <div>
          <div class="stats-value fw-bold">
            {{ getCancelledCount() }}
          </div>
          <div class="stats-label text-medium-emphasis">Cancelled</div>
        </div>
      </CCardBody>
    </CCard>
  </CCol> 
</CRow>

    <!-- Toolbar Section -->
    <CCard class="mb-4 toolbar-card">
      <CCardBody>
        <CRow class="align-items-center g-3"
          v-show="hasPermission('view') || hasPermission('insert') || hasPermission('edit') || hasPermission('delete')">
          
          <!-- Search Bar -->
          <CCol :xl="4" :lg="5" :md="6" v-show="hasPermission('view')">
            <CInputGroup class="search-group">
              <CFormInput
                v-model="searchQuery"
                placeholder="Search invoices by client, project, or status..."
                class="search-input"
              />
              <CInputGroupText class="search-append">
                <CIcon :icon="cilSearch" />
              </CInputGroupText>
            </CInputGroup>
          </CCol>

          <!-- Date Range Filter -->
          <CCol :xl="4" :lg="4" :md="6" v-show="hasPermission('view')">
            <CInputGroup class="date-group">
              <CInputGroupText class="date-label">
                <CIcon icon="cil-calendar" class="me-1" />
                Date Range
              </CInputGroupText>
              <CFormInput 
                type="date" 
                v-model="startDate"
                @click="openDatePicker"
                @focus="openDatePicker"
                class="date-input"
                placeholder="Start date"
              />
              <CFormInput 
                type="date" 
                v-model="endDate"   
                @click="openDatePicker"
                @focus="openDatePicker"
                class="date-input"
                placeholder="End date"
              />
            </CInputGroup>
          </CCol>

          <!-- Action Buttons -->
          <CCol :xl="4" :lg="3" :md="12" class="text-lg-end">
            <CButtonGroup class="action-buttons">
              <CButton
                color="primary"
                variant="outline"
                @click="exportToExcel"
                v-show="hasPermission('view')"
                class="action-btn"
              >
                <CIcon icon="cilCloudDownload" class="me-2" />
                Export
              </CButton>
              <CButton
                color="success"
                variant="outline"
                @click="triggerFileInput"
                v-show="hasPermission('insert')"
                class="action-btn"
              >
                <CIcon :icon="cilCloudUpload" class="me-2" />
                Import
              </CButton>
              <CButton
                color="success"
                @click="goToAddRecord"
                v-show="hasPermission('insert')"
                class="action-btn add-btn"
              >
                <CIcon :icon="cilPlus" class="me-2" />
                Add Invoice
              </CButton>
            </CButtonGroup>
            <input
              type="file"
              ref="fileInput"
              accept=".xls,.xlsx"
              @change="handleFileUpload"
              style="display: none"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Error Alert -->
    <CAlert color="danger" v-if="error" class="mb-4" dismissible @dismiss="error = null">
      <CIcon icon="cil-warning" class="me-2" />
      {{ error }}
    </CAlert>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <CSpinner color="primary" size="lg" />
      <p class="mt-3 text-medium-emphasis">Loading invoices...</p>
    </div>

   <!-- Data Table -->
<CCard v-else-if="hasPermission('view')" class="data-card">
  <CCardHeader class="table-header">
    <CRow class="align-items-center">
      <CCol>
        <h6 class="mb-0">Invoice Records</h6>
      </CCol>
      <CCol xs="auto">
        <CBadge :color="filteredData.length === 0 ? 'secondary' : 'primary'">
          Showing {{ paginatedData.length }} of {{ filteredData.length }}
        </CBadge>
      </CCol>
    </CRow>
  </CCardHeader>
  <CCardBody class="p-0">
    <div class="table-responsive">
      <CTable hover striped class="mb-0">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell
              v-for="field in fields"
              :key="field"
              @click="sortBy(field)"
              :class="{ 
                'sortable-header': true, 
                'sorted': sortField === field,
                'action-header': field === 'Action'
              }"
            >
              <div class="d-flex align-items-center">
                <span class="header-text">{{ field }}</span>
                <CIcon
                  v-if="sortField === field"
                  :icon="sortDirection === 'asc' ? 'cil-arrow-top' : 'cil-arrow-bottom'"
                  class="ms-1 sort-icon"
                />
                <CIcon v-else icon="cil-options" class="ms-1 sort-icon unsorted" />
              </div>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow
            v-for="(row, index) in paginatedData"
            :key="row['Project ID']"
            class="table-row"
          >
            <CTableDataCell
              v-for="field in fields"
              :key="field"
              :class="getCellClass(field, row)"
            >
              <!-- Regular columns -->
              <template v-if="field !== 'Action'">
                <!-- Link field -->
                <template v-if="field === 'Link' && row[field]">
                  <a
                    :href="row[field].startsWith('http') ? row[field] : 'https://' + row[field]"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="invoice-link"
                  >
                    <CIcon icon="cil-external-link" class="me-1" />
                    View Link
                  </a>
                </template>

                <!-- Amount fields with currency -->
                <template v-else-if="field === 'Amount'">
                  <div class="amount-display">
                    <CBadge :color="row['Currency Status'] === 0 ? 'success' : 'info'" class="currency-badge">
                      {{ row['Currency Status'] === 0 ? 'USD' : 'INR' }}
                    </CBadge>
                    <span class="amount-value">{{ formatAmount(row['Amount']) }}</span>
                  </div>
                </template>

                <template v-else-if="field === 'Release Amount'">
                  <div class="amount-display">
                    <CBadge :color="row['Release Currency Status'] === 0 ? 'success' : 'info'" class="currency-badge">
                      {{ row['Release Currency Status'] === 0 ? 'USD' : 'INR' }}
                    </CBadge>
                    <span class="amount-value">{{ formatAmount(row['Release Amount']) }}</span>
                  </div>
                </template>

                <!-- Status badges -->
                <template v-else-if="field === 'Sent Status'">
                  <CBadge :color="getStatusColor(row[field])" class="status-badge">
                    {{ row[field] }}
                  </CBadge>
                </template>

                <template v-else-if="field === 'Release Status'">
                  <CBadge :color="getReleaseStatusColor(row[field])" class="status-badge">
                    {{ row[field] }}
                  </CBadge>
                </template>

                <!-- Date fields -->
                <template v-else-if="field.includes('Date') && row[field]">
                  <div class="date-display">
                    {{ formatDate(row[field]) }}
                  </div>
                </template>

                <!-- All other fields -->
                <template v-else>
                  <span class="field-value">{{ row[field] || '-' }}</span>
                </template>
              </template>

              <!-- Action Buttons -->
              <template v-else>
                <div class="action-buttons-container">
                  <CButtonGroup size="sm">
                    <CButton
                      v-show="hasPermission('edit')"
                      color="primary"
                      variant="outline"
                      size="sm"
                      @click="openEditModal(row)"
                      class="action-icon"
                      title="Edit"
                    >
                      <CIcon icon="cilPencil" />
                    </CButton>
                    <CButton
                      v-show="hasPermission('delete')"
                      color="danger"
                      variant="outline"
                      size="sm"
                      @click="deleteRecord(row)"
                      class="action-icon"
                      title="Delete"
                    >
                      <CIcon :icon="cilTrash" />
                    </CButton>
                    <CButton
                      v-show="hasPermission('insert')"
                      color="secondary"
                      variant="outline"
                      size="sm"
                      @click="copyRecord(row)"
                      class="action-icon"
                      title="Duplicate"
                    >
                      <CIcon :icon="cilCopy" />
                    </CButton>
                  </CButtonGroup>
                </div>
              </template>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </div>

        <!-- Empty State -->
        <div v-if="filteredData.length === 0" class="text-center py-5 empty-state">
          <CIcon icon="cil-inbox" size="3xl" class="text-medium-emphasis mb-3" />
          <h5 class="text-medium-emphasis">No invoices found</h5>
          <p class="text-medium-emphasis mb-3">
            {{
              searchQuery || startDate || endDate
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first invoice'
            }}
          </p>
          <CButton
            v-if="hasPermission('insert') && !searchQuery && !startDate && !endDate"
            color="primary"
            @click="goToAddRecord"
          >
            <CIcon :icon="cilPlus" class="me-2" />
            Add First Invoice
          </CButton>
          <CButton
            v-else
            color="secondary"
            variant="outline"
            @click="clearFilters"
          >
            Clear Filters
          </CButton>
        </div>
      </CCardBody>
    </CCard>

      <!-- Pagination -->
    <CRow v-if="hasPermission('view') && filteredData.length > 0" class="mt-4">
      <CCol>
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <!-- Page Size Selector -->
          <div class="d-flex align-items-center">
            <span class="text-medium-emphasis me-2">Show:</span>
            <CFormSelect
              v-model="pageSize"
              :options="pageSizeOptions"
              class="page-size-selector"
              style="width: auto;"
            />
            <span class="text-medium-emphasis ms-2">entries</span>
          </div>

          <!-- Page Info -->
          <div class="text-medium-emphasis">
            Page {{ currentPage }} of {{ totalPages }} • 
            {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredData.length) }} of {{ filteredData.length }} items
          </div>

          <!-- Pagination Controls -->
          <CPagination align="center">
            <CPaginationItem :disabled="currentPage === 1" @click="currentPage--">
              <CIcon :icon="cilChevronLeft" />
            </CPaginationItem>
            <CPaginationItem
              v-for="page in getPaginationPages()"
              :key="page"
              :active="currentPage === page"
              @click="currentPage = page"
            >
              {{ page }}
            </CPaginationItem>
            <CPaginationItem
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <CIcon :icon="cilChevronRight" />
            </CPaginationItem>
          </CPagination>
        </div>
      </CCol>
    </CRow>

    <!-- Edit Modal -->
    <editExcelData
      v-show="showEditModal"
      :record="selectedRecord"
      :visible="showEditModal"
      @close="showEditModal = false"
      @save="handleSaveEdit"
    />
  </CContainer>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { 
  cilSearch, 
  cilTrash, 
  cilCloudUpload, 
  cilPlus, 
  cilCopy,
  cilChevronLeft,
  cilChevronRight,
  cilClock,
  cilX,
  cilMoney
} from "@coreui/icons";
import { useRouter } from "vue-router";
import editExcelData from "../components/editExcelData.vue";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// API setup
const API_URL = import.meta.env.VITE_API_URL;
const getExcelDataUrl = `${API_URL}getExcelData`;
const importExcelUrl = `${API_URL}invoices/import`;
const token = localStorage.getItem("token");
const router = useRouter();

// State
const data = ref([]);
const searchQuery = ref("");
const startDate = ref("");
const endDate = ref("");
const currentPage = ref(1);
const pageSize = ref(5);
const pageSizeOptions = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
];
const sortField = ref("");
const sortDirection = ref("asc");
const loading = ref(false);
const error = ref(null);
const fileInput = ref(null);

const showEditModal = ref(false);
const selectedRecord = ref(null);
const editInvoiceUrl = `${API_URL}invoices/update`;
const deleteInvoiceUrl = `${API_URL}delete/invoices`;
const currencyUrl = `${API_URL}get-currencies`;

const selectedCurrency = ref('USD');
const currencyRates = ref({ USD: "", INR: "" });

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
};

const permissions = ref([]);

const hasPermission = (perm) => {
  return permissions.value.includes(perm.toLowerCase());
};

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem("permissions") || "[]");
    console.log("Stored permissions:", stored);

    // Just lower-case the strings
    permissions.value = Array.isArray(stored)
      ? stored.map((p) => p.toLowerCase())
      : [];

    console.log("Loaded permissions:", permissions.value);
  } catch (err) {
    console.error("Error parsing permissions:", err);
    permissions.value = [];
  }
});

// Fields
const fields = [
  "Date",
  "Project ID",
  "Client Name",
  "TL",
  "Link",
  "Sent Date",
  "Start Date",
  "End Date",
  "Bank Account Name",
  "Sent Status",
  "Amount",
  "Sent Via",
  "Release Status",
  "Followup Date",
  "Release Amount Date",
  "Release Amount",
  "Action",
];

// Fetch Data
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(getExcelDataUrl, authConfig);
    const raw = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    data.value = raw.map((row) => ({
      "Date": row.created_at,
      id: row.id,
      "Project ID": row.project_id,
      "Client Name": row.client_name,
      TL: row.tl,
      "Link": row.invoice_link,
      "Sent Date": row.invoice_sent_date,
      "Start Date": row.invoice_cycle_start,
      "End Date": row.invoice_cycle_end,
      "Bank Account Name": row.bank_account_name,
      "Sent Status": row.invoice_status,
      "Amount": row.amount_usd,
      "Currency Status": row.currency_status,
      "Sent Via": row.sent_via,
      "Release Status": row.invoice_release_status,
      "Followup Date": row.followup_date,
      "Release Amount Date": row.release_amount_date,
      "Release Amount": row.release_amount_inr,
      "Release Currency Status": row.release_currency_status,
    }));
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = "Unauthorized access. Please log in to view invoice data.";
      data.value = [];
    } else {
      console.error("Error fetching invoice data:", err);
      error.value = "Failed to load invoice data.";
    }
  } finally {
    loading.value = false;
  }
};

const fetchCurrencyRates = async () => {
  try {
    const response = await axios.get(currencyUrl, authConfig);
    currencyRates.value = {
      USD: response.data.rates?.USD,
      INR: response.data.rates?.INR
    };
  } catch (err) {
    console.error("Error fetching currency rates:", err);
  }
};

onMounted(fetchData(), fetchCurrencyRates());

const getTotalAmount = () => {
  const total = filteredData.value.reduce((sum, row) => {
    let amount = 0;
    const usdToInr = currencyRates.value.INR;
    const inrToUsd = currencyRates.value.USD / usdToInr;
    
    if (selectedCurrency.value === 'USD') {
      // Sum USD amounts (Release Currency Status 0 = USD, 1 = INR)
      if (row['Release Currency Status'] === 0) {
        amount = parseFloat(row['Release Amount']) || 0;
      } else {
        // Convert INR to USD (assuming 1 USD = 83 INR, adjust as needed)
        amount = (parseFloat(row['Release Amount']) || 0) * inrToUsd;
      }
    } else {
      // Sum INR amounts
      if (row['Release Currency Status'] === 1) {
        amount = parseFloat(row['Release Amount']) || 0;
      } else {
        // Convert USD to INR (assuming 1 USD = 83 INR, adjust as needed)
        amount = (parseFloat(row['Release Amount']) || 0) * usdToInr;
      }
    }
    return sum + amount;
  }, 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: selectedCurrency.value,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(total);
};

const getCompletedCount = () => {
  return filteredData.value.filter(row => 
    String(row['Release Status']).toLowerCase() === 'completed'
  ).length;
};

const getPendingCount = () => {
  return filteredData.value.filter(row => 
    String(row['Release Status']).toLowerCase() === 'pending'
  ).length;
};

const getCancelledCount = () => {
  return filteredData.value.filter(row => 
    String(row['Release Status']).toLowerCase() === 'cancelled'
  ).length;
};

const getStatusColor = (status) => {
  const statusStr = String(status).toLowerCase();
  switch (statusStr) {
    case 'completed': return 'success';
    case 'pending': return 'warning';
    default: return 'primary';
  }
};

const getReleaseStatusColor = (status) => {
  const statusStr = String(status).toLowerCase();
  switch (statusStr) {
    case 'completed': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'primary';
  }
};

const formatAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '-';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const getCellClass = (field, row) => {
  const classes = [];
  if (field === 'Amount' || field === 'Release Amount') {
    classes.push('amount-cell');
  }
  if (field.includes('Date')) {
    classes.push('date-cell');
  }
  if (field === 'Action') {
    classes.push('action-cell');
  }
  
  // Add white-space nowrap to all cells for inline alignment
  classes.push('text-nowrap');
  
  return classes.join(' ');
};

const getPaginationPages = () => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  const maxVisible = 5;
  
  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + maxVisible - 1);
    
    for (let i = start; i <= end; i++) pages.push(i);
  }
  return pages;
};

const clearFilters = () => {
  searchQuery.value = '';
  startDate.value = '';
  endDate.value = '';
  currentPage.value = 1;
};

// Filtered data
const filteredData = computed(() => {
  let result = data.value;

  if (searchQuery.value) {
    result = result.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );
  }
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    result = result.filter((row) => {
      const cycleStart = new Date(row["Start Date"]);
      const cycleEnd = new Date(row["End Date"]);

      return (
        (cycleStart >= start && cycleStart <= end) ||
        (cycleEnd >= start && cycleEnd <= end) ||
        (cycleStart <= start && cycleEnd >= end)
      );
    });
  }

  return result;
});

// Sorted data
const sortedData = computed(() => {
  if (!sortField.value) return filteredData.value;
  return [...filteredData.value].sort((a, b) => {
    const valA = a[sortField.value];
    const valB = b[sortField.value];
    if (valA < valB) return sortDirection.value === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
});

// Paginated data
const totalPages = computed(() =>
  Math.ceil(sortedData.value.length / pageSize.value)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedData.value.slice(start, start + pageSize.value);
});

watch(pageSize, () => {
  currentPage.value = 1;
});

watch([searchQuery, startDate, endDate], () => {
  currentPage.value = 1;
});

// Sorting
function sortBy(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
}

// Import Excel
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(importExcelUrl, formData, {
      ...authConfig,
      headers: {
        ...authConfig.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    alert("File imported successfully!");
    fetchData();
  } catch (error) {
    console.error("Import failed:", error);
    alert("Failed to import file. Check console for details.");
  }
};

function goToAddRecord() {
  router.push("/addExcelData");
}

function openEditModal(row) {
  selectedRecord.value = { ...row };
  showEditModal.value = true;
}

const handleSaveEdit = async (updatedRecord) => {
  loading.value = true;
  error.value = null;

  try {
    if (!updatedRecord.id) {
      throw new Error("Missing record ID — cannot update.");
    }

    const payload = {
      project_id: updatedRecord["Project ID"],
      client_name: updatedRecord["Client Name"],
      tl: updatedRecord["TL"],
      invoice_link: updatedRecord["Link"],
      invoice_sent_date: updatedRecord["Sent Date"],
      invoice_cycle_start: updatedRecord["Start Date"],
      invoice_cycle_end: updatedRecord["End Date"],
      bank_account_name: updatedRecord["Bank Account Name"],
      invoice_status: updatedRecord["Sent Status"],
      amount_usd: updatedRecord["Amount"],
      currency_status: updatedRecord["Currency Status"],
      sent_via: updatedRecord["Sent Via"],
      invoice_release_status: updatedRecord["Release Status"],
      followup_date: updatedRecord["Followup Date"],
      release_amount_date: updatedRecord["Release Amount Date"],
      release_amount_inr: updatedRecord["Release Amount"],
      release_currency_status: updatedRecord["Release Currency Status"],
    };

    const response = await axios.put(
      `${editInvoiceUrl}/${updatedRecord.id}`,
      payload,
      authConfig
    );

    if (response.status === 200) {
      showEditModal.value = false;
      await fetchData();
    } else {
      error.value = "Failed to update record.";
      console.error("Update failed:", response);
    }
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = "Unauthorized — please log in again.";
    } else {
      console.error("Error updating record:", err);
      error.value = "Failed to update invoice record.";
    }
  } finally {
    loading.value = false;
  }
};

const deleteRecord = async (row) => {
  if (!row?.id) {
    alert("Invalid record — missing ID.");
    return;
  }

  const confirmDelete = confirm(
    `Are you sure you want to delete the record for "${row["Client Name"]}"?`
  );

  if (!confirmDelete) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await axios.delete(
      `${deleteInvoiceUrl}/${row.id}`,
      authConfig
    );

    if (response.status === 200 || response.status === 204) {
      alert("Record deleted successfully!");
      await fetchData();
    } else {
      error.value = "Failed to delete record.";
      console.error("Unexpected response:", response);
    }
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = "Unauthorized — please log in again.";
    } else if (err.response?.status === 404) {
      error.value = "Record not found or already deleted.";
    } else {
      console.error("Error deleting record:", err);
      error.value = "An error occurred while deleting the record.";
    }
  } finally {
    loading.value = false;
  }
};

function openDatePicker(event) {
  try {
    event.target.showPicker?.();
  } catch (e) {
    console.warn("Picker open blocked by browser", e);
  }
}

function copyRecord(row) {
  const copiedData = { ...row };
  delete copiedData.id;

  router.push({
    name: "Dashboard/ AddExcelData",
    state: { copiedData },
  });
}

const exportToExcel = () => {
  try {
    const exportData = filteredData.value.length
      ? filteredData.value
      : data.value;

    if (!exportData.length) {
      alert("No data available to export!");
      return;
    }

    const dbFormattedData = exportData.map(row => ({
      id: row.id,
      project_id: row["Project ID"],
      client_name: row["Client Name"],
      tl: row["TL"],
      invoice_link: row["Link"],
      invoice_sent_date: row["Sent Date"],
      invoice_cycle_start: row["Start Date"],
      invoice_cycle_end: row["End Date"],
      bank_account_name: row["Bank Account Name"],
      invoice_status: row["Sent Status"],
      amount_usd: row["Amount"],
      sent_via: row["Sent Via"],
      invoice_release_status: row["Release Status"],
      followup_date: row["Followup Date"],
      release_amount_date: row["Release Amount Date"],
      release_amount_inr: row["Release Amount"],
    }));

    const worksheet = XLSX.utils.json_to_sheet(dbFormattedData);

    const columnWidths = Object.keys(dbFormattedData[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...dbFormattedData.map((row) => String(row[key] || "").length)
      ),
    }));
    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const date = new Date().toISOString().split("T")[0];
    saveAs(blob, `Invoice_Report_${date}.xlsx`);

    console.log("Excel export successful (DB headers used)");
  } catch (err) {
    console.error("Error exporting Excel:", err);
    alert("Failed to export Excel file.");
  }
};

// Pagination reset
watch([searchQuery, startDate, endDate], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.invoice-dashboard {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 1rem;
}

.dashboard-header {
  padding: 1.5rem 0 0.5rem 0;
}

.dashboard-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--cui-primary);
}

.dashboard-title {
  color: var(--cui-dark);
  font-weight: 700;
  margin: 0;
}

.dashboard-subtitle {
  font-size: 0.9rem;
  margin: 0;
}

/* Stats Cards */
.stats-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stats-card:hover {
  /* transform: translateY(-2px); */
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.12);
}

.stats-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-value {
  font-size: 1.5rem;
  color: var(--cui-dark);
}

.stats-label {
  font-size: 0.875rem;
}

/* Toolbar */
.toolbar-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.08);
}

.search-group .search-input {
  border-right: none;
}

.search-group .search-append {
  background: white;
  border-left: none;
}

.date-group .date-label {
  background: white;
  border-right: none;
  font-weight: 500;
}

.date-group .date-input {
  border-left: none;
  border-right: none;
}

.date-group .date-input:last-child {
  border-right: var(--cui-border-width) solid var(--cui-border-color);
}

.action-buttons {
  gap: 0.5rem;
}

.action-btn {
  border-radius: 0.5rem;
  font-weight: 500;
}

.add-btn {
  box-shadow: 0 2px 4px rgba(60, 153, 110, 0.3);
}

/* Table Styles */
.data-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  background: linear-gradient(135deg, var(--cui-primary), #4a6cf7);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
}

.sortable-header {
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0.75rem 1rem;
  white-space: nowrap;
}

.sortable-header:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sorted {
  background-color: rgba(255, 255, 255, 0.15);
}

.action-header {
  text-align: right;
}

.header-text {
  font-weight: 600;
  font-size: 0.875rem;
}

.sort-icon {
  width: 1rem;
  height: 1rem;
  opacity: 0.7;
}

.unsorted {
  opacity: 0.3;
}

.table-row:hover {
  background-color: rgba(13, 110, 253, 0.02);
}

/* Cell Styles - Ensure proper alignment */
.amount-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.currency-badge {
  font-size: 0.7rem;
  min-width: 2.5rem;
}

.amount-value {
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
}

.date-display {
  font-size: 0.875rem;
  color: var(--cui-secondary-color);
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

.invoice-link {
  color: var(--cui-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.invoice-link:hover {
  color: var(--cui-primary-dark);
  text-decoration: underline;
}

.field-value {
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Action column styling */
.action-cell {
  text-align: right;
  white-space: nowrap;
}

.action-buttons-container {
  display: flex;
  justify-content: flex-end;
}

.action-icon {
  border: none;
  padding: 0.375rem;
  border-radius: 0.375rem;
  white-space: nowrap;
}

/* Ensure table cells have consistent alignment */
.table-responsive table {
  table-layout: fixed;
  width: 100%;
}

.table-responsive th,
.table-responsive td {
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Make sure action column stays on right */
.table-responsive th:last-child,
.table-responsive td:last-child {
  text-align: right;
  position: sticky;
  right: 0;
  z-index: 2;
  background: inherit;
}

/* Force solid backgrounds for action column */
.table-responsive th:last-child {
  background: linear-gradient( #fff) !important;
}

.table-responsive td:last-child {
  background: linear-gradient( #fff) !important;
}

/* For striped table rows */
.table-striped tbody tr:nth-of-type(odd) td:last-child {
  background: linear-gradient( #fff) !important;
}

.table-striped tbody tr:nth-of-type(even) td:last-child {
   background: linear-gradient( #fff) !important;
}

/* Hover states */
.table-row:hover td:last-child {
  background: rgba(13, 110, 253, 0.02) !important;
}

/* Empty State */
.empty-state {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 0 0 0.75rem 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .invoice-dashboard {
    padding: 0.5rem;
  }
  
  .dashboard-header {
    padding: 1rem 0 0.5rem 0;
  }
  
  .stats-value {
    font-size: 1.25rem;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .action-btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .table-responsive {
    font-size: 0.8rem;
  }
  
  .header-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .dashboard-title {
    font-size: 1.25rem;
  }
  
  .stats-card .card-body {
    padding: 1rem;
  }
  
  .stats-icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
  }
}
.stats-card .dropdown-toggle::after {
  display: none;
}

.stats-card .dropdown-toggle {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.stats-card .dropdown-toggle:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}

.stats-card .dropdown-menu {
  min-width: 80px;
}

.stats-card .dropdown-item.active {
  background-color: var(--cui-primary);
  color: white;
}

/* Small badge for currency indicator */
.fs-xxs {
  font-size: 0.65rem;
}
/* Page Size Selector Styles */
.page-size-selector {
  width: 80px;
  display: inline-block;
}

/* Responsive pagination */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .page-size-selector {
    width: 70px;
  }
}

/* Ensure pagination items are properly spaced */
.d-flex.justify-content-between.align-items-center.flex-wrap {
  gap: 1rem;
}
</style>