<template>
  <CModal :visible="visible" @close="closeModal" backdrop="static">
    <CModalHeader>
      <CModalTitle>Edit Role</CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CForm @submit.prevent="updateRole">
        <!-- Role Name -->
        <CFormFloating class="mb-3">
          <CFormInput
            id="roleName"
            type="text"
            v-model="form.name"
            placeholder="Role Name"
            required
          />
          <CFormLabel for="roleName">Role Name</CFormLabel>
        </CFormFloating>

        <!-- Permissions -->
        <div class="mb-3">
          <label class="fw-bold d-block mb-2">Permissions:</label>

          <div v-if="permissionsLoading">Loading permissions...</div>
          <div v-else-if="permissionsError" class="text-danger small">
            {{ permissionsError }}
          </div>

          <div v-else class="d-flex flex-wrap gap-3">
            <div
              v-for="perm in permissions"
              :key="perm.name"
              class="form-check"
              style="min-width: 150px;"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="perm.name"
                :value="perm.name"
                v-model="form.permissions"
              />
              <label class="form-check-label" :for="perm.name">
                {{ perm.name }}
              </label>
            </div>
          </div>
        </div>

        <div v-if="error" class="text-danger small mb-2">{{ error }}</div>
        <div v-if="success" class="text-success small mb-2">{{ success }}</div>

        <div class="d-flex justify-content-end gap-2">
          <CButton color="secondary" @click="closeModal">Cancel</CButton>
          <CButton color="primary" type="submit" :disabled="loading">
            {{ loading ? "Saving..." : "Update" }}
          </CButton>
        </div>
      </CForm>
    </CModalBody>
  </CModal>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, onMounted } from "vue";
import axios from "axios";

// ===== Props & Emits =====
const props = defineProps({
  visible: Boolean,
  roleData: Object,
});
const emit = defineEmits(["close", "updated"]);

// ===== API Setup =====
const API_URL = import.meta.env.VITE_API_URL;
const permissionUrl = `${API_URL}getPermission`;
const rolePermissionUrl = `${API_URL}check-permission/`; // + roleId
const updateUrl = `${API_URL}update-roles-permission/`; // + roleId
const token = localStorage.getItem("token");

const authConfig = {
  headers: { Authorization: `Bearer ${token}` },
  timeout: 10000,
};

// ===== Reactive State =====
const form = ref({
  id: null,
  name: "",
  permissions: [],
});
const permissions = ref([]);
const loading = ref(false);
const permissionsLoading = ref(false);
const permissionsError = ref(null);
const error = ref(null);
const success = ref(null);

// ===== Fetch All Permissions =====
const fetchAllPermissions = async () => {
  permissionsLoading.value = true;
  try {
    const res = await axios.get(permissionUrl, authConfig);
    if (res.data.status && Array.isArray(res.data.permissions)) {
      permissions.value = res.data.permissions;
    } else {
      permissionsError.value = "Invalid permission data format";
    }
  } catch (err) {
    console.error("Error fetching permissions:", err);
    permissionsError.value = "Failed to load permissions.";
  } finally {
    permissionsLoading.value = false;
  }
};

// ===== Fetch Role's Existing Permissions =====
const fetchRolePermissions = async (roleId) => {
  try {
    const res = await axios.get(`${rolePermissionUrl}${roleId}`, authConfig);
    if (res.data.status) {
      // fill role name + assigned permissions
      form.value.id = res.data.role.id;
      form.value.name = res.data.role.name;
      form.value.permissions = res.data.permissions || [];
    }
  } catch (err) {
    console.error("Error fetching role permissions:", err);
  }
};

// ===== Watch for Role Prop =====
watch(
  () => props.roleData,
  async (newVal) => {
    if (newVal && newVal.ID) {
      await fetchAllPermissions();
      await fetchRolePermissions(newVal.ID);
    }
  },
  { immediate: true }
);

// ===== Close Modal =====
const closeModal = () => {
  emit("close");
  form.value = { id: null, name: "", permissions: [] };
  error.value = null;
  success.value = null;
};

// ===== Update Role =====
const updateRole = async () => {
  loading.value = true;
  error.value = null;
  success.value = null;

  try {
    await axios.put(
      `${updateUrl}${form.value.id}`,
      {
        name: form.value.name,
        permissions: form.value.permissions,
      },
      authConfig
    );

    success.value = "Role updated successfully!";
    emit("updated"); // refresh parent list
    setTimeout(closeModal, 800);
  } catch (err) {
    console.error(err);
    error.value = "Failed to update role.";
  } finally {
    loading.value = false;
  }
};
</script>
