document.addEventListener('DOMContentLoaded', async () => {
  // 🔒 Logout flow
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  // 🍔 Mobile nav toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // 📦 Load waste submission history
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Login required to view history.');
      window.location.href = 'login.html';
      return;
    }

    const tableBody = document.getElementById('historyBody');
    tableBody.innerHTML = `<tr><td colspan="6">Loading history...</td></tr>`;

    const response = await fetch('/api/waste/history', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('Invalid data format:', data);
      alert('Failed to load history. Try again later.');
      return;
    }

    tableBody.innerHTML = '';
    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No submissions yet.</td></tr>`;
      return;
    }

    data.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(entry.submittedAt).toLocaleString()}</td>
        <td>${entry.biodegradable}</td>
        <td>${entry.nonBiodegradable}</td>
        <td>${entry.status}</td>
        <td>${entry.verifiedBio ? '✅' : '❌'}</td>
        <td>${entry.verifiedNonBio ? '✅' : '❌'}</td>
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error('Error loading history:', err);
    alert('Unable to load data. Please refresh.');
  }
});
