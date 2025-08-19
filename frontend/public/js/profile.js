let fieldToUpdate = null;

document.addEventListener('DOMContentLoaded', async () => {
  const logoutBtn = document.getElementById('logoutBtn');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const saveBtn = document.getElementById('saveBtn');
  const locationInput = document.getElementById('location');
  const passwordInput = document.getElementById('password');

  // Logout Handler
  logoutBtn?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });

  // Responsive Nav Toggle
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Validate stored user ID
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  if (!userId || userId.length !== 24) {
    alert('Invalid session. Please log in again.');
    return;
  }

  // Fetch Profile Data
  try {
    const response = await fetch('https://ecosort-6zu2.onrender.com/api/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        userid: userId
      }
    });

    if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    const data = await response.json();

    document.getElementById('name').textContent = data.name || userName || '—';
    document.getElementById('email').textContent = data.email || '—';
    locationInput.value = data.location || '';
    passwordInput.value = '';

    const qrImg = document.getElementById('qrCodeImage');
    if (qrImg) {
      if (data.qrCodePath) {
        qrImg.src = data.qrCodePath;
        qrImg.style.display = 'inline';
      } else {
        qrImg.style.display = 'none';
      }
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
    alert('Failed to load profile. Please log in again.');
  }

  // Edit Buttons
  document.getElementById('editLocationBtn')?.addEventListener('click', () => {
    fieldToUpdate = 'location';
    locationInput.readOnly = false;
    saveBtn.style.display = 'inline';
  });

  document.getElementById('editPasswordBtn')?.addEventListener('click', () => {
    fieldToUpdate = 'password';
    passwordInput.readOnly = false;
    saveBtn.style.display = 'inline';
  });

  // Save Button Handler
  saveBtn?.addEventListener('click', async () => {
    const value = document.getElementById(fieldToUpdate)?.value.trim();

    if (!userId || userId.length !== 24) {
      alert('Invalid userId.');
      return;
    }

    if (!value) {
      alert(`${fieldToUpdate} cannot be empty.`);
      return;
    }

    const endpoint =
      fieldToUpdate === 'location'
        ? 'https://ecosort-6zu2.onrender.com/api/user/update-location'
        : 'https://ecosort-6zu2.onrender.com/api/user/update-password';

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          userid: userId
        },
        body: JSON.stringify({ [fieldToUpdate]: value })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Update failed');

      alert(result.message || `${fieldToUpdate} updated successfully`);
      document.getElementById(fieldToUpdate).readOnly = true;
      saveBtn.style.display = 'none';
      fieldToUpdate = null;
    } catch (err) {
      console.error(`${fieldToUpdate} update error:`, err.message);
      alert(`Failed to update ${fieldToUpdate}.`);
    }
  });
});
