// ========== AUTO LOGOUT - 8 HOURS ==========

// Set timeout to 8 hours (8 * 60 * 60 * 1000 = 28,800,000 milliseconds)
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours

// Timer variable
let logoutTimer;

// Function to clear existing timer
function clearLogoutTimer() {
    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }
}

// Function to start the logout timer
function startLogoutTimer() {
    clearLogoutTimer();
    logoutTimer = setTimeout(function () {
        // Auto logout after timeout
        console.log("Auto logging out due to inactivity...");
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('streak');
        localStorage.removeItem('lastLogin');
        localStorage.removeItem('toolProgress');
        localStorage.removeItem('favorites');

        // Show alert
        alert("You have been logged out due to 8 hours of inactivity.");

        // Redirect to login
        window.location.href = 'login.html';
    }, SESSION_TIMEOUT);
}

// Reset timer on user activity
function resetTimer() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        startLogoutTimer();
    }
}

// ========== AUTHENTICATION CHECK ==========
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = new Date().getTime();

    // Get current page
    const currentPage = window.location.pathname.split('/').pop();

    // Pages that don't require login
    const publicPages = ['login.html', 'index.html', ''];

    // Check if session expired (8 hours)
    if (loginTime && (currentTime - parseInt(loginTime)) > SESSION_TIMEOUT) {
        // Session expired - logout
        console.log("Session expired after 8 hours, logging out...");
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('streak');
        localStorage.removeItem('lastLogin');
        localStorage.removeItem('toolProgress');
        localStorage.removeItem('favorites');

        // Redirect to login if on protected page
        const isProtected = !publicPages.some(page => currentPage === page || currentPage === '');
        if (isProtected) {
            window.location.href = 'login.html';
        }
        return false;
    }

    // If not logged in and trying to access protected pages
    if (isLoggedIn !== 'true' || !userEmail) {
        // Check if current page requires authentication
        const isProtected = !publicPages.some(page => currentPage === page || currentPage === '');

        if (isProtected) {
            console.log("Not logged in, redirecting to login...");
            window.location.href = 'login.html';
            return false;
        }
        return false;
    }

    // Update login time on each page visit
    localStorage.setItem('loginTime', new Date().getTime());

    // User is logged in, start the logout timer
    startLogoutTimer();
    return true;
}

// Run auth check immediately
checkAuth();

// ========== ACTIVITY LISTENERS ==========
// List of events that reset the timer
const activityEvents = [
    'click', 'mousemove', 'keypress', 'scroll',
    'touchstart', 'touchmove', 'wheel', 'mousedown'
];

// Add event listeners to reset timer on user activity
activityEvents.forEach(event => {
    document.addEventListener(event, resetTimer);
});

// Also reset on page visibility change (when user comes back to tab)
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        resetTimer();
    }
});

// ========== OFFLINE INDICATOR ==========
function showOfflineIndicator() {
    if (!navigator.onLine && localStorage.getItem('isLoggedIn') === 'true') {
        const indicator = document.createElement('div');
        indicator.id = 'offlineIndicator';
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showOfflineIndicator);
} else {
    showOfflineIndicator();
}