// Handle Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('userId'); // Clear userId on logout
  window.location.href = 'login.html';
});

// Hamburger menu toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});

// Main function to load centers
async function loadCenters() {
  const resultContainer = document.getElementById('centerResults');
  const userId = localStorage.getItem('userId');

  if (!userId || userId === 'undefined') {
    resultContainer.textContent = "User not logged in.";
    return;
  }

  try {
    const response = await fetch(`/api/centers/nearby?userId=${userId}`);
    const data = await response.json();

    resultContainer.innerHTML = '';

    if (!Array.isArray(data)) {
      resultContainer.textContent = data.error || 'Unexpected server response.';
      return;
    }

    if (data.length === 0) {
      resultContainer.textContent = 'No nearby collection centers found.';
      return;
    }

    data.forEach(center => {
      const card = document.createElement('div');
      card.className = 'center-card';
      card.innerHTML = `
        <h3>${center.name || "Unnamed Center"}</h3>
        <p><strong>Location:</strong> ${center.location || 'Unknown'}</p>
        <p><strong>Contact:</strong> ${center.contact || 'N/A'}</p>
        <p><strong>Operating Hours:</strong> ${center.operatingHours || 'N/A'}</p>
        <p><strong>Waste Types:</strong> ${center.wasteTypes?.join(', ') || 'N/A'}</p>
      `;
      resultContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Fetch error:', err);
    resultContainer.textContent = 'Failed to load collection centers.';
  }
}

// Initialize
loadCenters();
