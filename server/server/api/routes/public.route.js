const express = require('express');
const router = express.Router();
const AdminService = require('../../modules/admin/admin.service');

// Public route to get all student registrations (for certificate verification)
router.get('/students', async (req, res) => {
  try {
    const registrations = await AdminService.getAllStudentRegistrations();
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch student registrations'
    });
  }
});

module.exports = router;