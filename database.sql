-- Medicine Reminder Database Schema

-- Drop database if exists
DROP DATABASE IF EXISTS Medicine_Reminder;

-- Create database
CREATE DATABASE Medicine_Reminder;

-- Use database
USE Medicine_Reminder;

-- Create patient table
CREATE TABLE patient (
    Patient_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    DOB DATE,
    Gender VARCHAR(10),
    Phone_Number VARCHAR(15),
    Address TEXT
);

-- Create doctor table
CREATE TABLE doctor (
    Doctor_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Specialization VARCHAR(100),
    Phone_Number VARCHAR(15)
);

-- Create nurse table
CREATE TABLE nurse (
    Nurse_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Department VARCHAR(100),
    Phone_Number VARCHAR(15),
    Shift VARCHAR(50)
);

-- Create room table
CREATE TABLE room (
    Room_ID INT AUTO_INCREMENT PRIMARY KEY,
    Room_Number VARCHAR(10) NOT NULL,
    Room_Type VARCHAR(50),
    Floor INT,
    Status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
    Capacity INT DEFAULT 1
);

-- Create medical schedule table
CREATE TABLE medical_schedule (
    Schedule_ID INT AUTO_INCREMENT PRIMARY KEY,
    Patient_ID INT,
    Doctor_ID INT,
    Nurse_ID INT,
    Room_ID INT,
    Appointment_Date DATE,
    Appointment_Time TIME,
    Status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    FOREIGN KEY (Patient_ID) REFERENCES patient(Patient_ID),
    FOREIGN KEY (Doctor_ID) REFERENCES doctor(Doctor_ID),
    FOREIGN KEY (Nurse_ID) REFERENCES nurse(Nurse_ID),
    FOREIGN KEY (Room_ID) REFERENCES room(Room_ID)
);

-- Create prescription table
CREATE TABLE prescription (
    Prescription_ID INT AUTO_INCREMENT PRIMARY KEY,
    Schedule_ID INT,
    Dosage VARCHAR(100),
    Instructions TEXT,
    Issue_Date DATE,
    End_Date DATE,
    FOREIGN KEY (Schedule_ID) REFERENCES medical_schedule(Schedule_ID)
);

-- Create pharmacy table
CREATE TABLE pharmacy (
    Pharmacy_ID INT AUTO_INCREMENT PRIMARY KEY,
    Prescription_ID INT,
    Drug_Name VARCHAR(100) NOT NULL,
    Quantity INT,
    Price DECIMAL(10, 2),
    Dispensed_Date DATE,
    FOREIGN KEY (Prescription_ID) REFERENCES prescription(Prescription_ID)
);

-- Create reminder table
CREATE TABLE reminder (
    Reminder_ID INT AUTO_INCREMENT PRIMARY KEY,
    Patient_ID INT,
    Message TEXT,
    Due_Date DATE,
    Time_Time TIME,
    Status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (Patient_ID) REFERENCES patient(Patient_ID)
);

-- Create bill table
CREATE TABLE bill (
    Bill_ID INT AUTO_INCREMENT PRIMARY KEY,
    Patient_ID INT,
    Bill_Date DATE,
    Total_Amount DECIMAL(10, 2),
    Payment_Status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Pending',
    Payment_Method VARCHAR(50),
    FOREIGN KEY (Patient_ID) REFERENCES patient(Patient_ID)
);

-- Create bill_item table for itemized bills
CREATE TABLE bill_item (
    Item_ID INT AUTO_INCREMENT PRIMARY KEY,
    Bill_ID INT,
    Description VARCHAR(255),
    Amount DECIMAL(10, 2),
    FOREIGN KEY (Bill_ID) REFERENCES bill(Bill_ID)
);

-- Create health_records table
CREATE TABLE health_records (
    Record_ID INT AUTO_INCREMENT PRIMARY KEY,
    Patient_ID INT,
    Doctor_ID INT,
    Record_Date DATE,
    Diagnosis TEXT,
    Treatment TEXT,
    Notes TEXT,
    FOREIGN KEY (Patient_ID) REFERENCES patient(Patient_ID),
    FOREIGN KEY (Doctor_ID) REFERENCES doctor(Doctor_ID)
);

-- Insert sample data for testing
INSERT INTO patient (First_Name, Last_Name, DOB, Gender, Phone_Number, Address)
VALUES 
('John', 'Doe', '1980-05-15', 'Male', '555-123-4567', '123 Main St'),
('Jane', 'Smith', '1975-08-22', 'Female', '555-987-6543', '456 Oak Ave');

INSERT INTO doctor (First_Name, Last_Name, Specialization, Phone_Number)
VALUES 
('David', 'Johnson', 'Cardiologist', '555-111-2222'),
('Sarah', 'Williams', 'Neurologist', '555-333-4444');

INSERT INTO nurse (First_Name, Last_Name, Department, Phone_Number, Shift)
VALUES 
('Emma', 'Brown', 'Emergency', '555-555-5555', 'Morning'),
('Michael', 'Davis', 'ICU', '555-666-7777', 'Night');

INSERT INTO room (Room_Number, Room_Type, Floor, Status)
VALUES 
('101', 'Standard', 1, 'Available'),
('201', 'ICU', 2, 'Available'),
('301', 'Surgery', 3, 'Maintenance');

-- Sample schedules
INSERT INTO medical_schedule (Patient_ID, Doctor_ID, Nurse_ID, Room_ID, Appointment_Date, Appointment_Time)
VALUES 
(1, 1, 1, 1, '2023-06-15', '10:00:00'),
(2, 2, 2, 2, '2023-06-16', '14:30:00');

-- Sample prescriptions
INSERT INTO prescription (Schedule_ID, Dosage, Instructions, Issue_Date, End_Date)
VALUES 
(1, '10mg', 'Take with food twice daily', '2023-06-15', '2023-07-15'),
(2, '5mg', 'Take once daily before bed', '2023-06-16', '2023-08-16');

-- Sample pharmacy entries
INSERT INTO pharmacy (Prescription_ID, Drug_Name, Quantity, Price, Dispensed_Date)
VALUES 
(1, 'Lisinopril', 30, 25.99, '2023-06-15'),
(2, 'Atorvastatin', 30, 35.50, '2023-06-16');

-- Sample reminders
INSERT INTO reminder (Patient_ID, Message, Due_Date, Time_Time)
VALUES 
(1, 'Take Lisinopril medication', '2023-06-16', '08:00:00'),
(1, 'Take Lisinopril medication', '2023-06-16', '20:00:00'),
(2, 'Take Atorvastatin medication', '2023-06-16', '22:00:00');

-- Sample bills
INSERT INTO bill (Patient_ID, Bill_Date, Total_Amount, Payment_Status, Payment_Method)
VALUES 
(1, '2023-06-15', 150.99, 'Pending', NULL),
(2, '2023-06-16', 200.50, 'Paid', 'Credit Card');

-- Sample bill items
INSERT INTO bill_item (Bill_ID, Description, Amount)
VALUES 
(1, 'Consultation Fee', 75.00),
(1, 'Medication: Lisinopril', 75.99),
(2, 'Consultation Fee', 100.00),
(2, 'Medication: Atorvastatin', 100.50);

-- Sample health records
INSERT INTO health_records (Patient_ID, Doctor_ID, Record_Date, Diagnosis, Treatment, Notes)
VALUES 
(1, 1, '2023-06-15', 'Hypertension', 'Prescribed Lisinopril 10mg', 'Patient needs to monitor blood pressure daily'),
(2, 2, '2023-06-16', 'Hyperlipidemia', 'Prescribed Atorvastatin 5mg', 'Patient advised to maintain low-fat diet');
