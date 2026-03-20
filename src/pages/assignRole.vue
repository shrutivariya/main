<template>
  <div class="role-container">
    <h1 class="mb-4">Create Role</h1>

    <!-- Input for Role -->
    <CInputGroup class="mb-4">
      <CInputGroupText>
        <CIcon icon="cil-user" />
      </CInputGroupText>
      <CFormInput
        v-model="role"
        placeholder="Assign Role"
        autocomplete="assignrole"
      />
    </CInputGroup>

    <div class="mb-4">
    <h5 class="mb-3">Assign Permissions</h5>
    <div v-if="loadingPermissions" class="loading-text">Loading permissions...</div>

    <div v-else-if="permissions.length" class="permissions-grid">
        <!-- <div
        v-for="(perm, index) in permissions"
        :key="perm.name"
        class="permission-item"
        >
        <input
            class="form-check-input"
            type="checkbox"
            :id="'perm-' + index"
            :value="perm.name"
            v-model="selectedPermissions"
        />
        <label class="form-check-label" :for="'perm-' + index">
            {{ perm.name }}
        </label>
        </div> -->
    
    <label
  v-for="(perm, index) in permissions"
  :key="perm.name"
  class="permission-item form-check-label"
  :for="'perm-' + index"
>
  <input
    class="form-check-input me-2"
    type="checkbox"
    :id="'perm-' + index"
    :value="perm.name"
    v-model="selectedPermissions"
  />
  {{ perm.name }}
</label>
      </div>

    <div v-else class="empty-state">
        <p>No permissions found or failed to load.</p>
    </div>
    </div>

    <!-- Submit Button -->
    <CRow>
      <CCol :xs="6">
        <CButton
          color="primary"
          class="px-4 py-2 w-100"
          @click="submitRole"
          :disabled="loadingSubmit"
        >
          {{ loadingSubmit ? 'Submitting...' : 'Submit' }}
        </CButton>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const getPermission = `${API_URL}getPermission`
const assignRoleUrl = `${API_URL}roles`

const role = ref('')
const permissions = ref([])
const selectedPermissions = ref([])
const loadingPermissions = ref(true)
const loadingSubmit = ref(false)

// Get token from localStorage
const token = localStorage.getItem('token')

// Axios config with Authorization header
const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
}

// Fetch permissions
const fetchPermissions = async () => {
  loadingPermissions.value = true
  try {
    const { data } = await axios.get(getPermission, authConfig)
    console.log('Permissions response:', data)
    if (data.status && Array.isArray(data.permissions)) {
      permissions.value = data.permissions
    } else {
      console.warn('Permissions response invalid:', data)
      permissions.value = []
    }
  } catch (error) {
    console.error('Error fetching permissions:', error)
    permissions.value = []
  } finally {
    loadingPermissions.value = false
  }
}

// Submit role
const submitRole = async () => {
  if (!role.value.trim()) {
    alert('Please enter a role name!')
    return
  }

  loadingSubmit.value = true
  const payload = {
    name: role.value.trim(),
    permissions: selectedPermissions.value,
  }
  try {
    const { data } = await axios.post(assignRoleUrl, payload, authConfig)
    alert('Role assigned successfully!')
    role.value = ''
    selectedPermissions.value = []
  } catch (error) {
    console.error('Error submitting role:', error)
    alert('Failed to assign role. Check console for details.')
  } finally {
    loadingSubmit.value = false
  }
}

onMounted(fetchPermissions)
</script>


<style scoped>
/* .role-container {
  padding: 1rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-weight: 600;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 30px;
}

.form-check {
  display: flex;
  align-items: center;
} */

 .role-container {
  padding: 1rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-weight: 600;
}

.loading-text {
  font-style: italic;
  color: #888;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px 20px;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: background-color 0.2s ease;
}

.permission-item:hover {
  background-color: #eef6ff;
}

.form-check-input {
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

.empty-state {
  font-size: 0.95rem;
  color: #999;
  padding: 10px;
  border-left: 3px solid #ccc;
}

</style>
