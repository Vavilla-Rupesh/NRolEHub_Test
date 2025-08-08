// const express = require('express')
// require('dotenv').config()
// const { syncDatabase } = require('./config/dataBase')
// const route = require('./index')
// const path = require('path')
// const port = process.env.SERVER_PORT
// const cors = require('cors')

// const app = express()

// // Increase payload size limits
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use(cors());

// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, 'public', 'uploads', 'events');
// require('fs').mkdirSync(uploadsDir, { recursive: true });

// // Serve uploaded files statically with absolute path
// app.use('/uploads/events', express.static(uploadsDir));

// app.use('/api', route)

// syncDatabase().then(() => {
//     console.log('Database is ready!');
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
// });
const express = require('express');
require('dotenv').config();
const { syncDatabase } = require('./config/dataBase');
const route = require('./index');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const port = process.env.SERVER_PORT || process.env.PORT || 5000;

const app = express();

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'events');
fs.mkdirSync(uploadsDir, { recursive: true });

// Serve uploaded files statically
app.use('/uploads/events', express.static(uploadsDir));

// API routes
app.use('/api', route);

// Serve Vite frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../dist");
  app.use(express.static(frontendDistPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Start server
syncDatabase().then(() => {
    console.log('Database is ready!');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
});
