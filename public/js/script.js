// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'Medicine_Reminder'
};

// DOM Elements
const addPatientModal = document.getElementById('addPatientModal');
const addPatientForm = document.getElementById('addPatientForm');
const addReminderModal = document.getElementById('addReminderModal');
const addReminderForm = document.getElementById('addReminderForm');
const closeModal = document.querySelectorAll('.close');
const patientSearch = document.getElementById('patientSearch');
const doctorSearch = document.getElementById('doctorSearch');
const prescriptionSearch = document.getElementById('prescriptionSearch');
const patientsTable = document.getElementById('patientsTable');
const doctorsTable = document.getElementById('doctorsTable');
const prescriptionsTable = document.getElementById('prescriptionsTable');
const reminderFilter = document.getElementById('reminderFilter');
const remindersList = document.getElementById('remindersList');

// Stats Elements
const totalPatientsElement = document.getElementById('totalPatients');
const activeDoctorsElement = document.getElementById('activeDoctors');
const pendingRemindersElement = document.getElementById('pendingReminders');
const activePrescriptionsElement = document.getElementById('activePrescriptions');

// New DOM Elements for added features
const nurseSearch = document.getElementById('nurseSearch');
const nursesTable = document.getElementById('nursesTable');
const roomStatusFilter = document.getElementById('roomStatusFilter');
const roomsTable = document.getElementById('roomsTable');
const billStatusFilter = document.getElementById('billStatusFilter');
const billsTable = document.getElementById('billsTable');
const pharmacySearch = document.getElementById('pharmacySearch');
const pharmacyTable = document.getElementById('pharmacyTable');
const healthRecordSearch = document.getElementById('healthRecordSearch');
const healthRecordsTable = document.getElementById('healthRecordsTable');

// New Modal Elements
const addNurseModal = document.getElementById('addNurseModal');
const addNurseForm = document.getElementById('addNurseForm');
const addRoomModal = document.getElementById('addRoomModal');
const addRoomForm = document.getElementById('addRoomForm');
const addBillModal = document.getElementById('addBillModal');
const addBillForm = document.getElementById('addBillForm');
const addHealthRecordModal = document.getElementById('addHealthRecordModal');
const addHealthRecordForm = document.getElementById('addHealthRecordForm');
const addPharmacyModal = document.getElementById('addPharmacyModal');
const addPharmacyForm = document.getElementById('addPharmacyForm');
const addDoctorModal = document.getElementById('addDoctorModal');
const addDoctorForm = document.getElementById('addDoctorForm');
const addPrescriptionModal = document.getElementById('addPrescriptionModal');
const addPrescriptionForm = document.getElementById('addPrescriptionForm');

// Stats Elements (add new ones)
const activeNursesElement = document.getElementById('activeNurses');
const pendingBillsElement = document.getElementById('pendingBills');

// Modal Functions
function showAddPatientModal() {
    addPatientModal.style.display = 'block';
}

function closeAddPatientModal() {
    addPatientModal.style.display = 'none';
}

function showAddReminderModal() {
    // Load patients for select dropdown
    loadPatientsForSelect();
    addReminderModal.style.display = 'block';
}

function closeAddReminderModal() {
    addReminderModal.style.display = 'none';
}

function showAddDoctorModal() {
    addDoctorModal.style.display = 'block';
}

function closeAddDoctorModal() {
    addDoctorModal.style.display = 'none';
}

function showAddPrescriptionModal() {
    loadPatientsForSelect('prescriptionPatientId');
    loadDoctorsForSelect('prescriptionDoctorId');
    addPrescriptionModal.style.display = 'block';
}

function closeAddPrescriptionModal() {
    addPrescriptionModal.style.display = 'none';
}

function showAddPharmacyModal() {
    loadPatientsForSelect('pharmacyPatientId');
    addPharmacyModal.style.display = 'block';
}

function showAddNurseModal() {
    addNurseModal.style.display = 'block';
}

function closeAddNurseModal() {
    addNurseModal.style.display = 'none';
}

function showAddRoomModal() {
    addRoomModal.style.display = 'block';
}

function closeAddRoomModal() {
    addRoomModal.style.display = 'none';
}

function showAddBillModal() {
    addBillModal.style.display = 'block';
}

function closeAddBillModal() {
    addBillModal.style.display = 'none';
}

function showAddHealthRecordModal() {
    addHealthRecordModal.style.display = 'block';
}

function closeAddHealthRecordModal() {
    addHealthRecordModal.style.display = 'none';
}

// Event Listeners
closeModal.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Form Submission
addPatientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    try {
        showLoadingOverlay();
        const response = await fetch('/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const responseData = await response.json();
        
        if (response.ok) {
            closeAddPatientModal();
            loadPatients();
            updateDashboardStats();
            addPatientForm.reset();
            showToast('Patient added successfully', 'success');
        } else {
            console.error('Server error:', responseData);
            showToast(`Error: ${responseData.error || 'Failed to add patient'}`, 'error');
        }
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error:', error);
        showToast('Network error. Please check your connection.', 'error');
        hideLoadingOverlay();
    }
});

// Add Reminder Form Submission
if (addReminderForm) {
    addReminderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            patientId: document.getElementById('patientId').value,
            message: document.getElementById('message').value,
            dueDate: document.getElementById('dueDate').value,
            reminderTime: document.getElementById('reminderTime').value
        };

        try {
            const response = await fetch('/api/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddReminderModal();
                loadReminders();
                updateDashboardStats();
                addReminderForm.reset();
                showToast('Reminder added successfully', 'success');
            } else {
                showToast('Error adding reminder. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error adding reminder. Please try again.', 'error');
        }
    });
}

// Add Nurse Form Submission
if (addNurseForm) {
    addNurseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('nurseFirstName').value,
            lastName: document.getElementById('nurseLastName').value,
            department: document.getElementById('department').value,
            phone: document.getElementById('nursePhone').value,
            shift: document.getElementById('shift').value
        };

        try {
            showLoadingOverlay();
            const response = await fetch('/api/nurses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddNurseModal();
                loadNurses();
                updateDashboardStats();
                addNurseForm.reset();
                showToast('Nurse added successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to add nurse'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error:', error);
            showToast('Network error. Please check your connection.', 'error');
            hideLoadingOverlay();
        }
    });
}

// Add Room Form Submission
if (addRoomForm) {
    addRoomForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            roomNumber: document.getElementById('roomNumber').value,
            roomType: document.getElementById('roomType').value,
            floor: document.getElementById('floor').value,
            status: document.getElementById('roomStatus').value,
            capacity: document.getElementById('capacity').value
        };

        try {
            showLoadingOverlay();
            const response = await fetch('/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddRoomModal();
                loadRooms();
                addRoomForm.reset();
                showToast('Room added successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to add room'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error:', error);
            showToast('Network error. Please check your connection.', 'error');
            hideLoadingOverlay();
        }
    });
}

// Add Bill Form Submission
if (addBillForm) {
    addBillForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get all item descriptions and amounts
        const itemDescriptions = Array.from(document.querySelectorAll('input[name="itemDescription[]"]')).map(input => input.value);
        const itemAmounts = Array.from(document.querySelectorAll('input[name="itemAmount[]"]')).map(input => parseFloat(input.value));
        
        const formData = {
            patientId: document.getElementById('billPatientId').value,
            billDate: document.getElementById('billDate').value,
            items: itemDescriptions.map((desc, index) => ({
                description: desc,
                amount: itemAmounts[index]
            })),
            totalAmount: document.getElementById('totalAmount').value,
            paymentStatus: document.getElementById('paymentStatus').value,
            paymentMethod: document.getElementById('paymentMethod').value
        };

        try {
            showLoadingOverlay();
            const response = await fetch('/api/bills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddBillModal();
                loadBills();
                updateDashboardStats();
                addBillForm.reset();
                showToast('Bill added successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to add bill'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error:', error);
            showToast('Network error. Please check your connection.', 'error');
            hideLoadingOverlay();
        }
    });
}

// Add Health Record Form Submission
if (addHealthRecordForm) {
    addHealthRecordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            patientId: document.getElementById('recordPatientId').value,
            doctorId: document.getElementById('recordDoctorId').value,
            diagnosis: document.getElementById('diagnosis').value,
            treatment: document.getElementById('treatment').value,
            notes: document.getElementById('notes').value
        };

        try {
            showLoadingOverlay();
            const response = await fetch('/api/health-records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddHealthRecordModal();
                loadHealthRecords();
                addHealthRecordForm.reset();
                showToast('Health record added successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to add health record'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error:', error);
            showToast('Network error. Please check your connection.', 'error');
            hideLoadingOverlay();
        }
    });
}

// Add Pharmacy Form Submission
if (addPharmacyForm) {
    addPharmacyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            drugName: document.getElementById('drugName').value,
            patientId: document.getElementById('pharmacyPatientId').value,
            dosage: document.getElementById('dosage').value,
            quantity: document.getElementById('quantity').value,
            price: document.getElementById('price').value,
            expiryDate: document.getElementById('expiryDate').value,
            notes: document.getElementById('notes').value
        };

        try {
            showLoadingOverlay();
            const response = await fetch('/api/pharmacy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddPharmacyModal();
                loadPharmacy();
                addPharmacyForm.reset();
                showToast('Medication added successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to add medication'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error:', error);
            showToast('Network error. Please check your connection.', 'error');
            hideLoadingOverlay();
        }
    });
}

// Add Doctor Form Submission
if (addDoctorForm) {
    addDoctorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('doctorFirstName').value,
            lastName: document.getElementById('doctorLastName').value,
            specialization: document.getElementById('specialization').value,
            phone: document.getElementById('doctorPhone').value,
            email: document.getElementById('doctorEmail').value,
            address: document.getElementById('doctorAddress').value,
            license: document.getElementById('doctorLicense').value
        };

        try {
            showLoadingOverlay();
            const response = await fetch('/api/doctors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddDoctorModal();
                loadDoctors();
                updateDashboardStats();
                addDoctorForm.reset();
                showToast('Doctor added successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to add doctor'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error:', error);
            showToast('Network error. Please check your connection.', 'error');
            hideLoadingOverlay();
        }
    });
}

// Add Prescription Form Submission
if (addPrescriptionForm) {
    addPrescriptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            patientId: document.getElementById('prescriptionPatientId').value,
            doctorId: document.getElementById('prescriptionDoctorId').value,
            drugName: document.getElementById('drugName').value,
            dosage: document.getElementById('prescriptionDosage').value,
            frequency: document.getElementById('frequency').value,
            duration: document.getElementById('duration').value,
            notes: document.getElementById('prescriptionNotes').value
        };

        try {
            showLoadingOverlay();
            const response = await fetch('/api/prescriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddPrescriptionModal();
                loadPrescriptions();
                updateDashboardStats();
                addPrescriptionForm.reset();
                showToast('Prescription added successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to add prescription'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error:', error);
            showToast('Network error. Please check your connection.', 'error');
            hideLoadingOverlay();
        }
    });
}

// Search Functionality
patientSearch.addEventListener('input', debounce(async (e) => {
    const searchTerm = e.target.value;
    await loadPatients(searchTerm);
}, 300));

if (doctorSearch) {
    doctorSearch.addEventListener('input', debounce(async (e) => {
        const searchTerm = e.target.value;
        await loadDoctors(searchTerm);
    }, 300));
}

if (prescriptionSearch) {
    prescriptionSearch.addEventListener('input', debounce(async (e) => {
        const searchTerm = e.target.value;
        await loadPrescriptions(searchTerm);
    }, 300));
}

// Reminder Filter
reminderFilter.addEventListener('change', async (e) => {
    const filter = e.target.value;
    await loadReminders(filter);
});

// New Event Listeners
if (nurseSearch) {
    nurseSearch.addEventListener('input', debounce(async (e) => {
        const searchTerm = e.target.value;
        await loadNurses(searchTerm);
    }, 300));
}

if (pharmacySearch) {
    pharmacySearch.addEventListener('input', debounce(async (e) => {
        const searchTerm = e.target.value;
        await loadPharmacy(searchTerm);
    }, 300));
}

if (roomStatusFilter) {
    roomStatusFilter.addEventListener('change', async (e) => {
        const status = e.target.value;
        await loadRooms(status);
    });
}

if (billStatusFilter) {
    billStatusFilter.addEventListener('change', async (e) => {
        const status = e.target.value;
        await loadBills(status);
    });
}

if (healthRecordSearch) {
    healthRecordSearch.addEventListener('input', debounce(async (e) => {
        const searchTerm = e.target.value;
        await loadHealthRecords(searchTerm);
    }, 300));
}

// Load Functions
async function loadPatients(searchTerm = '') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/patients?search=${searchTerm}`);
        const patients = await response.json();
        
        const tbody = patientsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (patients.length === 0) {
            // Show empty state
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <img src="https://cdn-icons-png.flaticon.com/512/3304/3304502.png" alt="No Patients" class="empty-state-illustration" style="max-width: 150px;">
                        <p>No patients found. Add a patient to get started!</p>
                    </td>
                </tr>
            `;
            hideLoadingOverlay();
            return;
        }
        
        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.Patient_ID}</td>
                <td>${patient.First_Name} ${patient.Last_Name}</td>
                <td>${formatDate(patient.DOB)}</td>
                <td>${patient.Gender}</td>
                <td>${patient.Phone_Number}</td>
                <td>
                    <button class="btn" onclick="viewPatient(${patient.Patient_ID})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" onclick="editPatient(${patient.Patient_ID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" onclick="deletePatient(${patient.Patient_ID})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading patients:', error);
        hideLoadingOverlay();
        showToast('Error loading patients', 'error');
    }
}

async function loadDoctors(searchTerm = '') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/doctors?search=${searchTerm}`);
        const doctors = await response.json();
        
        const tbody = doctorsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (doctors.length === 0) {
            // Show empty state
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <img src="https://cdn-icons-png.flaticon.com/512/3304/3304502.png" alt="No Doctors" class="empty-state-illustration" style="max-width: 150px;">
                        <p>No doctors found. Add a doctor to get started!</p>
                    </td>
                </tr>
            `;
            hideLoadingOverlay();
            return;
        }
        
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.Doctor_ID}</td>
                <td>${doctor.First_Name} ${doctor.Last_Name}</td>
                <td>${doctor.Specialization}</td>
                <td>${doctor.Phone_Number}</td>
                <td>
                    <button class="btn" onclick="viewDoctor(${doctor.Doctor_ID})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" onclick="editDoctor(${doctor.Doctor_ID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" onclick="deleteDoctor(${doctor.Doctor_ID})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading doctors:', error);
        hideLoadingOverlay();
        showToast('Error loading doctors', 'error');
    }
}

async function loadPrescriptions(searchTerm = '') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/prescriptions?search=${searchTerm}`);
        const prescriptions = await response.json();
        
        const tbody = prescriptionsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (prescriptions.length === 0) {
            // Show empty state
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <img src="https://cdn-icons-png.flaticon.com/512/3304/3304502.png" alt="No Prescriptions" class="empty-state-illustration" style="max-width: 150px;">
                        <p>No prescriptions found. Add a prescription to get started!</p>
                    </td>
                </tr>
            `;
            hideLoadingOverlay();
            return;
        }
        
        prescriptions.forEach(prescription => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prescription.Prescription_ID}</td>
                <td>${prescription.Patient_Name}</td>
                <td>${prescription.Doctor_Name}</td>
                <td>${prescription.Drug_Name}</td>
                <td>${prescription.Dosage}</td>
                <td>
                    <button class="btn" onclick="viewPrescription(${prescription.Prescription_ID})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" onclick="editPrescription(${prescription.Prescription_ID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" onclick="deletePrescription(${prescription.Prescription_ID})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading prescriptions:', error);
        hideLoadingOverlay();
        showToast('Error loading prescriptions', 'error');
    }
}

async function loadReminders(filter = 'all') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/reminders?filter=${filter}`);
        const reminders = await response.json();
        
        remindersList.innerHTML = '';
        
        if (reminders.length === 0) {
            // Show empty state with illustration
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <img src="https://cdn-icons-png.flaticon.com/512/3588/3588292.png" alt="No Reminders" class="empty-state-illustration">
                <p>No reminders found. Create a new reminder to get started!</p>
            `;
            remindersList.appendChild(emptyState);
            hideLoadingOverlay();
            return;
        }
        
        reminders.forEach(reminder => {
            // Calculate time remaining for the pill countdown
            const dueDate = new Date(reminder.Due_Date + ' ' + (reminder.Time_Time || '00:00:00'));
            const now = new Date();
            const timeRemaining = dueDate - now;
            
            // Calculate progress percentage (inverse - higher means closer to deadline)
            // Maximum 7 days ahead shown on timer
            const maxTimeAhead = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
            let progressPercentage = 100 - Math.min(100, Math.max(0, (timeRemaining / maxTimeAhead) * 100));
            let timeDisplay = '';
            let colorClass = '';
            
            if (timeRemaining < 0) {
                // Overdue
                progressPercentage = 100;
                colorClass = 'status-overdue';
                timeDisplay = 'Overdue';
            } else if (timeRemaining < 24 * 60 * 60 * 1000) {
                // Less than 24 hours - hours remaining
                const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000));
                timeDisplay = `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} remaining`;
                colorClass = 'status-warning';
            } else {
                // Days remaining
                const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60 * 1000));
                timeDisplay = `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
            }
            
            const reminderCard = document.createElement('div');
            reminderCard.className = 'reminder-card';
            reminderCard.innerHTML = `
                <div class="reminder-header">
                    <h3>${reminder.Message}</h3>
                    <span class="reminder-date">${formatDate(reminder.Due_Date)} ${reminder.Time_Time || ''}</span>
                </div>
                <div class="reminder-patient">
                    <i class="fas fa-user-injured"></i> ${reminder.Patient_Name}
                </div>
                
                <div class="pill-countdown ${colorClass}">
                    <div class="pill-icon">
                        <i class="fas fa-pills"></i>
                    </div>
                    <div class="pill-timer">
                        <div class="pill-progress" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="pill-time">${timeDisplay}</div>
                </div>
                
                <div class="reminder-actions">
                    <button class="btn" onclick="markReminderComplete(${reminder.Reminder_ID})">
                        <i class="fas fa-check"></i> Mark Complete
                    </button>
                    <button class="btn" onclick="editReminder(${reminder.Reminder_ID})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
                <img src="https://cdn-icons-png.flaticon.com/512/822/822092.png" alt="Medicine Reminder" class="reminder-illustration">
            `;
            remindersList.appendChild(reminderCard);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading reminders:', error);
        hideLoadingOverlay();
        showToast('Error loading reminders', 'error');
    }
}

async function loadNurses(searchTerm = '') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/nurses?search=${searchTerm}`);
        const nurses = await response.json();
        
        const tbody = nursesTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        nurses.forEach(nurse => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nurse.Nurse_ID}</td>
                <td>${nurse.First_Name} ${nurse.Last_Name}</td>
                <td>${nurse.Department}</td>
                <td>${nurse.Shift}</td>
                <td>${nurse.Phone_Number}</td>
                <td>
                    <button class="btn" onclick="viewNurse(${nurse.Nurse_ID})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" onclick="editNurse(${nurse.Nurse_ID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" onclick="deleteNurse(${nurse.Nurse_ID})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading nurses:', error);
        hideLoadingOverlay();
        showToast('Error loading nurses', 'error');
    }
}

async function loadRooms(status = '') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/rooms?status=${status}`);
        const rooms = await response.json();
        
        const tbody = roomsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        rooms.forEach(room => {
            // Add status class for styling
            let statusClass = '';
            if (room.Status === 'Available') statusClass = 'status-available';
            else if (room.Status === 'Occupied') statusClass = 'status-occupied';
            else if (room.Status === 'Maintenance') statusClass = 'status-maintenance';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.Room_Number}</td>
                <td>${room.Room_Type}</td>
                <td>${room.Floor}</td>
                <td><span class="status-badge ${statusClass}">${room.Status}</span></td>
                <td>${room.Capacity}</td>
                <td>
                    <button class="btn" onclick="viewRoom(${room.Room_ID})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" onclick="editRoom(${room.Room_ID}); document.getElementById('viewRoomModal').remove()">Edit</button>
                    <button class="btn" onclick="deleteRoom(${room.Room_ID})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading rooms:', error);
        hideLoadingOverlay();
        showToast('Error loading rooms', 'error');
    }
}

async function loadBills(status = '') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/bills?status=${status}`);
        const bills = await response.json();
        
        const tbody = billsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        bills.forEach(bill => {
            // Add status class for styling
            let statusClass = '';
            if (bill.Payment_Status === 'Paid') statusClass = 'status-paid';
            else if (bill.Payment_Status === 'Pending') statusClass = 'status-pending';
            else if (bill.Payment_Status === 'Overdue') statusClass = 'status-overdue';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bill.Bill_ID}</td>
                <td>${bill.Patient_Name}</td>
                <td>${formatDate(bill.Bill_Date)}</td>
                <td>$${parseFloat(bill.Total_Amount).toFixed(2)}</td>
                <td><span class="status-badge ${statusClass}">${bill.Payment_Status}</span></td>
                <td>
                    <button class="btn" onclick="viewBill(${bill.Bill_ID})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" onclick="updateBillStatus(${bill.Bill_ID}); document.getElementById('viewBillModal').remove()">Update Status</button>
                    <button class="btn primary" onclick="printBill(${bill.Bill_ID}); document.getElementById('viewBillModal').remove()">Print</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading bills:', error);
        hideLoadingOverlay();
        showToast('Error loading bills', 'error');
    }
}

async function loadHealthRecords(patientId = '') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/health-records?patientId=${patientId}`);
        const records = await response.json();
        
        const tbody = healthRecordsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.Record_ID}</td>
                <td>${record.Patient_Name}</td>
                <td>${record.Doctor_Name}</td>
                <td>${formatDate(record.Record_Date)}</td>
                <td>${record.Diagnosis.substring(0, 50)}${record.Diagnosis.length > 50 ? '...' : ''}</td>
                <td>
                    <button class="btn" onclick="viewHealthRecord(${record.Record_ID})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" onclick="editHealthRecord(${record.Record_ID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" onclick="printHealthRecord(${record.Record_ID})">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading health records:', error);
        hideLoadingOverlay();
        showToast('Error loading health records', 'error');
    }
}

// Generic function for loading patients into a select dropdown
async function loadPatientsForSelect(selectId = 'patientId') {
    try {
        const patientSelect = document.getElementById(selectId);
        if (!patientSelect) return;
        
        const response = await fetch('/api/patients');
        const patients = await response.json();
        
        // Clear current options except the first one
        while (patientSelect.options.length > 1) {
            patientSelect.remove(1);
        }
        
        // Add patient options
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.Patient_ID;
            option.textContent = `${patient.First_Name} ${patient.Last_Name}`;
            patientSelect.appendChild(option);
        });
    } catch (error) {
        console.error(`Error loading patients for select ${selectId}:`, error);
    }
}

// Generic function for loading doctors into a select dropdown
async function loadDoctorsForSelect(selectId = 'recordDoctorId') {
    try {
        const doctorSelect = document.getElementById(selectId);
        if (!doctorSelect) return;
        
        const response = await fetch('/api/doctors');
        const doctors = await response.json();
        
        // Clear current options except the first one
        while (doctorSelect.options.length > 1) {
            doctorSelect.remove(1);
        }
        
        // Add doctor options
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.Doctor_ID;
            option.textContent = `${doctor.First_Name} ${doctor.Last_Name} (${doctor.Specialization})`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error(`Error loading doctors for select ${selectId}:`, error);
    }
}

// Extend the dashboard stats function
async function updateDashboardStats() {
    try {
        const response = await fetch('/api/dashboard/stats');
        const stats = await response.json();
        
        totalPatientsElement.textContent = stats.totalPatients;
        activeDoctorsElement.textContent = stats.activeDoctors;
        pendingRemindersElement.textContent = stats.pendingReminders;
        activePrescriptionsElement.textContent = stats.activePrescriptions;
        
        // Add pulse animation to critical stats
        if (stats.pendingReminders > 5) {
            pendingRemindersElement.classList.add('pulse');
        } else {
            pendingRemindersElement.classList.remove('pulse');
        }
        
        // New stats
        if (activeNursesElement) activeNursesElement.textContent = stats.activeNurses || '0';
        if (pendingBillsElement) pendingBillsElement.textContent = stats.pendingBills || '0';
        
        // Add pulse to pending bills if critical
        if (stats.pendingBills > 10) {
            pendingBillsElement.classList.add('pulse');
        } else {
            pendingBillsElement.classList.remove('pulse');
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoadingOverlay() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.classList.add('active');
}

function hideLoadingOverlay() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.classList.remove('active');
}

function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Patient Actions
async function viewPatient(patientId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/patients/${patientId}`);
        const patient = await response.json();
        hideLoadingOverlay();

        // Create modal HTML
        const modalHTML = `
            <div id="viewPatientModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('viewPatientModal').remove()">&times;</span>
                    <h2>Patient Details</h2>
                    <div class="detail-view">
                        <div class="detail-row">
                            <div class="detail-label">ID:</div>
                            <div class="detail-value">${patient.Patient_ID}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Name:</div>
                            <div class="detail-value">${patient.First_Name} ${patient.Last_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Date of Birth:</div>
                            <div class="detail-value">${formatDate(patient.DOB)}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Gender:</div>
                            <div class="detail-value">${patient.Gender}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Phone:</div>
                            <div class="detail-value">${patient.Phone_Number}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Address:</div>
                            <div class="detail-value">${patient.Address || 'N/A'}</div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn" onclick="document.getElementById('viewPatientModal').remove()">Close</button>
                        <button type="button" class="btn primary" onclick="editPatient(${patient.Patient_ID}); document.getElementById('viewPatientModal').remove()">Edit</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('viewPatientModal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing patient:', error);
        hideLoadingOverlay();
        showToast('Error viewing patient details', 'error');
    }
}

async function editPatient(patientId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/patients/${patientId}`);
        const patient = await response.json();
        hideLoadingOverlay();

        // Create modal HTML with form
        const modalHTML = `
            <div id="editPatientModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('editPatientModal').remove()">&times;</span>
                    <h2>Edit Patient</h2>
                    <form id="editPatientForm">
                        <input type="hidden" id="editPatientId" value="${patient.Patient_ID}">
                        <div class="form-group">
                            <label for="editFirstName">First Name</label>
                            <input type="text" id="editFirstName" value="${patient.First_Name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editLastName">Last Name</label>
                            <input type="text" id="editLastName" value="${patient.Last_Name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editDob">Date of Birth</label>
                            <input type="date" id="editDob" value="${patient.DOB}" required>
                        </div>
                        <div class="form-group">
                            <label for="editGender">Gender</label>
                            <select id="editGender" required>
                                <option value="Male" ${patient.Gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${patient.Gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Other" ${patient.Gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editPhone">Phone Number</label>
                            <input type="tel" id="editPhone" value="${patient.Phone_Number}" required>
                        </div>
                        <div class="form-group">
                            <label for="editAddress">Address</label>
                            <textarea id="editAddress" rows="3">${patient.Address || ''}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="document.getElementById('editPatientModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('editPatientModal').style.display = 'block';

        // Add submit event listener to the form
        document.getElementById('editPatientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedPatient = {
                firstName: document.getElementById('editFirstName').value,
                lastName: document.getElementById('editLastName').value,
                dob: document.getElementById('editDob').value,
                gender: document.getElementById('editGender').value,
                phone: document.getElementById('editPhone').value,
                address: document.getElementById('editAddress').value
            };
            
            try {
                showLoadingOverlay();
                const response = await fetch(`/api/patients/${patientId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedPatient)
                });
                
                if (response.ok) {
                    // Close the modal
                    document.getElementById('editPatientModal').remove();
                    // Reload the patients list
                    loadPatients();
                    showToast('Patient updated successfully', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Error: ${errorData.error || 'Failed to update patient'}`, 'error');
                }
                hideLoadingOverlay();
            } catch (error) {
                console.error('Error updating patient:', error);
                hideLoadingOverlay();
                showToast('Network error. Please check your connection.', 'error');
            }
        });
    } catch (error) {
        console.error('Error editing patient:', error);
        hideLoadingOverlay();
        showToast('Error loading patient details for editing', 'error');
    }
}

async function deletePatient(patientId) {
    if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
        try {
            showLoadingOverlay();
            const response = await fetch(`/api/patients/${patientId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadPatients();
                updateDashboardStats();
                showToast('Patient deleted successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to delete patient'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error deleting patient:', error);
            hideLoadingOverlay();
            showToast('Error deleting patient', 'error');
        }
    }
}

// Doctor Actions
async function viewDoctor(doctorId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/doctors/${doctorId}`);
        const doctor = await response.json();
        hideLoadingOverlay();

        // Create modal HTML
        const modalHTML = `
            <div id="viewDoctorModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('viewDoctorModal').remove()">&times;</span>
                    <h2>Doctor Details</h2>
                    <div class="detail-view">
                        <div class="detail-row">
                            <div class="detail-label">ID:</div>
                            <div class="detail-value">${doctor.Doctor_ID}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Name:</div>
                            <div class="detail-value">${doctor.First_Name} ${doctor.Last_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Specialization:</div>
                            <div class="detail-value">${doctor.Specialization}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Phone:</div>
                            <div class="detail-value">${doctor.Phone_Number}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Email:</div>
                            <div class="detail-value">${doctor.Email || 'N/A'}</div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn" onclick="document.getElementById('viewDoctorModal').remove()">Close</button>
                        <button type="button" class="btn primary" onclick="editDoctor(${doctor.Doctor_ID}); document.getElementById('viewDoctorModal').remove()">Edit</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('viewDoctorModal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing doctor:', error);
        hideLoadingOverlay();
        showToast('Error viewing doctor details', 'error');
    }
}

async function editDoctor(doctorId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/doctors/${doctorId}`);
        const doctor = await response.json();
        hideLoadingOverlay();

        // Create modal HTML with form
        const modalHTML = `
            <div id="editDoctorModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('editDoctorModal').remove()">&times;</span>
                    <h2>Edit Doctor</h2>
                    <form id="editDoctorForm">
                        <input type="hidden" id="editDoctorId" value="${doctor.Doctor_ID}">
                        <div class="form-group">
                            <label for="editFirstName">First Name</label>
                            <input type="text" id="editFirstName" value="${doctor.First_Name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editLastName">Last Name</label>
                            <input type="text" id="editLastName" value="${doctor.Last_Name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editSpecialization">Specialization</label>
                            <input type="text" id="editSpecialization" value="${doctor.Specialization}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPhone">Phone Number</label>
                            <input type="tel" id="editPhone" value="${doctor.Phone_Number}" required>
                        </div>
                        <div class="form-group">
                            <label for="editEmail">Email</label>
                            <input type="email" id="editEmail" value="${doctor.Email || ''}">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="document.getElementById('editDoctorModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('editDoctorModal').style.display = 'block';

        // Add submit event listener to the form
        document.getElementById('editDoctorForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedDoctor = {
                firstName: document.getElementById('editFirstName').value,
                lastName: document.getElementById('editLastName').value,
                specialization: document.getElementById('editSpecialization').value,
                phone: document.getElementById('editPhone').value,
                email: document.getElementById('editEmail').value
            };
            
            try {
                showLoadingOverlay();
                const response = await fetch(`/api/doctors/${doctorId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedDoctor)
                });
                
                if (response.ok) {
                    // Close the modal
                    document.getElementById('editDoctorModal').remove();
                    // Reload the doctors list
                    loadDoctors();
                    showToast('Doctor updated successfully', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Error: ${errorData.error || 'Failed to update doctor'}`, 'error');
                }
                hideLoadingOverlay();
            } catch (error) {
                console.error('Error updating doctor:', error);
                hideLoadingOverlay();
                showToast('Network error. Please check your connection.', 'error');
            }
        });
    } catch (error) {
        console.error('Error editing doctor:', error);
        hideLoadingOverlay();
        showToast('Error loading doctor details for editing', 'error');
    }
}

async function deleteDoctor(doctorId) {
    if (confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
        try {
            showLoadingOverlay();
            const response = await fetch(`/api/doctors/${doctorId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadDoctors();
                updateDashboardStats();
                showToast('Doctor deleted successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to delete doctor'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error deleting doctor:', error);
            hideLoadingOverlay();
            showToast('Error deleting doctor', 'error');
        }
    }
}

// Prescription Actions
async function viewPrescription(prescriptionId) {
    try {
        const response = await fetch(`/api/prescriptions/${prescriptionId}`);
        const prescription = await response.json();
        // Implement view prescription details logic
        alert(`View Prescription: ${prescription.Prescription_ID}`);
    } catch (error) {
        console.error('Error viewing prescription:', error);
        showToast('Error viewing prescription details', 'error');
    }
}

async function editPrescription(prescriptionId) {
    try {
        const response = await fetch(`/api/prescriptions/${prescriptionId}`);
        const prescription = await response.json();
        // Implement edit prescription logic
        alert(`Edit Prescription: ${prescription.Prescription_ID}`);
    } catch (error) {
        console.error('Error editing prescription:', error);
        showToast('Error loading prescription details for editing', 'error');
    }
}

async function deletePrescription(prescriptionId) {
    if (confirm('Are you sure you want to delete this prescription?')) {
        try {
            const response = await fetch(`/api/prescriptions/${prescriptionId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadPrescriptions();
                updateDashboardStats();
                showToast('Prescription deleted successfully', 'success');
            } else {
                showToast('Error deleting prescription', 'error');
            }
        } catch (error) {
            console.error('Error deleting prescription:', error);
            showToast('Error deleting prescription', 'error');
        }
    }
}

// Reminder Actions
async function markReminderComplete(reminderId) {
    try {
        const response = await fetch(`/api/reminders/${reminderId}/complete`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            loadReminders(reminderFilter.value);
            updateDashboardStats();
            showToast('Reminder marked as complete', 'success');
        } else {
            showToast('Error updating reminder', 'error');
        }
    } catch (error) {
        console.error('Error marking reminder as complete:', error);
        showToast('Error updating reminder', 'error');
    }
}

async function editReminder(reminderId) {
    try {
        const response = await fetch(`/api/reminders/${reminderId}`);
        const reminder = await response.json();
        // Implement edit reminder logic
        alert(`Edit Reminder: ${reminder.Message}`);
    } catch (error) {
        console.error('Error editing reminder:', error);
        showToast('Error loading reminder details for editing', 'error');
    }
}

// Setup bill item handlers
function setupBillItemHandlers() {
    // Add item button
    const addItemBtn = document.getElementById('addItemBtn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            const billItems = document.getElementById('billItems');
            const newItem = document.createElement('div');
            newItem.className = 'bill-item';
            newItem.innerHTML = `
                <input type="text" name="itemDescription[]" placeholder="Description" required>
                <input type="number" name="itemAmount[]" placeholder="Amount" step="0.01" required>
                <button type="button" class="btn remove-item"><i class="fas fa-times"></i></button>
            `;
            billItems.appendChild(newItem);
            
            // Add event listener to the new remove button
            const removeBtn = newItem.querySelector('.remove-item');
            removeBtn.addEventListener('click', function() {
                billItems.removeChild(newItem);
                calculateBillTotal();
            });
            
            // Add event listener to amount field
            const amountField = newItem.querySelector('input[name="itemAmount[]"]');
            amountField.addEventListener('input', calculateBillTotal);
        });
    }
    
    // Add event listeners to existing remove buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const billItem = this.closest('.bill-item');
            billItem.parentNode.removeChild(billItem);
            calculateBillTotal();
        });
    });
    
    // Add event listeners to existing amount fields
    const amountFields = document.querySelectorAll('input[name="itemAmount[]"]');
    amountFields.forEach(field => {
        field.addEventListener('input', calculateBillTotal);
    });
    
    // Calculate initial total
    calculateBillTotal();
}

// Calculate bill total
function calculateBillTotal() {
    const amountFields = document.querySelectorAll('input[name="itemAmount[]"]');
    let total = 0;
    
    amountFields.forEach(field => {
        const amount = parseFloat(field.value) || 0;
        total += amount;
    });
    
    const totalField = document.getElementById('totalAmount');
    if (totalField) {
        totalField.value = total.toFixed(2);
    }
}

// New actions for nurses
async function viewNurse(nurseId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/nurses/${nurseId}`);
        const nurse = await response.json();
        hideLoadingOverlay();

        // Create modal HTML
        const modalHTML = `
            <div id="viewNurseModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('viewNurseModal').remove()">&times;</span>
                    <h2>Nurse Details</h2>
                    <div class="detail-view">
                        <div class="detail-row">
                            <div class="detail-label">ID:</div>
                            <div class="detail-value">${nurse.Nurse_ID}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Name:</div>
                            <div class="detail-value">${nurse.First_Name} ${nurse.Last_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Department:</div>
                            <div class="detail-value">${nurse.Department}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Phone:</div>
                            <div class="detail-value">${nurse.Phone_Number}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Email:</div>
                            <div class="detail-value">${nurse.Email || 'N/A'}</div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn" onclick="document.getElementById('viewNurseModal').remove()">Close</button>
                        <button type="button" class="btn primary" onclick="editNurse(${nurse.Nurse_ID}); document.getElementById('viewNurseModal').remove()">Edit</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('viewNurseModal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing nurse:', error);
        hideLoadingOverlay();
        showToast('Error viewing nurse details', 'error');
    }
}

async function editNurse(nurseId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/nurses/${nurseId}`);
        const nurse = await response.json();
        hideLoadingOverlay();

        // Create modal HTML with form
        const modalHTML = `
            <div id="editNurseModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('editNurseModal').remove()">&times;</span>
                    <h2>Edit Nurse</h2>
                    <form id="editNurseForm">
                        <input type="hidden" id="editNurseId" value="${nurse.Nurse_ID}">
                        <div class="form-group">
                            <label for="editFirstName">First Name</label>
                            <input type="text" id="editFirstName" value="${nurse.First_Name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editLastName">Last Name</label>
                            <input type="text" id="editLastName" value="${nurse.Last_Name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editDepartment">Department</label>
                            <input type="text" id="editDepartment" value="${nurse.Department}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPhone">Phone Number</label>
                            <input type="tel" id="editPhone" value="${nurse.Phone_Number}" required>
                        </div>
                        <div class="form-group">
                            <label for="editEmail">Email</label>
                            <input type="email" id="editEmail" value="${nurse.Email || ''}">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="document.getElementById('editNurseModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('editNurseModal').style.display = 'block';

        // Add submit event listener to the form
        document.getElementById('editNurseForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedNurse = {
                firstName: document.getElementById('editFirstName').value,
                lastName: document.getElementById('editLastName').value,
                department: document.getElementById('editDepartment').value,
                phone: document.getElementById('editPhone').value,
                email: document.getElementById('editEmail').value
            };
            
            try {
                showLoadingOverlay();
                const response = await fetch(`/api/nurses/${nurseId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedNurse)
                });
                
                if (response.ok) {
                    // Close the modal
                    document.getElementById('editNurseModal').remove();
                    // Reload the nurses list
                    loadNurses();
                    showToast('Nurse updated successfully', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Error: ${errorData.error || 'Failed to update nurse'}`, 'error');
                }
                hideLoadingOverlay();
            } catch (error) {
                console.error('Error updating nurse:', error);
                hideLoadingOverlay();
                showToast('Network error. Please check your connection.', 'error');
            }
        });
    } catch (error) {
        console.error('Error editing nurse:', error);
        hideLoadingOverlay();
        showToast('Error loading nurse details for editing', 'error');
    }
}

async function deleteNurse(nurseId) {
    if (confirm('Are you sure you want to delete this nurse? This action cannot be undone.')) {
        try {
            showLoadingOverlay();
            const response = await fetch(`/api/nurses/${nurseId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadNurses();
                updateDashboardStats();
                showToast('Nurse deleted successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to delete nurse'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error deleting nurse:', error);
            hideLoadingOverlay();
            showToast('Error deleting nurse', 'error');
        }
    }
}

// Room Actions
async function viewRoom(roomId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/rooms/${roomId}`);
        const room = await response.json();
        hideLoadingOverlay();

        // Create modal HTML
        const modalHTML = `
            <div id="viewRoomModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('viewRoomModal').remove()">&times;</span>
                    <h2>Room Details</h2>
                    <div class="detail-view">
                        <div class="detail-row">
                            <div class="detail-label">Room Number:</div>
                            <div class="detail-value">${room.Room_Number}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Type:</div>
                            <div class="detail-value">${room.Room_Type}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Capacity:</div>
                            <div class="detail-value">${room.Capacity}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Status:</div>
                            <div class="detail-value">${room.Status}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Rate per Day:</div>
                            <div class="detail-value">$${room.Rate_Per_Day}</div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn" onclick="document.getElementById('viewRoomModal').remove()">Close</button>
                        <button type="button" class="btn primary" onclick="editRoom(${room.Room_ID}); document.getElementById('viewRoomModal').remove()">Edit</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('viewRoomModal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing room:', error);
        hideLoadingOverlay();
        showToast('Error viewing room details', 'error');
    }
}

async function editRoom(roomId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/rooms/${roomId}`);
        const room = await response.json();
        hideLoadingOverlay();

        // Create modal HTML with form
        const modalHTML = `
            <div id="editRoomModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('editRoomModal').remove()">&times;</span>
                    <h2>Edit Room</h2>
                    <form id="editRoomForm">
                        <input type="hidden" id="editRoomId" value="${room.Room_ID}">
                        <div class="form-group">
                            <label for="editRoomNumber">Room Number</label>
                            <input type="text" id="editRoomNumber" value="${room.Room_Number}" required>
                        </div>
                        <div class="form-group">
                            <label for="editRoomType">Room Type</label>
                            <select id="editRoomType" required>
                                <option value="General" ${room.Room_Type === 'General' ? 'selected' : ''}>General</option>
                                <option value="Private" ${room.Room_Type === 'Private' ? 'selected' : ''}>Private</option>
                                <option value="Semi-Private" ${room.Room_Type === 'Semi-Private' ? 'selected' : ''}>Semi-Private</option>
                                <option value="ICU" ${room.Room_Type === 'ICU' ? 'selected' : ''}>ICU</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editCapacity">Capacity</label>
                            <input type="number" id="editCapacity" value="${room.Capacity}" min="1" required>
                        </div>
                        <div class="form-group">
                            <label for="editStatus">Status</label>
                            <select id="editStatus" required>
                                <option value="Available" ${room.Status === 'Available' ? 'selected' : ''}>Available</option>
                                <option value="Occupied" ${room.Status === 'Occupied' ? 'selected' : ''}>Occupied</option>
                                <option value="Maintenance" ${room.Status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editRate">Rate per Day ($)</label>
                            <input type="number" id="editRate" value="${room.Rate_Per_Day}" min="0" step="0.01" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="document.getElementById('editRoomModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('editRoomModal').style.display = 'block';

        // Add submit event listener to the form
        document.getElementById('editRoomForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedRoom = {
                roomNumber: document.getElementById('editRoomNumber').value,
                roomType: document.getElementById('editRoomType').value,
                capacity: parseInt(document.getElementById('editCapacity').value),
                status: document.getElementById('editStatus').value,
                ratePerDay: parseFloat(document.getElementById('editRate').value)
            };
            
            try {
                showLoadingOverlay();
                const response = await fetch(`/api/rooms/${roomId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedRoom)
                });
                
                if (response.ok) {
                    // Close the modal
                    document.getElementById('editRoomModal').remove();
                    // Reload the rooms list
                    loadRooms();
                    showToast('Room updated successfully', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Error: ${errorData.error || 'Failed to update room'}`, 'error');
                }
                hideLoadingOverlay();
            } catch (error) {
                console.error('Error updating room:', error);
                hideLoadingOverlay();
                showToast('Network error. Please check your connection.', 'error');
            }
        });
    } catch (error) {
        console.error('Error editing room:', error);
        hideLoadingOverlay();
        showToast('Error loading room details for editing', 'error');
    }
}

async function deleteRoom(roomId) {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
        try {
            showLoadingOverlay();
            const response = await fetch(`/api/rooms/${roomId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadRooms();
                updateDashboardStats();
                showToast('Room deleted successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to delete room'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error deleting room:', error);
            hideLoadingOverlay();
            showToast('Error deleting room', 'error');
        }
    }
}

// Bill Actions
async function viewBill(billId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/bills/${billId}`);
        const bill = await response.json();
        hideLoadingOverlay();

        // Create modal HTML
        const modalHTML = `
            <div id="viewBillModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('viewBillModal').remove()">&times;</span>
                    <h2>Bill Details</h2>
                    <div class="detail-view">
                        <div class="detail-row">
                            <div class="detail-label">Bill ID:</div>
                            <div class="detail-value">${bill.Bill_ID}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Patient:</div>
                            <div class="detail-value">${bill.Patient_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Date:</div>
                            <div class="detail-value">${formatDate(bill.Bill_Date)}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Total Amount:</div>
                            <div class="detail-value">$${bill.Total_Amount}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Status:</div>
                            <div class="detail-value">${bill.Status}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Items:</div>
                            <div class="detail-value">
                                <table class="items-table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${bill.Items.map(item => `
                                            <tr>
                                                <td>${item.Item_Name}</td>
                                                <td>${item.Quantity}</td>
                                                <td>$${item.Price}</td>
                                                <td>$${item.Total}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn" onclick="document.getElementById('viewBillModal').remove()">Close</button>
                        <button type="button" class="btn primary" onclick="editBill(${bill.Bill_ID}); document.getElementById('viewBillModal').remove()">Edit</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('viewBillModal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing bill:', error);
        hideLoadingOverlay();
        showToast('Error viewing bill details', 'error');
    }
}

async function editBill(billId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/bills/${billId}`);
        const bill = await response.json();
        hideLoadingOverlay();

        // Create modal HTML with form
        const modalHTML = `
            <div id="editBillModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('editBillModal').remove()">&times;</span>
                    <h2>Edit Bill</h2>
                    <form id="editBillForm">
                        <input type="hidden" id="editBillId" value="${bill.Bill_ID}">
                        <div class="form-group">
                            <label for="editPatientId">Patient</label>
                            <select id="editPatientId" required>
                                ${await getPatientOptions(bill.Patient_ID)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editBillDate">Bill Date</label>
                            <input type="date" id="editBillDate" value="${bill.Bill_Date}" required>
                        </div>
                        <div class="form-group">
                            <label for="editStatus">Status</label>
                            <select id="editStatus" required>
                                <option value="Pending" ${bill.Status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Paid" ${bill.Status === 'Paid' ? 'selected' : ''}>Paid</option>
                                <option value="Cancelled" ${bill.Status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Bill Items</label>
                            <div id="billItems">
                                ${await Promise.all(bill.Items.map(async (item, index) => `
                                    <div class="bill-item">
                                        <select class="item-select" required>
                                            ${await getItemOptions(item.Item_ID)}
                                        </select>
                                        <input type="number" class="item-quantity" value="${item.Quantity}" min="1" required>
                                        <input type="number" class="item-price" value="${item.Price}" min="0" step="0.01" required>
                                        <button type="button" class="btn danger" onclick="removeBillItem(this)">Remove</button>
                                    </div>
                                `))}
                            </div>
                            <button type="button" class="btn" onclick="addBillItem()">Add Item</button>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="document.getElementById('editBillModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('editBillModal').style.display = 'block';

        // Add submit event listener to the form
        document.getElementById('editBillForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const items = Array.from(document.querySelectorAll('.bill-item')).map(item => ({
                itemId: item.querySelector('.item-select').value,
                quantity: parseInt(item.querySelector('.item-quantity').value),
                price: parseFloat(item.querySelector('.item-price').value)
            }));
            
            const updatedBill = {
                patientId: document.getElementById('editPatientId').value,
                billDate: document.getElementById('editBillDate').value,
                status: document.getElementById('editStatus').value,
                items: items
            };
            
            try {
                showLoadingOverlay();
                const response = await fetch(`/api/bills/${billId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedBill)
                });
                
                if (response.ok) {
                    // Close the modal
                    document.getElementById('editBillModal').remove();
                    // Reload the bills list
                    loadBills();
                    showToast('Bill updated successfully', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Error: ${errorData.error || 'Failed to update bill'}`, 'error');
                }
                hideLoadingOverlay();
            } catch (error) {
                console.error('Error updating bill:', error);
                hideLoadingOverlay();
                showToast('Network error. Please check your connection.', 'error');
            }
        });
    } catch (error) {
        console.error('Error editing bill:', error);
        hideLoadingOverlay();
        showToast('Error loading bill details for editing', 'error');
    }
}

async function deleteBill(billId) {
    if (confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
        try {
            showLoadingOverlay();
            const response = await fetch(`/api/bills/${billId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadBills();
                updateDashboardStats();
                showToast('Bill deleted successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to delete bill'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error deleting bill:', error);
            hideLoadingOverlay();
            showToast('Error deleting bill', 'error');
        }
    }
}

// Helper functions for bill management
async function getPatientOptions(selectedId) {
    try {
        const response = await fetch('/api/patients');
        const patients = await response.json();
        return patients.map(patient => `
            <option value="${patient.Patient_ID}" ${patient.Patient_ID === selectedId ? 'selected' : ''}>
                ${patient.First_Name} ${patient.Last_Name}
            </option>
        `).join('');
    } catch (error) {
        console.error('Error fetching patients:', error);
        return '';
    }
}

async function getItemOptions(selectedId) {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        return items.map(item => `
            <option value="${item.Item_ID}" ${item.Item_ID === selectedId ? 'selected' : ''}>
                ${item.Item_Name} ($${item.Price})
            </option>
        `).join('');
    } catch (error) {
        console.error('Error fetching items:', error);
        return '';
    }
}

async function addBillItem() {
    const billItems = document.getElementById('billItems');
    const newItem = document.createElement('div');
    newItem.className = 'bill-item';
    
    // Get item options first
    const itemOptions = await getItemOptions();
    
    // Then set the innerHTML
    newItem.innerHTML = `
        <select class="item-select" required>
            ${itemOptions}
        </select>
        <input type="number" class="item-quantity" value="1" min="1" required>
        <input type="number" class="item-price" value="0.00" min="0" step="0.01" required>
        <button type="button" class="btn danger" onclick="removeBillItem(this)">Remove</button>
    `;
    billItems.appendChild(newItem);
}

function removeBillItem(button) {
    button.parentElement.remove();
}

// Health Record actions
async function viewHealthRecord(recordId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/health-records/${recordId}`);
        const record = await response.json();
        hideLoadingOverlay();

        // Create modal HTML
        const modalHTML = `
            <div id="viewHealthRecordModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('viewHealthRecordModal').remove()">&times;</span>
                    <h2>Health Record Details</h2>
                    <div class="detail-view">
                        <div class="detail-row">
                            <div class="detail-label">Record ID:</div>
                            <div class="detail-value">${record.Record_ID}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Patient:</div>
                            <div class="detail-value">${record.Patient_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Doctor:</div>
                            <div class="detail-value">${record.Doctor_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Date:</div>
                            <div class="detail-value">${formatDate(record.Record_Date)}</div>
                        </div>
                    </div>
                    
                    <h3>Diagnosis</h3>
                    <div class="record-text-block diagnosis-block">
                        ${record.Diagnosis}
                    </div>
                    
                    <h3>Treatment</h3>
                    <div class="record-text-block treatment-block">
                        ${record.Treatment}
                    </div>
                    
                    ${record.Notes ? `
                        <h3>Additional Notes</h3>
                        <div class="record-text-block notes-block">
                            ${record.Notes}
                        </div>
                    ` : ''}
                    
                    <div class="form-actions">
                        <button type="button" class="btn" onclick="document.getElementById('viewHealthRecordModal').remove()">Close</button>
                        <button type="button" class="btn" onclick="editHealthRecord(${record.Record_ID}); document.getElementById('viewHealthRecordModal').remove()">Edit</button>
                        <button type="button" class="btn primary" onclick="printHealthRecord(${record.Record_ID})">Print</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add some styles if not already in stylesheet
        if (!document.getElementById('health-record-styles')) {
            const styles = `
                <style id="health-record-styles">
                    .record-text-block {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 5px;
                        border-left: 4px solid #2196F3;
                        margin-bottom: 20px;
                        white-space: pre-line;
                    }
                    .diagnosis-block {
                        border-left-color: #FFC107;
                    }
                    .treatment-block {
                        border-left-color: #4CAF50;
                    }
                    .notes-block {
                        border-left-color: #9E9E9E;
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }

        // Show the modal
        document.getElementById('viewHealthRecordModal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing health record:', error);
        hideLoadingOverlay();
        showToast('Error viewing health record details', 'error');
    }
}

async function editHealthRecord(recordId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/health-records/${recordId}`);
        const record = await response.json();
        hideLoadingOverlay();

        // Create modal HTML with form
        const modalHTML = `
            <div id="editHealthRecordModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('editHealthRecordModal').remove()">&times;</span>
                    <h2>Edit Health Record</h2>
                    <form id="editHealthRecordForm">
                        <input type="hidden" id="editHealthRecordId" value="${record.Record_ID}">
                        <div class="form-group">
                            <label for="editPatientName">Patient Name</label>
                            <input type="text" id="editPatientName" value="${record.Patient_Name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editDiagnosis">Diagnosis</label>
                            <textarea id="editDiagnosis" required>${record.Diagnosis}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="editTreatment">Treatment</label>
                            <textarea id="editTreatment" required>${record.Treatment}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="editNotes">Notes</label>
                            <textarea id="editNotes">${record.Notes}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="document.getElementById('editHealthRecordModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('editHealthRecordModal').style.display = 'block';

        // Add submit event listener to the form
        document.getElementById('editHealthRecordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedRecord = {
                patientName: document.getElementById('editPatientName').value,
                diagnosis: document.getElementById('editDiagnosis').value,
                treatment: document.getElementById('editTreatment').value,
                notes: document.getElementById('editNotes').value
            };
            
            try {
                showLoadingOverlay();
                const response = await fetch(`/api/health-records/${recordId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedRecord)
                });
                
                if (response.ok) {
                    // Close the modal
                    document.getElementById('editHealthRecordModal').remove();
                    // Reload the health records list
                    loadHealthRecords();
                    showToast('Health record updated successfully', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Error: ${errorData.error || 'Failed to update health record'}`, 'error');
                }
                hideLoadingOverlay();
            } catch (error) {
                console.error('Error updating health record:', error);
                hideLoadingOverlay();
                showToast('Network error. Please check your connection.', 'error');
            }
        });
    } catch (error) {
        console.error('Error editing health record:', error);
        hideLoadingOverlay();
        showToast('Error loading health record details for editing', 'error');
    }
}

async function printHealthRecord(recordId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/health-records/${recordId}`);
        const record = await response.json();
        hideLoadingOverlay();

        // Create a new browser window for printing
        const printWindow = window.open('', '_blank');

        // Create professionally formatted health record HTML
        const printHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Health Record - ${record.Patient_Name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 80%;
                        margin: 20px auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .patient-info {
                        margin-bottom: 20px;
                    }
                    .patient-info h2 {
                        margin-top: 0;
                    }
                    }
                    .diagnosis, .treatment {
                        margin-bottom: 20px;
                    }
                    .notes {
                        margin-bottom: 20px;
                    }
                    .timestamp {
                        text-align: right;
                        font-size: 0.8em;
                        color: #888;
                    }
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://cdn-icons-png.flaticon.com/512/2776/2776015.png" alt="Hospital Logo">
                        <h1>Health Record</h1>
                    </div>
                    <div class="patient-info">
                        <h2>Patient Information</h2>
                        <p><strong>Name:</strong> ${record.Patient_Name}</p>
                        <p><strong>Record ID:</strong> ${record.Record_ID}</p>
                    </div>
                    <div class="diagnosis">
                        <h2>Diagnosis</h2>
                        <p>${record.Diagnosis}</p>
                    </div>
                    <div class="treatment">
                        <h2>Treatment</h2>
                        <p>${record.Treatment}</p>
                    </div>
                    <div class="notes">
                        <h2>Notes</h2>
                        <p>${record.Notes || 'N/A'}</p>
                    </div>
                    <div class="timestamp">
                        Printed on ${new Date().toLocaleString()}
                    </div>
                    <div class="no-print">
                        <button onclick="window.print()">Print</button>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Write the HTML to the new window
        printWindow.document.write(printHTML);

        // Automatically open the print dialog
        printWindow.print();
    } catch (error) {
        console.error('Error printing health record:', error);
        hideLoadingOverlay();
        showToast('Error printing health record', 'error');
    }
}

// Function to load today's schedule for dashboard
async function loadTodaySchedule() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/medical_schedule?date=${today}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch schedule data');
        }
        
        const schedules = await response.json();
        const scheduleList = document.getElementById('todayScheduleList');
        const emptyMessage = document.getElementById('todayScheduleEmpty');
        
        if (schedules.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (scheduleList) scheduleList.style.display = 'none';
            return;
        }
        
        if (emptyMessage) emptyMessage.style.display = 'none';
        if (scheduleList) {
            scheduleList.style.display = 'block';
            scheduleList.innerHTML = '';
            
            schedules.slice(0, 5).forEach(schedule => {
                const li = document.createElement('li');
                const time = new Date(`2000-01-01T${schedule.Appointment_Time}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                li.innerHTML = `
                    <strong>${time}</strong> - ${schedule.Patient_Name} with Dr. ${schedule.Doctor_Name}
                `;
                scheduleList.appendChild(li);
            });
            
            if (schedules.length > 5) {
                const li = document.createElement('li');
                li.innerHTML = `<em>And ${schedules.length - 5} more appointments...</em>`;
                scheduleList.appendChild(li);
            }
        }
    } catch (error) {
        console.error('Error loading today\'s schedule:', error);
    }
}

// Function to load critical reminders
async function loadCriticalReminders() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/reminders?filter=today`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch reminder data');
        }
        
        const reminders = await response.json();
        const remindersList = document.getElementById('criticalRemindersList');
        const emptyMessage = document.getElementById('criticalRemindersEmpty');
        
        if (reminders.length === 0) {
            if (emptyMessage) {
                emptyMessage.style.display = 'block';
                // Add illustration to empty state
                emptyMessage.innerHTML = `
                    <img src="https://cdn-icons-png.flaticon.com/512/3588/3588635.png" alt="No Critical Reminders" style="width: 80px; opacity: 0.7; margin-bottom: 1rem;">
                    <p>No critical reminders</p>
                `;
            }
            if (remindersList) remindersList.style.display = 'none';
            return;
        }
        
        if (emptyMessage) emptyMessage.style.display = 'none';
        if (remindersList) {
            remindersList.style.display = 'block';
            remindersList.innerHTML = '';
            
            reminders.slice(0, 5).forEach(reminder => {
                const li = document.createElement('li');
                const time = reminder.Time_Time ? new Date(`2000-01-01T${reminder.Time_Time}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'All day';
                
                li.innerHTML = `
                    <strong>${time}</strong> - ${reminder.Patient_Name}: ${reminder.Message}
                `;
                remindersList.appendChild(li);
            });
            
            if (reminders.length > 5) {
                const li = document.createElement('li');
                li.innerHTML = `<em>And ${reminders.length - 5} more reminders...</em>`;
                remindersList.appendChild(li);
            }
        }
    } catch (error) {
        console.error('Error loading critical reminders:', error);
    }
}

// Pharmacy actions
async function viewPharmacyItem(itemId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/pharmacy/${itemId}`);
        const item = await response.json();
        hideLoadingOverlay();

        // Create modal HTML
        const modalHTML = `
            <div id="viewPharmacyItemModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('viewPharmacyItemModal').remove()">&times;</span>
                    <h2>Medication Details</h2>
                    <div class="detail-view">
                        <div class="detail-row">
                            <div class="detail-label">ID:</div>
                            <div class="detail-value">${item.Pharmacy_ID}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Name:</div>
                            <div class="detail-value">${item.Drug_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Patient:</div>
                            <div class="detail-value">${item.Patient_Name || 'N/A'}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Dosage:</div>
                            <div class="detail-value">${item.Dosage}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Quantity:</div>
                            <div class="detail-value">${item.Quantity}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Price:</div>
                            <div class="detail-value">$${parseFloat(item.Price).toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn" onclick="document.getElementById('viewPharmacyItemModal').remove()">Close</button>
                        <button type="button" class="btn primary" onclick="editPharmacyItem(${item.Pharmacy_ID}); document.getElementById('viewPharmacyItemModal').remove()">Edit</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('viewPharmacyItemModal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing pharmacy item:', error);
        hideLoadingOverlay();
        showToast('Error viewing medication details', 'error');
    }
}

async function editPharmacyItem(itemId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/pharmacy/${itemId}`);
        const item = await response.json();
        hideLoadingOverlay();

        // Create modal HTML with form
        const modalHTML = `
            <div id="editPharmacyItemModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('editPharmacyItemModal').remove()">&times;</span>
                    <h2>Edit Medication</h2>
                    <form id="editPharmacyItemForm">
                        <input type="hidden" id="editPharmacyItemId" value="${item.Pharmacy_ID}">
                        <div class="form-group">
                            <label for="editDrugName">Drug Name</label>
                            <input type="text" id="editDrugName" value="${item.Drug_Name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPatientId">Patient</label>
                            <select id="editPatientId" required>
                                <option value="">Select Patient</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editDosage">Dosage</label>
                            <input type="text" id="editDosage" value="${item.Dosage}" required>
                        </div>
                        <div class="form-group">
                            <label for="editQuantity">Quantity</label>
                            <input type="number" id="editQuantity" value="${item.Quantity}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPrice">Price</label>
                            <input type="number" id="editPrice" value="${item.Price}" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="document.getElementById('editPharmacyItemModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('editPharmacyItemModal').style.display = 'block';

        // Populate patient select options
        const patientSelect = document.getElementById('editPatientId');
        loadPatientsForSelect(patientSelect, item.Patient_ID);

        // Add submit event listener to the form
        document.getElementById('editPharmacyItemForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedItem = {
                drugName: document.getElementById('editDrugName').value,
                patientId: document.getElementById('editPatientId').value,
                dosage: document.getElementById('editDosage').value,
                quantity: document.getElementById('editQuantity').value,
                price: document.getElementById('editPrice').value
            };
            
            try {
                showLoadingOverlay();
                const response = await fetch(`/api/pharmacy/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedItem)
                });
                
                if (response.ok) {
                    // Close the modal
                    document.getElementById('editPharmacyItemModal').remove();
                    // Reload the pharmacy items list
                    loadPharmacy();
                    showToast('Medication updated successfully', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Error: ${errorData.error || 'Failed to update medication'}`, 'error');
                }
                hideLoadingOverlay();
            } catch (error) {
                console.error('Error updating pharmacy item:', error);
                hideLoadingOverlay();
                showToast('Network error. Please check your connection.', 'error');
            }
        });
    } catch (error) {
        console.error('Error editing pharmacy item:', error);
        hideLoadingOverlay();
        showToast('Error loading medication details for editing', 'error');
    }
}

async function deletePharmacyItem(itemId) {
    if (confirm('Are you sure you want to delete this medication?')) {
        try {
            showLoadingOverlay();
            const response = await fetch(`/api/pharmacy/${itemId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadPharmacy();
                showToast('Medication deleted successfully', 'success');
            } else {
                showToast('Error deleting medication', 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error deleting pharmacy item:', error);
            hideLoadingOverlay();
            showToast('Error deleting medication', 'error');
        }
    }
}

// Add to document load event
document.addEventListener('DOMContentLoaded', async () => {
    // Check if this is the first visit and redirect to intro page if needed
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore && window.location.pathname.indexOf('intro.html') === -1) {
        localStorage.setItem('hasVisitedBefore', 'true');
        window.location.href = 'intro.html';
        return;
    }
    
    try {
        showLoadingOverlay();
        await Promise.all([
            loadPatients(),
            loadReminders(),
            updateDashboardStats(),
            loadDoctors(),
            loadPrescriptions(),
            // New entities
            loadNurses(),
            loadRooms(),
            loadBills(),
            loadHealthRecords(),
            loadPharmacy(),
            // Dashboard enhancements
            loadTodaySchedule(),
            loadCriticalReminders()
        ]);
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error during initial load:', error);
        hideLoadingOverlay();
        showToast('Error loading application data', 'error');
    }
    
    // Add animation classes to stat cards for staggered entrance
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animated');
        }, 100 * index);
    });
});

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    
    document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

async function loadPharmacy(searchTerm = '') {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/pharmacy?search=${searchTerm}`);
        const medications = await response.json();
        
        const tbody = pharmacyTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (medications.length === 0) {
            // Show empty state
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <img src="https://cdn-icons-png.flaticon.com/512/3304/3304502.png" alt="No Medications" class="empty-state-illustration" style="max-width: 150px;">
                        <p>No medications found. Add a medication to get started!</p>
                    </td>
                </tr>
            `;
            hideLoadingOverlay();
            return;
        }
        
        medications.forEach(med => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${med.Pharmacy_ID}</td>
                <td>${med.Drug_Name}</td>
                <td>${med.Patient_Name || 'N/A'}</td>
                <td>${med.Dosage}</td>
                <td>${med.Quantity}</td>
                <td>$${parseFloat(med.Price).toFixed(2)}</td>
                <td>
                    <button class="btn" onclick="viewPharmacyItem(${med.Pharmacy_ID})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn" onclick="editPharmacyItem(${med.Pharmacy_ID})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" onclick="deletePharmacyItem(${med.Pharmacy_ID})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        hideLoadingOverlay();
    } catch (error) {
        console.error('Error loading pharmacy items:', error);
        hideLoadingOverlay();
        showToast('Error loading pharmacy data', 'error');
    }
}

// Add event listener for the "Add Item" button
document.getElementById('addBillItemBtn')?.addEventListener('click', async () => {
    await addBillItem();
});

async function addBillItem() {
    const billItems = document.getElementById('billItems');
    const newItem = document.createElement('div');
    newItem.className = 'bill-item';
    
    // Get item options first
    const itemOptions = await getItemOptions();
    
    // Then set the innerHTML
    newItem.innerHTML = `
        <select class="item-select" required>
            ${itemOptions}
        </select>
        <input type="number" class="item-quantity" value="1" min="1" required>
        <input type="number" class="item-price" value="0.00" min="0" step="0.01" required>
        <button type="button" class="btn danger" onclick="removeBillItem(this)">Remove</button>
    `;
    billItems.appendChild(newItem);
}

// Health Record Actions
async function viewRecord(recordId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/health-records/${recordId}`);
        const record = await response.json();
        hideLoadingOverlay();

        // Create modal HTML
        const modalHTML = `
            <div id="viewRecordModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('viewRecordModal').remove()">&times;</span>
                    <h2>Health Record Details</h2>
                    <div class="detail-view">
                        <div class="detail-row">
                            <div class="detail-label">Record ID:</div>
                            <div class="detail-value">${record.Record_ID}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Patient:</div>
                            <div class="detail-value">${record.Patient_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Doctor:</div>
                            <div class="detail-value">${record.Doctor_Name}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Date:</div>
                            <div class="detail-value">${formatDate(record.Record_Date)}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Diagnosis:</div>
                            <div class="detail-value">${record.Diagnosis}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Treatment:</div>
                            <div class="detail-value">${record.Treatment}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Notes:</div>
                            <div class="detail-value">${record.Notes || 'N/A'}</div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn" onclick="document.getElementById('viewRecordModal').remove()">Close</button>
                        <button type="button" class="btn primary" onclick="editRecord(${record.Record_ID}); document.getElementById('viewRecordModal').remove()">Edit</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('viewRecordModal').style.display = 'block';
    } catch (error) {
        console.error('Error viewing health record:', error);
        hideLoadingOverlay();
        showToast('Error viewing health record details', 'error');
    }
}

async function editRecord(recordId) {
    try {
        showLoadingOverlay();
        const response = await fetch(`/api/health-records/${recordId}`);
        const record = await response.json();
        hideLoadingOverlay();

        // Create modal HTML with form
        const modalHTML = `
            <div id="editRecordModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('editRecordModal').remove()">&times;</span>
                    <h2>Edit Health Record</h2>
                    <form id="editRecordForm">
                        <input type="hidden" id="editRecordId" value="${record.Record_ID}">
                        <div class="form-group">
                            <label for="editPatientId">Patient</label>
                            <select id="editPatientId" required>
                                ${await getPatientOptions(record.Patient_ID)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editDoctorId">Doctor</label>
                            <select id="editDoctorId" required>
                                ${await getDoctorOptions(record.Doctor_ID)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editRecordDate">Record Date</label>
                            <input type="date" id="editRecordDate" value="${record.Record_Date}" required>
                        </div>
                        <div class="form-group">
                            <label for="editDiagnosis">Diagnosis</label>
                            <textarea id="editDiagnosis" rows="3" required>${record.Diagnosis}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="editTreatment">Treatment</label>
                            <textarea id="editTreatment" rows="3" required>${record.Treatment}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="editNotes">Notes</label>
                            <textarea id="editNotes" rows="3">${record.Notes || ''}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn" onclick="document.getElementById('editRecordModal').remove()">Cancel</button>
                            <button type="submit" class="btn primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show the modal
        document.getElementById('editRecordModal').style.display = 'block';

        // Add submit event listener to the form
        document.getElementById('editRecordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedRecord = {
                patientId: document.getElementById('editPatientId').value,
                doctorId: document.getElementById('editDoctorId').value,
                recordDate: document.getElementById('editRecordDate').value,
                diagnosis: document.getElementById('editDiagnosis').value,
                treatment: document.getElementById('editTreatment').value,
                notes: document.getElementById('editNotes').value
            };
            
            try {
                showLoadingOverlay();
                const response = await fetch(`/api/health-records/${recordId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedRecord)
                });
                
                if (response.ok) {
                    // Close the modal
                    document.getElementById('editRecordModal').remove();
                    // Reload the health records list
                    loadHealthRecords();
                    showToast('Health record updated successfully', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Error: ${errorData.error || 'Failed to update health record'}`, 'error');
                }
                hideLoadingOverlay();
            } catch (error) {
                console.error('Error updating health record:', error);
                hideLoadingOverlay();
                showToast('Network error. Please check your connection.', 'error');
            }
        });
    } catch (error) {
        console.error('Error editing health record:', error);
        hideLoadingOverlay();
        showToast('Error loading health record details for editing', 'error');
    }
}

async function deleteRecord(recordId) {
    if (confirm('Are you sure you want to delete this health record? This action cannot be undone.')) {
        try {
            showLoadingOverlay();
            const response = await fetch(`/api/health-records/${recordId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadHealthRecords();
                updateDashboardStats();
                showToast('Health record deleted successfully', 'success');
            } else {
                const errorData = await response.json();
                showToast(`Error: ${errorData.error || 'Failed to delete health record'}`, 'error');
            }
            hideLoadingOverlay();
        } catch (error) {
            console.error('Error deleting health record:', error);
            hideLoadingOverlay();
            showToast('Error deleting health record', 'error');
        }
    }
}

// Helper function for doctor options
async function getDoctorOptions(selectedId) {
    try {
        const response = await fetch('/api/doctors');
        const doctors = await response.json();
        return doctors.map(doctor => `
            <option value="${doctor.Doctor_ID}" ${doctor.Doctor_ID === selectedId ? 'selected' : ''}>
                ${doctor.First_Name} ${doctor.Last_Name} (${doctor.Specialization})
            </option>
        `).join('');
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return '';
    }
} 