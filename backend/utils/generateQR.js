const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const generateQR = async (userId) => {
  const qrDir = path.join(__dirname, '..', 'public', 'qr');
  const qrPath = path.join(qrDir, `${userId}.png`);

  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  if (!fs.existsSync(qrPath)) {
    await QRCode.toFile(qrPath, `user:${userId}`, { width: 300 });
  }

  return `/api/auth/qr/${userId}.png`; // ✅ Correct path for frontend access
};

module.exports = generateQR;
