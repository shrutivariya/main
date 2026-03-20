<template>
  <CModal
    :visible="visible"
    @close="emitClose"
    size="xl"
    scrollable
    aria-labelledby="editModalLabel"
  >
    <CModalHeader>
      <CModalTitle id="editModalLabel">
        ✏️ Edit Invoice - {{ editableRecord["Project ID"] || "N/A" }}
      </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CForm>
        <!-- Section: Project Info -->
        <h5 class="mb-3">Project Info</h5>
        <CRow class="mb-3">
          <CCol md="4">
            <CFormLabel>Project ID</CFormLabel>
            <CFormInput v-model="editableRecord['Project ID']" required />
          </CCol>
          <CCol md="4">
            <CFormLabel>Client Name</CFormLabel>
            <CFormInput v-model="editableRecord['Client Name']" required />
          </CCol>
          <CCol md="4">
            <CFormLabel>TL</CFormLabel>
            <CFormInput v-model="editableRecord['TL']" required />
          </CCol>
        </CRow>

        <!-- Section: Invoice Details -->
        <h5 class="mb-3 mt-4">Invoice Details</h5>
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>Invoice Link</CFormLabel>
            <CFormInput v-model="editableRecord['Link']" required />
          </CCol>
          <CCol md="6">
            <CFormLabel>Invoice Sent Date</CFormLabel>
            <CFormInput
              type="date"
              v-model="editableRecord['Sent Date']"
              @click="openDatePicker"
              @focus="openDatePicker"
              required
            />
          </CCol>
        </CRow>

        <CRow class="mb-3">
          <CCol md="4">
            <CFormLabel>Cycle Start Date</CFormLabel>
            <CFormInput
              type="date"
              v-model="editableRecord['Start Date']"
              @change="handleStartDateChange"
              @click="openDatePicker"
              @focus="openDatePicker"
              required
            />
          </CCol>
          <CCol md="4">
            <CFormLabel>Cycle End Date</CFormLabel>
            <CFormInput
              type="date"
              v-model="editableRecord['End Date']"
              :min="editableRecord['Start Date']"
              @change="validateEndDate"
              @click="openDatePicker"
              @focus="openDatePicker"
              required
            />
          </CCol>
          <CCol md="4">
            <CFormLabel>Bank Account Name</CFormLabel>
            <CFormInput v-model="editableRecord['Bank Account Name']" required />
          </CCol>
        </CRow>

        <!-- Section: Financials -->
        <h5 class="mb-3 mt-4">Financials</h5>
        <CRow class="mb-3">
          <CCol md="4">
            <CFormLabel>Invoice Status</CFormLabel>
            <!-- <CFormInput v-model="editableRecord['Sent Status']" required /> -->
                      <CFormSelect
            v-model="editableRecord['Sent Status']"
            :options="invoiceStatusOptions"
            placeholder="Select invoice status"
          />
          </CCol>
         <CCol md="4">
          <CFormLabel>Amount</CFormLabel>
          <div class="input-group">
            <CFormInput
              type="number"
              v-model="editableRecord['Amount']"
              placeholder="Enter amount" required
            />
            <CFormSelect
              v-model="editableRecord['Currency Status']"
              style="max-width: 90px;"
            >
              <option :value="0">USD</option>
              <option :value="1">INR</option>
            </CFormSelect>
          </div>
        </CCol>
          <CCol md="4">
            <CFormLabel>Sent Via</CFormLabel>
            <CFormInput v-model="editableRecord['Sent Via']" required />
          </CCol>
        </CRow>

        <!-- Section: Release Info -->
        <h5 class="mb-3 mt-4">Release Info</h5>
        <CRow class="mb-3">
          <CCol md="4">
            <CFormLabel>Release Status</CFormLabel>
            <!-- <CFormInput v-model="editableRecord['Release Status']" required /> -->
             <CFormSelect
            v-model="editableRecord['Release Status']"
            :options="invoiceReleaseStatusOptions"
            placeholder="Select invoice status"
          />
          </CCol>
          <CCol md="4">
            <CFormLabel>Followup Date</CFormLabel>
            <CFormInput
              type="date"
              v-model="editableRecord['Followup Date']"
              @click="openDatePicker"
              @focus="openDatePicker"
            />
          </CCol>
          <CCol md="4">
            <CFormLabel>Release Amount Date</CFormLabel>
            <CFormInput
              type="date"
              v-model="editableRecord['Release Amount Date']"
              @click="openDatePicker"
              @focus="openDatePicker"
               required
            />
          </CCol>
        </CRow>

        <CRow class="mb-4">
  <CCol md="6">
    <CFormLabel>Release Amount</CFormLabel>
    <div class="input-group">
      <CFormInput
        type="number"
        v-model="editableRecord['Release Amount']"
        placeholder="Enter amount"
        required
      />
      <CFormSelect
        v-model="editableRecord['Release Currency Status']"
        style="max-width: 90px;"
      >
        <option :value="0">USD</option>
        <option :value="1">INR</option>
      </CFormSelect>
    </div>
  </CCol>
</CRow>
      </CForm>
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" @click="emitClose">Close</CButton>
      <CButton color="primary" @click="emitSave">💾 Save changes</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  record: { type: Object, required: true },
  visible: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "save"]);

const editableRecord = ref({});
const invoiceStatusOptions = ["pending", "completed"];

const invoiceReleaseStatusOptions = ["pending", "completed", "cancelled"];

// Sync record when it changes
watch(
  () => props.record,
  (newVal) => {
    editableRecord.value = { ...newVal };

    console.log("Editable Record:", editableRecord.value);
  },
  { immediate: true }
);

function handleStartDateChange() {
  const startDate = editableRecord.value["Start Date"];
  if (!startDate) return;

  const date = new Date(startDate);
  const day = date.getDay();
  const diffToFriday = (5 - day + 7) % 7;
  date.setDate(date.getDate() + diffToFriday);
  editableRecord.value["End Date"] = date.toISOString().split("T")[0];
}

function validateEndDate() {
  const start = new Date(editableRecord.value["Start Date"]);
  const end = new Date(editableRecord.value["End Date"]);
  if (end < start) {
    alert("End date cannot be before the start date.");
    editableRecord.value["End Date"] = editableRecord.value["Start Date"];
  }
}

// Emit events
function emitClose() {
  emit("close");
}
function emitSave() {
  emit("save", { ...editableRecord.value });
}
function openDatePicker(event) {
  try {
    event.target.showPicker?.();
  } catch (e) {
    console.warn("Picker open blocked by browser", e);
  }
}
</script>

<style scoped>
h5 {
  color: #333;
  font-weight: 600;
}
</style>
