
// Handle Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('userId'); // Clear userId on logout
  window.location.href = 'login.html';
});

// Hamburger menu toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});


// Fetch user token from localStorage
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/admin/rewards', {   // note /api/admin/rewards
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
