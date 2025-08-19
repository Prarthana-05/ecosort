// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('userId'); // Clear userId on logout
  window.location.href = 'login.html';
});

// Hamburger menu toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});

// Load nearby cleanup drives
async function loadCleanupDrives() {
  const resultContainer = document.getElementById('cleanupDrivesResult');
  const userId = localStorage.getItem('userId');

  if (!userId || userId === 'undefined') {
    resultContainer.textContent = "User not logged in.";
    return;
  }

  try {
    const response = await fetch(`https://ecosort-6zu2.onrender.com/api/events/user-location?userId=${userId}`);
    const data = await response.json();

    resultContainer.innerHTML = '';

    if (!Array.isArray(data)) {
      resultContainer.textContent = data.error || 'Unexpected server response.';
      return;
    }

    if (data.length === 0) {
      resultContainer.textContent = 'No nearby cleanup drives found.';
      return;
    }

    data.forEach(drive => {
      const card = document.createElement('div');
      card.className = 'drive-card';
      card.innerHTML = `
        <h3>${drive.name || "Untitled Drive"}</h3>
        <p><strong>Location:</strong> ${drive.location || 'Unknown'}</p>
        <p><strong>Date:</strong> ${drive.date || 'TBD'}</p>
        <p><strong>Description:</strong> ${drive.description || 'No details available.'}</p>
      `;
      resultContainer.appendChild(card);
    });

  } catch (error) {
    console.error('Fetch error:', error);
    resultContainer.textContent = 'Failed to load cleanup drives.';
  }
}

// Initialize
loadCleanupDrives();
