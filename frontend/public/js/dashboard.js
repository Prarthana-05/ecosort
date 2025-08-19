// Authentication Check
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login.html';
} else {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin') {
      alert("Access Denied");
      window.location.href = '/home.html';
    }
  } catch (err) {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
}

// QR Scanner Setup
function onScanSuccess(decodedText) {
  const userId = decodedText;
  fetch(`/api/admin/scan/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => {
      document.getElementById('userName').textContent = data.name;
      document.getElementById('userID').textContent = data.id;
      document.getElementById('userEmail').textContent = data.email;
      document.getElementById('userLocation').textContent = data.location;
      document.getElementById('visitDate').textContent = new Date(data.date).toLocaleString();
      document.getElementById('userStatus').textContent = data.status;
      document.getElementById('bioWaste').textContent = data.bio;
      document.getElementById('nonBioWaste').textContent = data.nonBio;

      const bioCheckbox = document.getElementById('verifiedBio');
      const nonBioCheckbox = document.getElementById('verifiedNonBio');

      bioCheckbox.checked = data.verifiedBio;
      nonBioCheckbox.checked = data.verifiedNonBio;

      bioCheckbox.disabled = data.bio === 0;
      nonBioCheckbox.disabled = data.nonBio === 0;

      const updateBtn = document.getElementById('updateVerificationBtn');
      updateBtn.disabled = bioCheckbox.disabled && nonBioCheckbox.disabled;

      document.getElementById('scanResult').style.display = 'block';
    })
    .catch(err => console.error('Failed to fetch scanned user:', err));
}

new Html5Qrcode("reader").start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  onScanSuccess
);

// Only Update Verification Button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('updateVerificationBtn').addEventListener('click', () => {
  const userId = document.getElementById('userID').textContent;
  const verifiedBio = document.getElementById('verifiedBio').checked;
  const verifiedNonBio = document.getElementById('verifiedNonBio').checked;

  fetch(`/api/admin/verify/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ verifiedBio, verifiedNonBio })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Verification updated.");

    if (data.rewards && data.rewards.length > 0) {
      data.rewards.forEach(voucher => {
        alert(`🎉 Reward granted: ${voucher}`);
      });
    }
  })
  .catch(err => {
    console.error("Verification update error:", err);
    alert("❌ Failed to update verification.");
  });
});

});
