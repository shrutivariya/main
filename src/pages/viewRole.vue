<template>
  <CContainer class="mt-4">
    <h4 class="mb-3">View Roles</h4>

    <!-- Search -->
    <CInputGroup class="mb-3">
      <CFormInput v-model="searchQuery" placeholder="Search roles..." />
      <CInputGroupText><CIcon :icon="cilSearch" /></CInputGroupText>
    </CInputGroup>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center py-4">Loading roles...</div>
    <div v-else-if="error" class="text-danger py-2">{{ error }}</div>

    <!-- Table -->
    <CTable hover responsive bordered v-else>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell
            v-for="field in fields"
            :key="field"
            @click="field !== 'Action' && sortBy(field)"
            :style="{ cursor: field !== 'Action' ? 'pointer' : 'default' }"
          >
            {{ field }}
            <CIcon
              v-if="sortField === field"
              :icon="sortDirection === 'asc' ? 'cil-arrow-top' : 'cil-arrow-bottom'"
              class="ms-1"
            />
          </CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <CTableRow v-for="(row, idx) in paginatedData" :key="idx">
          <!-- <CTableDataCell>{{ row.ID }}</CTableDataCell> -->
          <CTableDataCell>{{ row.Name }}</CTableDataCell>

          <!-- Action Buttons -->
          <CTableDataCell>
           <CButton
              color="info"
              size="sm"
              @click="openEditModal(row)"
            ><CIcon :icon="cilPencil" class="me-1" />
            </CButton>&nbsp;
            <CButton
              color="danger"
              size="sm"
              class="text-white"
              @click="deleteRole(row.ID)"
            >
              <CIcon :icon="cilTrash" class="me-1" />
            </CButton>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>

        <!-- modal -->
    <editRoleData
      :visible="showEditModal"
      :roleData="selectedRole"
      @close="handleModalClose"
      @updated="handleRoleUpdated"
    />

    <!-- Pagination -->
    <CPagination align="center" class="mt-3">
      <CPaginationItem
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Previous
      </CPaginationItem>

      <CPaginationItem
        v-for="page in totalPages"
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
        Next
      </CPaginationItem>
    </CPagination>
  </CContainer>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { CIcon } from "@coreui/icons-vue";
import { cilTrash, cilSearch, cilPencil } from "@coreui/icons";
import editRoleData from "../components/editRoleData.vue";

// ====== API Setup ======
const API_URL = import.meta.env.VITE_API_URL;
const checkRoleUrl = `${API_URL}check-role`;
const deleteRoleUrl = `${API_URL}roles`; // 👈 Change this if your actual endpoint differs
const token = localStorage.getItem("token");

const authConfig = {
  headers: { Authorization: `Bearer ${token}` },
  timeout: 10000,
};

// ====== Reactive State ======
const roles = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref("");
const sortField = ref("ID");
const sortDirection = ref("asc");
const currentPage = ref(1);
const itemsPerPage = 5;

// ====== Table Fields ======
const fields = ["Name", "Action"];

// ====== Fetch Data ======
const fetchRoles = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(checkRoleUrl, authConfig);
    const raw = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.roles)
      ? response.data.roles
      : [];

    roles.value = raw.map((r) => ({
      ID: r.id,
      Name: r.name,
    }));
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = "Unauthorized access. Please log in to view role data.";
      roles.value = [];
    } else {
      console.error("Error fetching roles:", err);
      error.value = "Failed to load roles data.";
    }
  } finally {
    loading.value = false;
  }
};

// ====== Delete Role ======
const deleteRole = async (id) => {
  if (!confirm("Are you sure you want to delete this role?")) return;

  loading.value = true;
  error.value = null;

  try {
    const res = await axios.delete(`${deleteRoleUrl}/${id}`, authConfig);

    if (res.status === 200 && res.data.status) {
      alert("Role deleted successfully!");
      await fetchRoles(); // refresh list
    } else {
      error.value = res.data.message || "Failed to delete role.";
    }
  } catch (err) {
    console.error("Error deleting role:", err);
    error.value =
      err.response?.data?.message || "Failed to delete role. Try again.";
  } finally {
    loading.value = false;
  }
};

const showEditModal = ref(false);
const selectedRole = ref(null);

const openEditModal = (role) => {
  selectedRole.value = role;
  showEditModal.value = true;
};

const handleModalClose = () => {
  showEditModal.value = false;
  selectedRole.value = null;
};

const handleRoleUpdated = () => {
  fetchRoles(); // refresh list after editing
};

// ====== Computed ======
const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return roles.value.filter((r) =>
    Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  );
});

const sortedData = computed(() => {
  return [...filteredData.value].sort((a, b) => {
    const valA = a[sortField.value] ?? "";
    const valB = b[sortField.value] ?? "";
    if (valA < valB) return sortDirection.value === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection.value === "asc" ? 1 : -1;
    return 0;
  });
});

const totalPages = computed(() =>
  Math.ceil(sortedData.value.length / itemsPerPage)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedData.value.slice(start, start + itemsPerPage);
});

// ====== Sorting ======
const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

// ====== Lifecycle ======
onMounted(fetchRoles);
</script>
