<template>
  <CContainer class="mt-4">
    <h4 class="mb-3">View Users</h4>

    <!-- Search -->
    <CInputGroup class="mb-3">
      <CFormInput v-model="searchQuery" placeholder="Search users..." />
      <CInputGroupText><CIcon :icon="cilSearch" /></CInputGroupText>
    </CInputGroup>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center py-4">Loading users...</div>
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
        <CTableRow v-for="(user, idx) in paginatedData" :key="idx">
          <CTableDataCell>{{ user.Name }}</CTableDataCell>
          <CTableDataCell>{{ user.Email }}</CTableDataCell>
          <CTableDataCell>{{ user.Role }}</CTableDataCell>

          <!-- Action Buttons -->
          <CTableDataCell>
            <CButton
              color="info"
              size="sm"
              class="text-white me-2"
              @click="openEditModal(user)"
            >
              <CIcon :icon="cilPencil" class="me-1" />
            </CButton>
            <CButton
              color="danger"
              size="sm"
              class="text-white"
              @click="deleteUser(user.ID)"
            >
              <CIcon :icon="cilTrash" class="me-1" />
            </CButton>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>

        <editUserData
        :visible="showEditModal"
        :userData="selectedUser"
        @close="handleModalClose"
        @updated="fetchUsers"
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
import { cilSearch, cilPencil, cilTrash } from "@coreui/icons";
import editUserData from "../components/editUserData.vue";

// ====== API Setup ======
const API_URL = import.meta.env.VITE_API_URL;
const getUsersUrl = `${API_URL}getUser`;
const deleteUserUrl = `${API_URL}deleteUser`;
const token = localStorage.getItem("token");

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
};

// ====== Reactive State ======
const users = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref("");
const sortField = ref("Name");
const sortDirection = ref("asc");
const currentPage = ref(1);
const itemsPerPage = 5;

const showEditModal = ref(false);
const selectedUser = ref(null);

// ====== Table Fields ======
const fields = ["Name", "Email", "Role", "Action"];


// ====== Fetch Users ======
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await axios.get(getUsersUrl, authConfig);
    console.log("API response:", res.data);

    const raw = Array.isArray(res.data.data) ? res.data.data : [];
    console.log("raw data:", raw);

    // Map the data
    users.value = raw.map((u) => ({
      ID: u.id,
      Name: u.name,
      Email: u.email,
      Role: u.role_name || "—",
      role_id: u.role_id || "",
    }));

  } catch (err) {
    console.error("Error fetching users:", err);
    error.value = "Failed to load users data.";
  } finally {
    loading.value = false;
  }
};


// ====== Delete User ======
const deleteUser = async (id) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  loading.value = true;
  try {
    const res = await axios.delete(`${deleteUserUrl}/${id}`, authConfig);

    if (res.data.status === true) {
        await fetchUsers(); // Refresh list after delete
    //   alert("User deleted successfully!");
    } else {
      alert(res.data.message || "Failed to delete user.");
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete user. Please try again.");
  } finally {
    loading.value = false;
  }
};


// ====== Edit Modal ======
const openEditModal = (user) => {
  selectedUser.value = user;
  showEditModal.value = true;
};
const handleModalClose = () => {
  showEditModal.value = false;
};

// ====== Computed ======
const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return users.value.filter((u) =>
    Object.values(u).some((v) => String(v).toLowerCase().includes(q))
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

// ====== Sort ======
const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

// ====== Lifecycle ======
onMounted(fetchUsers);
</script>
