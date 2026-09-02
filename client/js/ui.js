// ui.js - Global UI Interactions and Modal Logic

class UI {
  static init() {
    this.setupLogout();
    this.setupNavigation();
  }

  static setupNavigation() {
    // Highlight active sidebar link based on current URL
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.sidebar-link').forEach(link => {
      // Remove active class
      if (!link.id || link.id !== 'logoutBtn') {
        link.classList.remove('active');
        if (link.getAttribute('href') === page) {
          link.classList.add('active');
        }
      }
    });
  }

  static setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        this.showModal({
          title: 'Confirm Logout',
          message: 'Are you sure you want to log out of QueueLess?',
          confirmText: 'Logout',
          confirmClass: 'btn-danger',
          onConfirm: async () => {
            try {
              // Try backend logout if exists
              if (typeof ApiClient !== 'undefined') {
                await ApiClient.post('/auth/logout');
              }
            } catch (e) {
              console.error(e);
            } finally {
              // Always clear local storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = 'login.html';
            }
          }
        });
      });
    }
  }

  static showModal({ title, message, confirmText = 'Confirm', confirmClass = 'btn-primary', onConfirm }) {
    // Remove existing modal if any
    const existingModal = document.getElementById('ql-modal');
    if (existingModal) existingModal.remove();

    const modalHTML = `
      <div id="ql-modal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; opacity: 0; transition: opacity 0.3s ease;">
        <div class="glass-card" style="background: white; width: 90%; max-width: 400px; transform: translateY(-20px); transition: transform 0.3s ease;">
          <h3 style="margin-bottom: 1rem; color: var(--dark);">${title}</h3>
          <p class="text-muted" style="margin-bottom: 1.5rem;">${message}</p>
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button class="btn btn-outline" id="ql-modal-cancel">Cancel</button>
            <button class="btn ${confirmClass}" id="ql-modal-confirm">${confirmText}</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('ql-modal');
    const modalContent = modal.querySelector('.glass-card');
    
    // Trigger animation
    setTimeout(() => {
      modal.style.opacity = '1';
      modalContent.style.transform = 'translateY(0)';
    }, 10);

    const closeModal = () => {
      modal.style.opacity = '0';
      modalContent.style.transform = 'translateY(-20px)';
      setTimeout(() => modal.remove(), 300);
    };

    document.getElementById('ql-modal-cancel').addEventListener('click', closeModal);
    
    document.getElementById('ql-modal-confirm').addEventListener('click', () => {
      onConfirm();
      closeModal();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on escape
    document.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escListener);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});
