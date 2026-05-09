// ========== OFFLINE AUTHENTICATION CHECK ==========

// Check if user is logged in (works offline)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');

    // Get current page
    const currentPage = window.location.pathname.split('/').pop();

    // If not logged in and trying to access protected pages
    if (isLoggedIn !== 'true' || !userEmail) {
        // List of pages that require authentication
        const protectedPages = ['dashboard.html', 'tools/'];

        const isProtected = protectedPages.some(page => currentPage.includes(page));

        if (isProtected) {
            window.location.href = 'login.html';
            return false;
        }
    }

    return true;
}

// Run auth check immediately
checkAuth();

// Show offline mode indicator on protected pages
function showOfflineIndicator() {
    if (!navigator.onLine && localStorage.getItem('isLoggedIn') === 'true') {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(244, 180, 0, 0.9);
            color: #8B0000;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: bold;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        indicator.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Offline Mode';
        document.body.appendChild(indicator);
    }
}

// Run after DOM loads
document.addEventListener('DOMContentLoaded', showOfflineIndicator);