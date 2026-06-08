// backend/app.js

const express = require('express')
const dotenv  = require('dotenv')

dotenv.config()  // loads .env file into process.env

const app = express()

// Middleware: teach Express to understand JSON request bodies
app.use(express.json())

// Health check route — proves the server is alive
app.get('/health', (req, res) => {
  res.json({
    status:  'ok',
    service: 'salon-saas-backend',
    time:    new Date().toISOString()
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app