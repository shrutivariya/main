
<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign in to your account</p>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="email"
                      placeholder="Email"
                      autocomplete="email"
                    />
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol :xs="6">
                      <CButton
                        color="primary"
                        class="px-4"
                        type="submit"
                        :disabled="loading"
                      >
                        {{ loading ? 'Logging in...' : 'Login' }}
                      </CButton>
                    </CCol>

                    <!-- <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol> -->
                  </CRow>

                  <div v-if="error" class="text-danger mt-3">{{ error }}</div>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%;">
              <CCardBody class="text-center">
                <h4 class="fw-bold mb-4">Manage Invoices</h4>
                <p class="lead mb-4">
                  Your complete invoice management solution. Track sent invoices, monitor payment status, and manage client billing all from a single, user-friendly dashboard.
                </p>
              </CCardBody>
            </CCard>

          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Form data
const email = ref('')
const password = ref('')

// States
const loading = ref(false)
const error = ref(null)

// Load API base URL from .env
const api = import.meta.env.VITE_API_URL + 'login' // → https://ecf1c188ecbf.ngrok-free.app/api/login

const handleLogin = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await axios.post(api, {
      email: email.value,
      password: password.value,
    })
    console.log(response);
    console.log('Login success:', response.data)

    const token = response.data?.data?.token
    const user = response.data?.data?.user
    const roles = response.data?.data?.roles || []
    const permissions = response.data?.data?.permissions || []

    if (token) {
     
      localStorage.setItem('token', token)
      localStorage.setItem('userName', user?.name || '')
      localStorage.setItem('roles', JSON.stringify(roles))
      localStorage.setItem('permissions', JSON.stringify(permissions))

      console.log('Token stored:', token)
      console.log('Roles stored:', roles)
      console.log('user stored:', user)
      console.log('permissions stored:', permissions)
      router.push('/dashboard')
    } else {
      throw new Error('Token missing in response')
    }

  } catch (err) {
    console.error('Login failed:', err)
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>