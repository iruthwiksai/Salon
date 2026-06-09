// backend/app.js

const express = require('express')
const dotenv  = require('dotenv')

dotenv.config()

const app = express()

// ── Global Middleware ──────────────────────────────────────────────
// These run on EVERY request, in the order they're registered.
// Think of them as security checkpoints at an airport.

// 1. Parse JSON bodies → makes req.body available
app.use(express.json())

// 2. Parse form data (for HTML forms)
app.use(express.urlencoded({ extended: true }))

// 3. Our custom request logger
// This is middleware YOU wrote. It logs every incoming request.
// Without next(), the request would hang forever — try removing it to see!
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()  // pass control to the next middleware/route
})

// ── Routes ────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'salon-saas-backend',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// ── 404 Handler — catches any URL that didn't match a route ────────
// This MUST come AFTER all your routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  })
})

// ── Global Error Handler ──────────────────────────────────────────
// Express knows this is an error handler because it has 4 parameters.
// Any time you call next(err), or a route throws, this catches it.
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})

module.exports = app