# Medicine Reminder Application

A professional web application for managing medicine reminders, patients, doctors, prescriptions, and more. This application is built with HTML, CSS, JavaScript, and MySQL.

## Features

- Dashboard with statistics overview
- Patient management
- Medicine reminders with filtering options
- Doctor management
- Prescription tracking
- Responsive design for all devices
- Beautiful UI with modern animations

## Screenshots

[Include screenshots here]

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)

## Database Setup

1. Install MySQL server
2. Log in to MySQL:
   ```
   mysql -u root -p
   ```
3. Run the database setup script:
   ```
   mysql -u root -p < database.sql
   ```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/medicine-reminder.git
   cd medicine-reminder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure database connection:
   Edit the `backend.js` file and update the database connection settings:
   ```javascript
   const pool = mysql.createPool({
       host: 'localhost',
       user: 'your_mysql_username',
       password: 'your_mysql_password',
       database: 'Medicine_Reminder',
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0
   });
   ```

4. Start the application:
   ```
   npm start
   ```

5. For development mode with auto-reload:
   ```
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

- `index.html` - Main application HTML
- `styles.css` - CSS styles for the application
- `script.js` - Frontend JavaScript code
- `backend.js` - Node.js Express backend server
- `database.sql` - MySQL database schema


## License

MIT

## Author

Vishnu Prasad B

## Acknowledgements

- Font Awesome for icons
- Google Fonts for typography 
