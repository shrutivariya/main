<template>
  <CModal :visible="visible" @close="closeModal" backdrop="static">
    <CModalHeader>
      <CModalTitle>Edit User</CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CForm @submit.prevent="updateUser">
        <!-- Name -->
        <CFormFloating class="mb-3">
          <CFormInput
            id="name"
            type="text"
            v-model="form.name"
            placeholder="Name"
            required
          />
          <CFormLabel for="name">Name</CFormLabel>
        </CFormFloating>

        <!-- Email -->
        <CFormFloating class="mb-3">
          <CFormInput
            id="email"
            type="email"
            v-model="form.email"
            placeholder="Email"
            required
          />
          <CFormLabel for="email">Email</CFormLabel>
        </CFormFloating>

      <!-- Roles Dropdown -->
<div class="mb-3">
  <label class="fw-bold d-block mb-2">Role:</label>

  <div v-if="rolesLoading">Loading roles...</div>
  <div v-else-if="rolesError" class="text-danger small">{{ rolesError }}</div>

  <div v-else>
    <CFormSelect v-model="form.role_id" required>
      <option value="" disabled>Select a role</option>
      <option v-for="role in allRoles" :key="role.id" :value="role.id">
        {{ role.name }}
      </option>
    </CFormSelect>
  </div>
</div>


        <div v-if="error" class="text-danger small mb-2">{{ error }}</div>
        <div v-if="success" class="text-success small mb-2">{{ success }}</div>

        <div class="d-flex justify-content-end gap-2">
          <CButton color="secondary" @click="closeModal">Cancel</CButton>
          <CButton color="primary" type="submit" :disabled="loading">
            {{ loading ? "Saving..." : "Save Changes" }}
          </CButton>
        </div>
      </CForm>
    </CModalBody>
  </CModal>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  visible: Boolean,
  userData: Object,
});
const emit = defineEmits(["close", "updated"]);

const API_URL = import.meta.env.VITE_API_URL;
const getRolesUrl = `${API_URL}roles`
const updateUserUrl = `${API_URL}updateUser`
const token = localStorage.getItem("token");

const authConfig = {
  headers: { Authorization: `Bearer ${token}` },
  timeout: 10000,
};

// Form state
const form = ref({
  id: null,
  name: "",
  email: "",
  role_id: "", // array of role IDs
});

// Roles data
const allRoles = ref([]);
const rolesLoading = ref(false);
const rolesError = ref(null);

// Status
const loading = ref(false);
const error = ref(null);
const success = ref(null);

// ===== Fetch all roles =====
const fetchAllRoles = async () => {
  rolesLoading.value = true;
  try {
    const res = await axios.get(getRolesUrl, authConfig);
    console.log("role data:", res.data);

    if (res.data.status && Array.isArray(res.data.roles)) {
      allRoles.value = res.data.roles; // use `roles` array
    } else {
      rolesError.value = "Invalid role data format";
    }
  } catch (err) {
    console.error("Error fetching roles:", err);
    rolesError.value = "Failed to load roles.";
  } finally {
    rolesLoading.value = false;
  }
};


// ===== Load selected user into form =====
watch(
  () => props.userData,
  (user) => {
    if (user && user.ID) {
      form.value.id = user.ID;
      form.value.name = user.Name || "";
      form.value.email = user.Email || "";
      form.value.role_id =  user.role_id
    }
  },
  { immediate: true }
);

// ===== Update user =====
const updateUser = async () => {
  if (!form.value.name || !form.value.email) {
    alert("Please fill all required fields");
    return;
  }

  loading.value = true;
  error.value = null;
  success.value = null;

  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      role_id: form.value.role_id,
    };

    const editUserTemp = await axios.put(`${updateUserUrl}/${form.value.id}`, payload, authConfig);

    success.value = "User updated successfully!";
    emit("updated"); // trigger parent to refresh
    setTimeout(closeModal, 800);
  } catch (err) {
    console.error("Error updating user:", err);
    error.value = "Failed to update user.";
  } finally {
    loading.value = false;
  }
};

// ===== Close modal =====
const closeModal = () => {
  emit("close");
  form.value = { id: null, name: "", email: "", roles: [] };
  error.value = null;
  success.value = null;
};

// ===== On mount =====
onMounted(fetchAllRoles);
</script>

<style scoped>
/* Optional: add custom styles if needed */
</style>
