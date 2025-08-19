// Get logged-in userId
const userId = localStorage.getItem('userId');

// On page load
window.addEventListener('DOMContentLoaded', () => {
  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Show initial datetime
  updateDateTime();
});

// Function to update timestamp display
function updateDateTime() {
  const now = new Date();
  document.getElementById('datetime').value = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });
}

// Waste form submit
document.getElementById('wasteForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const wasteType = document.getElementById('wasteType').value;
  const quantity = parseFloat(document.getElementById('quantity').value || 0);

  const bio = wasteType === 'Biodegradable' ? quantity : 0;
  const nonBio = wasteType === 'Non-Biodegradable' ? quantity : 0;

  // Prevent submission if both values are 0
  if (bio === 0 && nonBio === 0) {
    alert('⚠️ Please enter a valid waste quantity.');
    return;
  }

  // Single timestamp for DB + UI
  const now = new Date();
  const formatted = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });
  const timestamp = now.toISOString();

  document.getElementById('datetime').value = formatted;

  const submissionData = {
    userId,
    biodegradable: bio,
    nonBiodegradable: nonBio,
    status: 'Pending',
    submittedAt: timestamp
  };

  try {
    const response = await fetch('/api/user/submit-waste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ Waste data submitted successfully!');
      document.getElementById('wasteForm').reset();

      // Refresh timestamp after reset
      updateDateTime();
    } else {
      alert(result.error || '❌ Something went wrong.');
    }
  } catch (error) {
    console.error('Error submitting waste data:', error);
    alert('⚠️ Server error. Please try again later.');
  }
});
