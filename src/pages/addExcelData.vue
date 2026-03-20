<template>
  <CContainer class="mt-4">
    <h4 class="mb-4">🧾 Add Invoice Record</h4>

    <CForm @submit.prevent="handleSubmit">
      <!-- Section: Project Info -->
      <h5 class="mb-3">Project Info</h5>
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel
            ><CIcon :icon="cilFingerprint" class="me-2" />Project ID</CFormLabel
          >
          <CFormInput v-model="form['Project ID']" />
        </CCol>
        <CCol md="4">
          <CFormLabel
            ><CIcon icon="cil-user" class="me-2" />Client Name</CFormLabel
          >
          <CFormInput v-model="form['Client Name']" />
        </CCol>
        <CCol md="4">
          <CFormLabel
            ><CIcon icon="cil-userFollow" class="me-2" />TL</CFormLabel
          >
          <CFormInput v-model="form.TL" />
        </CCol>
      </CRow>

      <!-- Section: Invoice Details -->
      <h5 class="mb-3 mt-4">Invoice Details</h5>
      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel
            ><CIcon :icon="cilLink" class="me-2" />Invoice Link</CFormLabel
          >
          <CFormInput v-model="form['Invoice Link']" />
        </CCol>
        <CCol md="6">
          <CFormLabel
            ><CIcon icon="cil-calendar" class="me-2" />Invoice Sent
            Date</CFormLabel
          >
          <CFormInput
            type="date"
            v-model="form['Invoice Sent Date']"
            @click="openDatePicker"
            @focus="openDatePicker"
          />
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CRow class="mb-3">
          <CCol md="4">
            <CFormLabel>
              <CIcon icon="cil-calendar" class="me-2" />Cycle Start Date
            </CFormLabel>
            <CFormInput
              type="date"
              v-model="form['Invoice Cycle Start Date']"
              @click="openDatePicker"
              @focus="openDatePicker"
              @change="handleStartDateChange"
            />
          </CCol>

          <CCol md="4">
            <CFormLabel>
              <CIcon icon="cil-calendar" class="me-2" />Cycle End Date
            </CFormLabel>
            <CFormInput
              type="date"
              v-model="form['Invoice Cycle End Date']"
              :min="form['Invoice Cycle Start Date']"
              @click="openDatePicker"
              @focus="openDatePicker"
              @change="validateEndDate"
            />
          </CCol>
        </CRow>

        <CCol md="4">
          <CFormLabel
            ><CIcon :icon="cilBank" class="me-2" />Bank Account Name</CFormLabel
          >
          <CFormInput v-model="form['Bank Account Name']" />
        </CCol>
      </CRow>

      <!-- Section: Financials -->
      <h5 class="mb-3 mt-4">Financials</h5>
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel>
            <CIcon icon="cil-check-circle" class="me-2" />Invoice Status
          </CFormLabel>
          <CFormSelect
            v-model="form['Invoice Status']"
            :options="invoiceStatusOptions"
            placeholder="Select invoice status"
          />
        </CCol>

        <CCol md="4">
          <CFormLabel>
            <CIcon :icon="cilMoney" class="me-2" />Amount
          </CFormLabel>

          <div class="input-group">
            <CFormInput
              type="number"
              v-model="form['Amount']"
              placeholder="Enter amount"
            />
            <CFormSelect
              v-model="form['Currency Status']"
              style="max-width: 90px"
            >
              <option value="0">USD</option>
              <option value="1">INR</option>
            </CFormSelect>
          </div>
        </CCol>

        <CCol md="4">
          <CFormLabel
            ><CIcon :icon="cilSend" class="me-2" />Sent Via</CFormLabel
          >
          <CFormInput v-model="form['Sent Via']" />
        </CCol>
      </CRow>

      <!-- Section: Release Info -->
      <h5 class="mb-3 mt-4">Release Info</h5>
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel
            ><CIcon icon="cil-task" class="me-2" />Invoice Release
            Status</CFormLabel
          >
          <!-- <CFormInput v-model="form['Invoice Release Status']" /> -->
          <CFormSelect
            v-model="form['Invoice Release Status']"
            :options="invoiceReleaseStatusOptions"
            placeholder="Select invoice status"
          />
        </CCol>
        <CCol md="4">
          <CFormLabel
            ><CIcon icon="cil-calendar" class="me-2" />Followup Date</CFormLabel
          >
          <CFormInput
            type="date"
            v-model="form['Followup Date']"
            @click="openDatePicker"
            @focus="openDatePicker"
          />
        </CCol>
        <CCol md="4">
          <CFormLabel
            ><CIcon icon="cil-calendar" class="me-2" />Release Amount
            Date</CFormLabel
          >
          <CFormInput
            type="date"
            v-model="form['Release Amount Date']"
            @click="openDatePicker"
            @focus="openDatePicker"
          />
        </CCol>
      </CRow>

      <CRow class="mb-4">
        <CCol md="6">
          <CFormLabel>
            <CIcon :icon="cilMoney" class="me-2" />
            Release Amount
          </CFormLabel>

          <div class="input-group">
            <!-- Amount input -->
            <CFormInput
              type="number"
              v-model="form['Release Amount']"
              placeholder="Enter amount"
            />
            <!-- Currency dropdown -->
            <CFormSelect
              v-model="form['Release Currency Status']"
              style="max-width: 90px"
            >
              <option :value="0">USD</option>
              <option :value="1">INR</option>
            </CFormSelect>
          </div>
        </CCol>
      </CRow>

      <!-- Submit -->
      <div class="mt-4">
        <CButton type="submit" color="success" class="text-white">
          <CIcon :icon="cilSave" class="me-2" /> Submit Invoice
        </CButton>
      </div>
    </CForm>
  </CContainer>
</template>

<script setup>
import {
  cilFingerprint,
  cilBank,
  cilSend,
  cilLink,
  cilMoney,
  cilSave,
} from "@coreui/icons";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const API_URL = import.meta.env.VITE_API_URL;
const storeInvoiceUrl = `${API_URL}invoices/store`;
const token = localStorage.getItem("token");

const route = useRoute();

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  timeout: 10000,
};
const invoiceStatusOptions = ["pending", "completed"];

const invoiceReleaseStatusOptions = ["pending", "completed", "cancelled"];

const form = ref({
  "Project ID": "",
  "Client Name": "",
  TL: "",
  "Invoice Link": "",
  "Invoice Sent Date": "",
  "Invoice Cycle Start Date": "",
  "Invoice Cycle End Date": "",
  "Bank Account Name": "",
  "Invoice Status": "",
  Amount: "",
  "Sent Via": "",
  "Invoice Release Status": "",
  "Followup Date": "",
  "Release Amount Date": "",
  "Release Amount": "",
  "Currency Status": "",
  "Release Currency Status": "",
});

function openDatePicker(event) {
  try {
    event.target.showPicker?.();
  } catch (e) {
    console.warn("Picker open blocked by browser", e);
  }
}

function handleStartDateChange() {
  const startDate = form.value["Invoice Cycle Start Date"];
  if (!startDate) return;

  const date = new Date(startDate);
  const day = date.getDay(); // Sunday = 0, Monday = 1, ... Friday = 5

  // Calculate days until this week's Friday
  const diffToFriday = (5 - day + 7) % 7;
  date.setDate(date.getDate() + diffToFriday);

  // Format date → yyyy-mm-dd (for <input type="date">)
  const formatted = date.toISOString().split("T")[0];
  form.value["Invoice Cycle End Date"] = formatted;
}
// ✅ Ensure end date is never before start date
function validateEndDate() {
  const start = new Date(form.value["Invoice Cycle Start Date"]);
  const end = new Date(form.value["Invoice Cycle End Date"]);

  if (end < start) {
    alert("⚠️ End date cannot be before the start date.");
    form.value["Invoice Cycle End Date"] =
      form.value["Invoice Cycle Start Date"];
  }
}

async function handleSubmit() {
  const payload = {
    project_id: form.value["Project ID"],
    client_name: form.value["Client Name"],
    tl: form.value.TL,
    invoice_link: form.value["Invoice Link"],
    invoice_sent_date: form.value["Invoice Sent Date"],
    invoice_cycle_start: form.value["Invoice Cycle Start Date"],
    invoice_cycle_end: form.value["Invoice Cycle End Date"],
    bank_account_name: form.value["Bank Account Name"],
    invoice_status: form.value["Invoice Status"],
    amount_usd: form.value["Amount"],
    currency_status: form.value["Currency Status"],
    sent_via: form.value["Sent Via"],
    invoice_release_status: form.value["Invoice Release Status"],
    followup_date: form.value["Followup Date"],
    release_amount_date: form.value["Release Amount Date"],
    release_amount_inr: form.value["Release Amount"],
    release_currency_status: form.value["Release Currency Status"],
  };
  console.log("payload data: ", payload);
  try {
    const response = await axios.post(storeInvoiceUrl, payload, authConfig);
    console.log("Invoice stored:", response.data);
    alert("✅ Invoice record submitted successfully!");

    // Optional: reset form
    Object.keys(form.value).forEach((key) => {
      form.value[key] = "";
    });
  } catch (error) {
    if (error.response?.status === 401) {
      alert("❌ Unauthorized. Please log in again.");
    } else if (error.response?.data?.errors) {
      console.error("Validation errors:", error.response.data.errors);
      alert("⚠️ Validation failed. Check console for details.");
    } else {
      console.error("Error storing invoice:", error);
      alert("❌ Failed to submit invoice. Check console for details.");
    }
  }
}

function getLastWeekMonday() {
  const today = new Date();
  const day = today.getDay(); // Sunday = 0, Monday = 1, ...
  const lastMonday = new Date(today);

  const diff = day + 6; // Sunday=0 -> 6, Monday=1 -> 7, etc.
  lastMonday.setDate(today.getDate() - diff);

  return lastMonday.toISOString().split("T")[0]; // yyyy-mm-dd
}

function getLastWeekFriday() {
  const monday = new Date(getLastWeekMonday());
  monday.setDate(monday.getDate() + 4); // Monday + 4 days = Friday
  return monday.toISOString().split("T")[0];
}

onMounted(() => {
  if (
    !form.value["Invoice Cycle Start Date"] &&
    !form.value["Invoice Cycle End Date"]
  ) {
    form.value["Invoice Cycle Start Date"] = getLastWeekMonday();
    form.value["Invoice Cycle End Date"] = getLastWeekFriday();
  }

  // Optional: pre-fill copied data if available
  const copied = history.state?.copiedData;
  console.log("copied data: ", copied);
  if (copied) {
    const map = {
      "Project ID": "Project ID",
      "Client Name": "Client Name",
      TL: "TL",
      "Invoice Link": "Link",
      "Invoice Sent Date": "Sent Date",
      "Invoice Cycle Start Date": "Start Date",
      "Invoice Cycle End Date": "End Date",
      "Bank Account Name": "Bank Account Name",
      "Invoice Status": "Sent Status",
      Amount: "Amount",
      "Currency Status": "Currency Status",
      "Sent Via": "Sent Via",
      "Invoice Release Status": "Release Status",
      "Followup Date": "Followup Date",
      "Release Amount Date": "Release Amount Date",
      "Release Amount": "Release Amount",
      "Release Currency Status": "Release Currency Status",
    };

    Object.keys(map).forEach((targetField) => {
      const sourceField = map[targetField];
      if (copied[sourceField] !== undefined) {
        form.value[targetField] = copied[sourceField];
      }
    });
  }
});


</script>
