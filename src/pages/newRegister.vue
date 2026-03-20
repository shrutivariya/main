<template>
  <div class="register-container">
    <h1 class="mb-4">Register New User</h1>

    <!-- Name -->
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-user" />
      </CInputGroupText>
      <CFormInput
        v-model="name"
        placeholder="Full Name"
        autocomplete="name"
      />
    </CInputGroup>

    <!-- Email -->
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-envelope-closed" />
      </CInputGroupText>
      <CFormInput
        v-model="email"
        placeholder="Email Address"
        autocomplete="email"
      />
    </CInputGroup>

    <!-- Password -->
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-lock-locked" />
      </CInputGroupText>
      <CFormInput
        type="password"
        v-model="password"
        placeholder="Password"
        autocomplete="new-password"
      />
    </CInputGroup>

    <!-- Confirm Password -->
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-lock-locked" />
      </CInputGroupText>
      <CFormInput
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm Password"
        autocomplete="new-password"
      />
    </CInputGroup>

    <!-- Assign Role -->
    <div class="mb-4">
      <h5 class="mb-2">Assign Role</h5>
      <CFormSelect v-model="selectedRole">
        <option disabled value="" selected>Select Role</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </CFormSelect>
    </div>

    <!-- Submit Button -->
    <CRow>
      <CCol :xs="6">
        <CButton
          color="primary"
          class="px-4 py-2 w-100"
          @click="submitUser"
          :disabled="loadingSubmit"
        >
          {{ loadingSubmit ? 'Registering...' : 'Register User' }}
        </CButton>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const registerUrl = `${API_URL}register`
const getRolesUrl = `${API_URL}roles`

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const selectedRole = ref('')
const roles = ref([])
const loadingSubmit = ref(false)

// Fetch roles for dropdown
const fetchRoles = async () => {
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(getRolesUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (data.status && Array.isArray(data.roles)) {
      roles.value = data.roles
    }
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

// Submit new user
const submitUser = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value || !selectedRole.value) {
    alert('Please fill all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }
  loadingSubmit.value = true
  const payload = {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: confirmPassword.value,
    role_id: selectedRole.value,
  }

  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.post(registerUrl, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log('User registered:', data)
    alert('User registered successfully!')
    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    selectedRole.value = ''
  } catch (error) {
    console.error('Error registering user:', error)
    alert('Registration failed. Check console for details.')
  } finally {
    loadingSubmit.value = false
  }
}

onMounted(fetchRoles)
</script>

<style scoped>
.register-container {
  padding: 1rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-weight: 600;
}

.mb-3, .mb-4 {
  margin-bottom: 1rem;
}
</style>

