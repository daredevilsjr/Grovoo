const express = require('express')
const router = express.Router()
const sendEmail = require('../scripts/sendEmail');
router.post('/', async (req, res) => {
  const { name, email, subject, mobile, message } = req.body;
  const html = `
    <h2>Contact Message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Mobile:</strong> ${mobile}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong><br/>${message}</p>

  `;
  try {
    await sendEmail('1stopmandi01@gmail.com', subject || 'New Message', html);
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

module.exports = router;