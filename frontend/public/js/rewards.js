document.addEventListener("DOMContentLoaded", () => {
  // Handle Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('userId'); // Clear userId on logout
      window.location.href = 'login.html';
    });
  }

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Fetch user token from localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  fetch('https://ecosort-6zu2.onrender.com/api/admin/rewards', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const rewardsList = document.getElementById('rewardsList');
      rewardsList.innerHTML = '';

      if (!data.rewards || data.rewards.length === 0) {
        rewardsList.innerHTML = '<p>No rewards yet. Participate and earn!</p>';
        return;
      }

      data.rewards.forEach(reward => {
        const card = document.createElement('div');
        card.className = 'reward-card';
        card.innerHTML = `
          <p>🎁 Reward: <span>${reward.voucher}</span></p>
          <p>Awarded At: ${new Date(reward.awardedAt).toLocaleString()}</p>
        `;
        rewardsList.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error fetching rewards:', err);
      alert('❌ Failed to load rewards');
    });
});
