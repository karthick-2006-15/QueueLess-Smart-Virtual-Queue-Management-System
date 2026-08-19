document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const btn = loginForm.querySelector('button[type="submit"]');
      
      try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
        
        const res = await ApiClient.post('/auth/login', { email, password });
        
        // Save token (if using Bearer strategy on frontend, though we also set HTTP-only cookie)
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        
        // Save user data
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        showToast('Login successful!');
        
        // Redirect based on role
        setTimeout(() => {
          if (res.data.user.role === 'ADMIN') {
            window.location.href = 'admin.html';
          } else if (res.data.user.role === 'STAFF') {
            window.location.href = 'staff.html';
          } else {
            window.location.href = 'dashboard.html';
          }
        }, 1000);
        
      } catch (error) {
        showToast(error.message, 'error');
        btn.disabled = false;
        btn.innerHTML = 'Login';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const studentId = document.getElementById('studentId').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (password !== confirmPassword) {
        return showToast('Passwords do not match!', 'error');
      }

      const btn = registerForm.querySelector('button[type="submit"]');
      
      try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
        
        const res = await ApiClient.post('/auth/register', {
          name, studentId, phone, email, password
        });
        
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        showToast('Registration successful! Welcome to QueueLess.');
        
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
        
      } catch (error) {
        showToast(error.message, 'error');
        btn.disabled = false;
        btn.innerHTML = 'Create Account';
      }
    });
  }
});
