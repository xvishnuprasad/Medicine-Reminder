const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'Medicine_Reminder'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API Routes

// Patients
app.get('/api/patients', (req, res) => {
    const searchTerm = req.query.search || '';
    const query = `
        SELECT * FROM patient 
        WHERE First_Name LIKE ? OR Last_Name LIKE ?
        ORDER BY Patient_ID DESC
    `;
    db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error fetching patients:', err);
            return res.status(500).json({ error: 'Failed to fetch patients' });
        }
        res.json(results);
    });
});

app.get('/api/patients/:id', (req, res) => {
    const query = 'SELECT * FROM patient WHERE Patient_ID = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching patient:', err);
            return res.status(500).json({ error: 'Failed to fetch patient' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(results[0]);
    });
});

app.post('/api/patients', (req, res) => {
    const { firstName, lastName, dob, gender, phone, address } = req.body;
    const query = `
        INSERT INTO patient (First_Name, Last_Name, DOB, Gender, Phone_Number, Address) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [firstName, lastName, dob, gender, phone, address], (err, result) => {
        if (err) {
            console.error('Error adding patient:', err);
            return res.status(500).json({ error: 'Failed to add patient' });
        }
        res.status(201).json({ id: result.insertId, message: 'Patient added successfully' });
    });
});

app.delete('/api/patients/:id', (req, res) => {
    const query = 'DELETE FROM patient WHERE Patient_ID = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting patient:', err);
            return res.status(500).json({ error: 'Failed to delete patient' });
        }
        res.json({ message: 'Patient deleted successfully' });
    });
});

// Doctors
app.get('/api/doctors', (req, res) => {
    const searchTerm = req.query.search || '';
    const query = `
        SELECT * FROM doctor 
        WHERE First_Name LIKE ? OR Last_Name LIKE ? OR Specialization LIKE ?
        ORDER BY Doctor_ID DESC
    `;
    db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error fetching doctors:', err);
            return res.status(500).json({ error: 'Failed to fetch doctors' });
        }
        res.json(results);
    });
});

app.get('/api/doctors/:id', (req, res) => {
    const query = 'SELECT * FROM doctor WHERE Doctor_ID = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching doctor:', err);
            return res.status(500).json({ error: 'Failed to fetch doctor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json(results[0]);
    });
});

app.post('/api/doctors', (req, res) => {
    const { firstName, lastName, specialization, phone, email, address, license } = req.body;
    const query = `
        INSERT INTO doctor (First_Name, Last_Name, Specialization, Phone_Number) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [firstName, lastName, specialization, phone], (err, result) => {
        if (err) {
            console.error('Error adding doctor:', err);
            return res.status(500).json({ error: 'Failed to add doctor' });
        }
        res.status(201).json({ id: result.insertId, message: 'Doctor added successfully' });
    });
});

app.delete('/api/doctors/:id', (req, res) => {
    const query = 'DELETE FROM doctor WHERE Doctor_ID = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting doctor:', err);
            return res.status(500).json({ error: 'Failed to delete doctor' });
        }
        res.json({ message: 'Doctor deleted successfully' });
    });
});

// Prescriptions
app.get('/api/prescriptions', (req, res) => {
    const searchTerm = req.query.search || '';
    const query = `
        SELECT p.Prescription_ID, p.Dosage, p.Instructions,
               p.Issue_Date, p.End_Date, ms.Schedule_ID,
               pt.Patient_ID, CONCAT(pt.First_Name, ' ', pt.Last_Name) AS Patient_Name,
               d.Doctor_ID, CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name,
               ph.Drug_Name
        FROM prescription p
        JOIN medical_schedule ms ON p.Schedule_ID = ms.Schedule_ID
        JOIN patient pt ON ms.Patient_ID = pt.Patient_ID
        JOIN doctor d ON ms.Doctor_ID = d.Doctor_ID
        LEFT JOIN pharmacy ph ON p.Prescription_ID = ph.Prescription_ID
        WHERE pt.First_Name LIKE ? OR pt.Last_Name LIKE ? OR ph.Drug_Name LIKE ?
        ORDER BY p.Prescription_ID DESC
    `;
    db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error fetching prescriptions:', err);
            return res.status(500).json({ error: 'Failed to fetch prescriptions' });
        }
        res.json(results);
    });
});

app.get('/api/prescriptions/:id', (req, res) => {
    const query = `
        SELECT p.*, 
               CONCAT(pt.First_Name, ' ', pt.Last_Name) AS Patient_Name,
               CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name,
               ph.Drug_Name
        FROM prescription p
        JOIN medical_schedule ms ON p.Schedule_ID = ms.Schedule_ID
        JOIN patient pt ON ms.Patient_ID = pt.Patient_ID
        JOIN doctor d ON ms.Doctor_ID = d.Doctor_ID
        LEFT JOIN pharmacy ph ON p.Prescription_ID = ph.Prescription_ID
        WHERE p.Prescription_ID = ?
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching prescription:', err);
            return res.status(500).json({ error: 'Failed to fetch prescription' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Prescription not found' });
        }
        res.json(results[0]);
    });
});

app.post('/api/prescriptions', (req, res) => {
    const { patientId, doctorId, drugName, dosage, frequency, duration, notes } = req.body;
    
    // First, create a medical schedule entry
    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const scheduleQuery = `
            INSERT INTO medical_schedule (Patient_ID, Doctor_ID, Appointment_Date, Status)
            VALUES (?, ?, CURDATE(), 'Scheduled')
        `;
        
        db.query(scheduleQuery, [patientId, doctorId], (err, scheduleResult) => {
            if (err) {
                db.rollback(() => {
                    console.error('Error creating schedule:', err);
                    return res.status(500).json({ error: 'Failed to create schedule' });
                });
                return;
            }

            const scheduleId = scheduleResult.insertId;
            
            // Calculate end date based on duration
            const endDateQuery = `
                SELECT DATE_ADD(CURDATE(), INTERVAL ? DAY) AS end_date
            `;
            
            db.query(endDateQuery, [duration], (err, dateResults) => {
                if (err) {
                    db.rollback(() => {
                        console.error('Error calculating end date:', err);
                        return res.status(500).json({ error: 'Failed to calculate prescription dates' });
                    });
                    return;
                }
                
                const endDate = dateResults[0].end_date;
                
                // Create prescription
                const prescriptionQuery = `
                    INSERT INTO prescription (Schedule_ID, Dosage, Instructions, Issue_Date, End_Date)
                    VALUES (?, ?, ?, CURDATE(), ?)
                `;
                
                const dosageInfo = `${dosage} ${frequency}`;
                
                db.query(prescriptionQuery, [scheduleId, dosageInfo, notes, endDate], (err, prescriptionResult) => {
                    if (err) {
                        db.rollback(() => {
                            console.error('Error creating prescription:', err);
                            return res.status(500).json({ error: 'Failed to create prescription' });
                        });
                        return;
                    }
                    
                    const prescriptionId = prescriptionResult.insertId;
                    
                    // Create pharmacy entry for the medication
                    const pharmacyQuery = `
                        INSERT INTO pharmacy (Prescription_ID, Drug_Name, Quantity, Price, Dispensed_Date)
                        VALUES (?, ?, 30, 0.00, CURDATE())
                    `;
                    
                    db.query(pharmacyQuery, [prescriptionId, drugName], (err, pharmacyResult) => {
                        if (err) {
                            db.rollback(() => {
                                console.error('Error creating pharmacy entry:', err);
                                return res.status(500).json({ error: 'Failed to create pharmacy entry' });
                            });
                            return;
                        }
                        
                        db.commit(err => {
                            if (err) {
                                db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    return res.status(500).json({ error: 'Failed to commit transaction' });
                                });
                                return;
                            }
                            
                            res.status(201).json({ 
                                id: prescriptionId, 
                                message: 'Prescription added successfully' 
                            });
                        });
                    });
                });
            });
        });
    });
});

app.delete('/api/prescriptions/:id', (req, res) => {
    // Get the prescription first to find related records
    const getQuery = 'SELECT * FROM prescription WHERE Prescription_ID = ?';
    
    db.query(getQuery, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching prescription:', err);
            return res.status(500).json({ error: 'Failed to fetch prescription' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Prescription not found' });
        }
        
        const scheduleId = results[0].Schedule_ID;
        
        // Delete in correct order to maintain referential integrity
        db.beginTransaction(err => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            // First delete from pharmacy
            const deletePharmacyQuery = 'DELETE FROM pharmacy WHERE Prescription_ID = ?';
            db.query(deletePharmacyQuery, [req.params.id], (err) => {
                if (err) {
                    db.rollback(() => {
                        console.error('Error deleting pharmacy entries:', err);
                        return res.status(500).json({ error: 'Failed to delete prescription' });
                    });
                    return;
                }
                
                // Then delete the prescription
                const deletePrescriptionQuery = 'DELETE FROM prescription WHERE Prescription_ID = ?';
                db.query(deletePrescriptionQuery, [req.params.id], (err) => {
                    if (err) {
                        db.rollback(() => {
                            console.error('Error deleting prescription:', err);
                            return res.status(500).json({ error: 'Failed to delete prescription' });
                        });
                        return;
                    }
                    
                    // Finally delete the schedule
                    const deleteScheduleQuery = 'DELETE FROM medical_schedule WHERE Schedule_ID = ?';
                    db.query(deleteScheduleQuery, [scheduleId], (err) => {
                        if (err) {
                            db.rollback(() => {
                                console.error('Error deleting schedule:', err);
                                return res.status(500).json({ error: 'Failed to delete prescription' });
                            });
                            return;
                        }
                        
                        db.commit(err => {
                            if (err) {
                                db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    return res.status(500).json({ error: 'Failed to delete prescription' });
                                });
                                return;
                            }
                            
                            res.json({ message: 'Prescription deleted successfully' });
                        });
                    });
                });
            });
        });
    });
});

// Reminders
app.get('/api/reminders', (req, res) => {
    const filter = req.query.filter || 'all';
    let query;
    
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    switch (filter) {
        case 'today':
            query = `
                SELECT r.*, CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name
                FROM reminder r
                JOIN patient p ON r.Patient_ID = p.Patient_ID
                WHERE r.Due_Date = ? AND r.Status = 'Pending'
                ORDER BY r.Time_Time
            `;
            db.query(query, [today], (err, results) => {
                if (err) {
                    console.error('Error fetching reminders:', err);
                    return res.status(500).json({ error: 'Failed to fetch reminders' });
                }
                res.json(results);
            });
            break;
        case 'thisWeek':
            query = `
                SELECT r.*, CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name
                FROM reminder r
                JOIN patient p ON r.Patient_ID = p.Patient_ID
                WHERE r.Due_Date BETWEEN ? AND ? AND r.Status = 'Pending'
                ORDER BY r.Due_Date, r.Time_Time
            `;
            db.query(query, [today, nextWeekStr], (err, results) => {
                if (err) {
                    console.error('Error fetching reminders:', err);
                    return res.status(500).json({ error: 'Failed to fetch reminders' });
                }
                res.json(results);
            });
            break;
        case 'overdue':
            query = `
                SELECT r.*, CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name
                FROM reminder r
                JOIN patient p ON r.Patient_ID = p.Patient_ID
                WHERE r.Due_Date < ? AND r.Status = 'Pending'
                ORDER BY r.Due_Date, r.Time_Time
            `;
            db.query(query, [today], (err, results) => {
                if (err) {
                    console.error('Error fetching reminders:', err);
                    return res.status(500).json({ error: 'Failed to fetch reminders' });
                }
                res.json(results);
            });
            break;
        default:
            query = `
                SELECT r.*, CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name
                FROM reminder r
                JOIN patient p ON r.Patient_ID = p.Patient_ID
                WHERE r.Status = 'Pending'
                ORDER BY r.Due_Date, r.Time_Time
            `;
            db.query(query, [], (err, results) => {
                if (err) {
                    console.error('Error fetching reminders:', err);
                    return res.status(500).json({ error: 'Failed to fetch reminders' });
                }
                res.json(results);
            });
            break;
    }
});

app.post('/api/reminders', (req, res) => {
    const { patientId, message, dueDate, reminderTime } = req.body;
    const query = `
        INSERT INTO reminder (Patient_ID, Message, Due_Date, Time_Time, Status) 
        VALUES (?, ?, ?, ?, 'Pending')
    `;
    db.query(query, [patientId, message, dueDate, reminderTime], (err, result) => {
        if (err) {
            console.error('Error adding reminder:', err);
            return res.status(500).json({ error: 'Failed to add reminder' });
        }
        res.status(201).json({ id: result.insertId, message: 'Reminder added successfully' });
    });
});

app.put('/api/reminders/:id/complete', (req, res) => {
    const query = `
        UPDATE reminder 
        SET Status = 'Completed' 
        WHERE Reminder_ID = ?
    `;
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error updating reminder:', err);
            return res.status(500).json({ error: 'Failed to update reminder' });
        }
        res.json({ message: 'Reminder marked as complete' });
    });
});

// Nurses
app.get('/api/nurses', (req, res) => {
    const searchTerm = req.query.search || '';
    const query = `
        SELECT * FROM nurse 
        WHERE First_Name LIKE ? OR Last_Name LIKE ? OR Department LIKE ?
        ORDER BY Nurse_ID DESC
    `;
    db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error fetching nurses:', err);
            return res.status(500).json({ error: 'Failed to fetch nurses' });
        }
        res.json(results);
    });
});

app.post('/api/nurses', (req, res) => {
    const { firstName, lastName, department, phone, shift } = req.body;
    const query = `
        INSERT INTO nurse (First_Name, Last_Name, Department, Phone_Number, Shift) 
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [firstName, lastName, department, phone, shift], (err, result) => {
        if (err) {
            console.error('Error adding nurse:', err);
            return res.status(500).json({ error: 'Failed to add nurse' });
        }
        res.status(201).json({ id: result.insertId, message: 'Nurse added successfully' });
    });
});

// Rooms
app.get('/api/rooms', (req, res) => {
    const status = req.query.status || '';
    let query;
    
    if (status) {
        query = `
            SELECT * FROM room 
            WHERE Status = ?
            ORDER BY Room_ID
        `;
        db.query(query, [status], (err, results) => {
            if (err) {
                console.error('Error fetching rooms:', err);
                return res.status(500).json({ error: 'Failed to fetch rooms' });
            }
            res.json(results);
        });
    } else {
        query = `
            SELECT * FROM room 
            ORDER BY Room_ID
        `;
        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error fetching rooms:', err);
                return res.status(500).json({ error: 'Failed to fetch rooms' });
            }
            res.json(results);
        });
    }
});

app.post('/api/rooms', (req, res) => {
    const { roomNumber, roomType, floor, status, capacity } = req.body;
    const query = `
        INSERT INTO room (Room_Number, Room_Type, Floor, Status, Capacity) 
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [roomNumber, roomType, floor, status, capacity], (err, result) => {
        if (err) {
            console.error('Error adding room:', err);
            return res.status(500).json({ error: 'Failed to add room' });
        }
        res.status(201).json({ id: result.insertId, message: 'Room added successfully' });
    });
});

// Bills
app.get('/api/bills', (req, res) => {
    const status = req.query.status || '';
    let query;
    
    if (status) {
        query = `
            SELECT b.*, CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name
            FROM bill b
            JOIN patient p ON b.Patient_ID = p.Patient_ID
            WHERE b.Payment_Status = ?
            ORDER BY b.Bill_ID DESC
        `;
        db.query(query, [status], (err, results) => {
            if (err) {
                console.error('Error fetching bills:', err);
                return res.status(500).json({ error: 'Failed to fetch bills' });
            }
            res.json(results);
        });
    } else {
        query = `
            SELECT b.*, CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name
            FROM bill b
            JOIN patient p ON b.Patient_ID = p.Patient_ID
            ORDER BY b.Bill_ID DESC
        `;
        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error fetching bills:', err);
                return res.status(500).json({ error: 'Failed to fetch bills' });
            }
            res.json(results);
        });
    }
});

app.post('/api/bills', (req, res) => {
    const { patientId, billDate, items, totalAmount, paymentStatus, paymentMethod } = req.body;
    
    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        const billQuery = `
            INSERT INTO bill (Patient_ID, Bill_Date, Total_Amount, Payment_Status, Payment_Method) 
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(billQuery, [patientId, billDate, totalAmount, paymentStatus, paymentMethod], (err, result) => {
            if (err) {
                db.rollback(() => {
                    console.error('Error creating bill:', err);
                    return res.status(500).json({ error: 'Failed to create bill' });
                });
                return;
            }
            
            const billId = result.insertId;
            const itemsQuery = `
                INSERT INTO bill_item (Bill_ID, Description, Amount) 
                VALUES ?
            `;
            
            const itemsValues = items.map(item => [billId, item.description, item.amount]);
            
            db.query(itemsQuery, [itemsValues], (err) => {
                if (err) {
                    db.rollback(() => {
                        console.error('Error adding bill items:', err);
                        return res.status(500).json({ error: 'Failed to add bill items' });
                    });
                    return;
                }
                
                db.commit(err => {
                    if (err) {
                        db.rollback(() => {
                            console.error('Error committing transaction:', err);
                            return res.status(500).json({ error: 'Failed to commit transaction' });
                        });
                        return;
                    }
                    
                    res.status(201).json({ id: billId, message: 'Bill added successfully' });
                });
            });
        });
    });
});

// Health Records
app.get('/api/health-records', (req, res) => {
    const patientId = req.query.patientId || '';
    let query;
    
    if (patientId) {
        query = `
            SELECT hr.*, 
                CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
                CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name
            FROM health_records hr
            JOIN patient p ON hr.Patient_ID = p.Patient_ID
            JOIN doctor d ON hr.Doctor_ID = d.Doctor_ID
            WHERE hr.Patient_ID = ?
            ORDER BY hr.Record_ID DESC
        `;
        db.query(query, [patientId], (err, results) => {
            if (err) {
                console.error('Error fetching health records:', err);
                return res.status(500).json({ error: 'Failed to fetch health records' });
            }
            res.json(results);
        });
    } else {
        query = `
            SELECT hr.*, 
                CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
                CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name
            FROM health_records hr
            JOIN patient p ON hr.Patient_ID = p.Patient_ID
            JOIN doctor d ON hr.Doctor_ID = d.Doctor_ID
            ORDER BY hr.Record_ID DESC
        `;
        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error fetching health records:', err);
                return res.status(500).json({ error: 'Failed to fetch health records' });
            }
            res.json(results);
        });
    }
});

app.post('/api/health-records', (req, res) => {
    const { patientId, doctorId, diagnosis, treatment, notes } = req.body;
    const query = `
        INSERT INTO health_records (Patient_ID, Doctor_ID, Record_Date, Diagnosis, Treatment, Notes) 
        VALUES (?, ?, CURDATE(), ?, ?, ?)
    `;
    db.query(query, [patientId, doctorId, diagnosis, treatment, notes], (err, result) => {
        if (err) {
            console.error('Error adding health record:', err);
            return res.status(500).json({ error: 'Failed to add health record' });
        }
        res.status(201).json({ id: result.insertId, message: 'Health record added successfully' });
    });
});

// Pharmacy
app.get('/api/pharmacy', (req, res) => {
    const searchTerm = req.query.search || '';
    const query = `
        SELECT ph.*, CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name
        FROM pharmacy ph
        LEFT JOIN prescription pr ON ph.Prescription_ID = pr.Prescription_ID
        LEFT JOIN medical_schedule ms ON pr.Schedule_ID = ms.Schedule_ID
        LEFT JOIN patient p ON ms.Patient_ID = p.Patient_ID
        WHERE ph.Drug_Name LIKE ?
        ORDER BY ph.Pharmacy_ID DESC
    `;
    db.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error fetching pharmacy items:', err);
            return res.status(500).json({ error: 'Failed to fetch pharmacy items' });
        }
        res.json(results);
    });
});

app.post('/api/pharmacy', (req, res) => {
    const { drugName, patientId, dosage, quantity, price, expiryDate, notes } = req.body;
    
    // First check if we need to create a prescription
    if (patientId) {
        // Create a medical schedule entry
        db.beginTransaction(err => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const scheduleQuery = `
                INSERT INTO medical_schedule (Patient_ID, Appointment_Date, Status)
                VALUES (?, CURDATE(), 'Scheduled')
            `;
            
            db.query(scheduleQuery, [patientId], (err, scheduleResult) => {
                if (err) {
                    db.rollback(() => {
                        console.error('Error creating schedule:', err);
                        return res.status(500).json({ error: 'Failed to create schedule' });
                    });
                    return;
                }

                const scheduleId = scheduleResult.insertId;
                
                // Create prescription
                const prescriptionQuery = `
                    INSERT INTO prescription (Schedule_ID, Dosage, Issue_Date, End_Date)
                    VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY))
                `;
                
                db.query(prescriptionQuery, [scheduleId, dosage], (err, prescriptionResult) => {
                    if (err) {
                        db.rollback(() => {
                            console.error('Error creating prescription:', err);
                            return res.status(500).json({ error: 'Failed to create prescription' });
                        });
                        return;
                    }
                    
                    const prescriptionId = prescriptionResult.insertId;
                    
                    // Create pharmacy entry
                    const pharmacyQuery = `
                        INSERT INTO pharmacy (Prescription_ID, Drug_Name, Quantity, Price, Dispensed_Date)
                        VALUES (?, ?, ?, ?, CURDATE())
                    `;
                    
                    db.query(pharmacyQuery, [prescriptionId, drugName, quantity, price], (err, pharmacyResult) => {
                        if (err) {
                            db.rollback(() => {
                                console.error('Error creating pharmacy entry:', err);
                                return res.status(500).json({ error: 'Failed to create pharmacy entry' });
                            });
                            return;
                        }
                        
                        db.commit(err => {
                            if (err) {
                                db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    return res.status(500).json({ error: 'Failed to commit transaction' });
                                });
                                return;
                            }
                            
                            res.status(201).json({ 
                                id: pharmacyResult.insertId, 
                                message: 'Medication added successfully' 
                            });
                        });
                    });
                });
            });
        });
    } else {
        // Direct pharmacy entry without prescription
        const pharmacyQuery = `
            INSERT INTO pharmacy (Drug_Name, Quantity, Price, Dispensed_Date)
            VALUES (?, ?, ?, CURDATE())
        `;
        
        db.query(pharmacyQuery, [drugName, quantity, price], (err, result) => {
            if (err) {
                console.error('Error adding medication:', err);
                return res.status(500).json({ error: 'Failed to add medication' });
            }
            res.status(201).json({ id: result.insertId, message: 'Medication added successfully' });
        });
    }
});

// Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
    const queries = {
        totalPatients: 'SELECT COUNT(*) as count FROM patient',
        activeDoctors: 'SELECT COUNT(*) as count FROM doctor',
        activeNurses: 'SELECT COUNT(*) as count FROM nurse',
        pendingReminders: "SELECT COUNT(*) as count FROM reminder WHERE Status = 'Pending'",
        activePrescriptions: "SELECT COUNT(*) as count FROM prescription WHERE End_Date >= CURDATE()",
        pendingBills: "SELECT COUNT(*) as count FROM bill WHERE Payment_Status = 'Pending'"
    };
    
    const stats = {};
    let completedQueries = 0;
    
    for (const [key, query] of Object.entries(queries)) {
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching ${key} stats:`, err);
                stats[key] = 0;
            } else {
                stats[key] = results[0].count;
            }
            
            completedQueries++;
            if (completedQueries === Object.keys(queries).length) {
                res.json(stats);
            }
        });
    }
});

// Medical Schedule
app.get('/api/medical_schedule', (req, res) => {
    const dateFilter = req.query.date || '';
    let query;
    
    if (dateFilter) {
        query = `
            SELECT ms.*, 
                CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
                CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name,
                CONCAT(n.First_Name, ' ', n.Last_Name) AS Nurse_Name
            FROM medical_schedule ms
            JOIN patient p ON ms.Patient_ID = p.Patient_ID
            LEFT JOIN doctor d ON ms.Doctor_ID = d.Doctor_ID
            LEFT JOIN nurse n ON ms.Nurse_ID = n.Nurse_ID
            WHERE ms.Appointment_Date = ?
            ORDER BY ms.Appointment_Time
        `;
        db.query(query, [dateFilter], (err, results) => {
            if (err) {
                console.error('Error fetching schedule:', err);
                return res.status(500).json({ error: 'Failed to fetch schedule' });
            }
            res.json(results);
        });
    } else {
        query = `
            SELECT ms.*, 
                CONCAT(p.First_Name, ' ', p.Last_Name) AS Patient_Name,
                CONCAT(d.First_Name, ' ', d.Last_Name) AS Doctor_Name,
                CONCAT(n.First_Name, ' ', n.Last_Name) AS Nurse_Name
            FROM medical_schedule ms
            JOIN patient p ON ms.Patient_ID = p.Patient_ID
            LEFT JOIN doctor d ON ms.Doctor_ID = d.Doctor_ID
            LEFT JOIN nurse n ON ms.Nurse_ID = n.Nurse_ID
            ORDER BY ms.Appointment_Date DESC, ms.Appointment_Time
        `;
        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Error fetching schedule:', err);
                return res.status(500).json({ error: 'Failed to fetch schedule' });
            }
            res.json(results);
        });
    }
});

// Catch-all route for SPA navigation
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 