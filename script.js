// ========== TOOLS DATA ==========
const toolsData = [
    { id: "gemini", name: "Google Gemini", icon: "fab fa-google", category: "chat", description: "Google's most advanced AI model", completed: false, favorite: false },
    { id: "copilot", name: "Microsoft Copilot", icon: "fab fa-microsoft", category: "chat", description: "AI powered by GPT-4", completed: false, favorite: false },
    { id: "perplexity", name: "Perplexity AI", icon: "fas fa-search", category: "research", description: "AI search engine with citations", completed: false, favorite: false },
    { id: "jasper", name: "Jasper AI", icon: "fas fa-pen-fancy", category: "writing", description: "Content writing assistant", completed: false, favorite: false },
    { id: "character-ai", name: "Character AI", icon: "fas fa-comment-dots", category: "chat", description: "Chat with AI characters", completed: false, favorite: false },
    { id: "poe", name: "Poe", icon: "fas fa-feather", category: "chat", description: "Multi-bot chat platform", completed: false, favorite: false },
    { id: "pi-ai", name: "Pi AI", icon: "fas fa-brain", category: "chat", description: "Personal intelligence assistant", completed: false, favorite: false },
    { id: "gizmo", name: "Gizmo", icon: "fas fa-cogs", category: "learning", description: "AI learning platform", completed: false, favorite: false },
    { id: "dola", name: "Dola", icon: "fas fa-chart-bar", category: "research", description: "AI data assistant", completed: false, favorite: false },
    { id: "youchat", name: "Deepseek", icon: "fas fa-comment", category: "chat", description: "AI search from You.com", completed: false, favorite: false }
];

// Load saved data from localStorage
function loadSavedData() {
    const savedProgress = localStorage.getItem("toolProgress");
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        toolsData.forEach(tool => {
            if (progress[tool.id]) {
                tool.completed = progress[tool.id].completed || false;
                tool.favorite = progress[tool.id].favorite || false;
            }
        });
    }
    
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        toolsData.forEach(tool => {
            if (favorites.includes(tool.id)) {
                tool.favorite = true;
            }
        });
    }
}

// Save progress
function saveProgress() {
    const progress = {};
    toolsData.forEach(tool => {
        progress[tool.id] = { completed: tool.completed, favorite: tool.favorite };
    });
    localStorage.setItem("toolProgress", JSON.stringify(progress));
    
    const favorites = toolsData.filter(t => t.favorite).map(t => t.id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Render tools grid
function renderTools(filter = "all", searchTerm = "") {
    const grid = document.getElementById("toolsGrid");
    if (!grid) return;
    
    let filteredTools = [...toolsData];
    
    // Apply filter
    if (filter === "favorites") {
        filteredTools = filteredTools.filter(t => t.favorite);
    } else if (filter !== "all") {
        filteredTools = filteredTools.filter(t => t.category === filter);
    }
    
    // Apply search
    if (searchTerm) {
        filteredTools = filteredTools.filter(t => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredTools.length === 0) {
        grid.innerHTML = `<div class="no-results"><i class="fas fa-search"></i><h3>No tools found</h3><p>Try a different search term or filter</p></div>`;
        return;
    }
    
    grid.innerHTML = filteredTools.map(tool => `
        <div class="tool-card-pro" data-tool-id="${tool.id}">
            <div class="tool-header-pro">
                <div class="tool-icon-pro">
                    <i class="${tool.icon}"></i>
                </div>
                <button class="favorite-btn" onclick="event.preventDefault(); toggleFavorite('${tool.id}')">
                    <i class="fas fa-star" style="color: ${tool.favorite ? '#ffc107' : '#ddd'}"></i>
                </button>
            </div>
            <h3>${tool.name}</h3>
            <span class="tool-category">${tool.category}</span>
            <p>${tool.description}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${tool.completed ? '100%' : '0%'}"></div>
            </div>
            ${tool.completed ? '<div class="completed-badge"><i class="fas fa-check"></i> Completed</div>' : ''}
            <a href="tools/${tool.id}.html" style="text-decoration: none; display: block; margin-top: 1rem; color: #667eea;">View Tutorial →</a>
        </div>
    `).join("");
    
    updateStats();
}

// Toggle favorite
function toggleFavorite(toolId) {
    const tool = toolsData.find(t => t.id === toolId);
    if (tool) {
        tool.favorite = !tool.favorite;
        saveProgress();
        renderTools(currentFilter, currentSearch);
    }
}

// Mark tool as complete (called from tool pages)
function markComplete(toolId) {
    const tool = toolsData.find(t => t.id === toolId);
    if (tool && !tool.completed) {
        tool.completed = true;
        saveProgress();
        
        // Update streak
        updateStreak();
        
        // Show success message
        alert("🎉 Congratulations! You've completed this tutorial!");
        
        // Update button
        const btn = document.querySelector(".mark-complete-btn");
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Completed!';
            btn.disabled = true;
            btn.style.opacity = "0.5";
        }
    }
}

// Update statistics
function updateStats() {
    const completedCount = toolsData.filter(t => t.completed).length;
    const completedSpan = document.getElementById("completedCount");
    if (completedSpan) completedSpan.textContent = completedCount;
    
    const percentSpan = document.getElementById("progressPercent");
    if (percentSpan) {
        const percent = Math.round((completedCount / 10) * 100);
        percentSpan.textContent = `${percent}%`;
    }
}

// Update streak
function updateStreak() {
    const lastLogin = localStorage.getItem("lastLogin");
    const today = new Date().toDateString();
    let streak = parseInt(localStorage.getItem("streak")) || 0;
    
    if (lastLogin === today) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastLogin === yesterday.toDateString()) {
        streak++;
    } else {
        streak = 1;
    }
    
    localStorage.setItem("lastLogin", today);
    localStorage.setItem("streak", streak);
    
    const streakSpan = document.getElementById("streakDays");
    if (streakSpan) streakSpan.textContent = streak;
}

// ========== DARK MODE - FIXED VERSION ==========
function initDarkMode() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) {
        console.log("Theme toggle not found");
        return;
    }
    
    const savedTheme = localStorage.getItem("theme");
    console.log("Saved theme:", savedTheme);
    
    // Apply saved theme on page load
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        console.log("Dark mode applied");
    } else {
        document.body.classList.remove("dark-mode");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        console.log("Light mode applied");
    }
    
    // Toggle theme on click
    themeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        console.log("Theme toggled:", isDark ? "dark" : "light");
    });
}

// Make sure it's called AFTER DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    initDarkMode();
});

// Initialize dashboard
let currentFilter = "all";
let currentSearch = "";

function initDashboard() {
    loadSavedData();
    renderTools();
    updateStats();
    updateStreak();
    initDarkMode();
    
    // Set user name
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
        const userName = userEmail.split('@')[0];
        const nameSpan = document.getElementById("userName");
        if (nameSpan) nameSpan.textContent = userName;
        
        const greetingSpan = document.getElementById("userGreeting");
        if (greetingSpan) greetingSpan.textContent = `Hi, ${userName}`;
    }
    
    // Search functionality
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearch = e.target.value;
            renderTools(currentFilter, currentSearch);
        });
    }
    
    // Filter buttons
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderTools(currentFilter, currentSearch);
        });
    });
    
    // Progress modal
    const viewProgressBtn = document.getElementById("viewProgress");
    if (viewProgressBtn) {
        viewProgressBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showProgressModal();
        });
    }
}

// Show progress modal
function showProgressModal() {
    const modal = document.getElementById("progressModal");
    if (!modal) return;
    
    const completed = toolsData.filter(t => t.completed).length;
    const inProgress = toolsData.filter(t => !t.completed).length;
    const favorites = toolsData.filter(t => t.favorite).length;
    
    document.getElementById("modalCompleted").textContent = `${completed}/10`;
    document.getElementById("modalInProgress").textContent = inProgress;
    document.getElementById("modalFavorites").textContent = favorites;
    
    const percent = Math.round((completed / 10) * 100);
    document.getElementById("progressPercent").textContent = `${percent}%`;
    
    const completedList = document.getElementById("completedList");
    if (completedList) {
        const completedTools = toolsData.filter(t => t.completed);
        if (completedTools.length === 0) {
            completedList.innerHTML = "<p>No tutorials completed yet. Start learning!</p>";
        } else {
            completedList.innerHTML = completedTools.map(t => `
                <div class="completed-item">
                    <i class="${t.icon}"></i>
                    <span>${t.name}</span>
                    <i class="fas fa-check-circle" style="color: #28a745;"></i>
                </div>
            `).join("");
        }
    }
    
    modal.style.display = "flex";
    
    // Close modal
    const closeBtn = modal.querySelector(".close");
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
}

// Initialize tool page
function initToolPage(toolId) {
    loadSavedData();
    initDarkMode();
    
    const tool = toolsData.find(t => t.id === toolId);
    if (tool && tool.completed) {
        const btn = document.querySelector(".mark-complete-btn");
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Completed!';
            btn.disabled = true;
            btn.style.opacity = "0.5";
        }
    }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("dashboard.html")) {
        initDashboard();
    } else if (window.location.pathname.includes("tools/")) {
        const toolId = window.location.pathname.split("/").pop().replace(".html", "");
        initToolPage(toolId);
    } else if (window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname === "") {
        initDarkMode();
    }
});



// ========== BILINGUAL TRANSLATIONS (English/Filipino) ==========

const translations = {
    en: {
        // Navigation
        navFeatures: "Features",
        navTools: "AI Tools",
        navLogin: "Login",
        navStart: "Get Started",
        
        // Hero Section
        heroBadge: "Filipino 107 | Innovative Teaching",
        heroTitle1: "AI-Integrated",
        heroTitle2: "Instructional Toolkit",
        heroDesc: "A modern toolkit for teaching Filipino 107 using 10 AI tools. Designed for future educators of Tarlac State University - College of Education.",
        heroBtnStart: "Get Started",
        heroBtnLearn: "Learn More",
        
        // Stats
        statTools: "AI Tools",
        statTuts: "Tutorials",
        statAccess: "Access",
        
        // Floating Cards
        card1: "AI in Filipino",
        card2: "Video Tutorials",
        card3: "Innovative Teaching",
        
        // Features Section
        featuresTag: "Why Choose Us",
        featuresTitle: "Everything You Need for Modern Teaching",
        featuresSub: "Specially designed for Filipino 107 - Innovative Teaching of Filipino",
        
        feature1Title: "10 AI Tools",
        feature1Desc: "Complete tutorials for popular AI tools that can be used in teaching Filipino",
        feature2Title: "Video Tutorials",
        feature2Desc: "Step-by-step video guides for easy understanding",
        feature3Title: "Innovative Strategies",
        feature3Desc: "Sample lessons using AI in teaching Filipino",
        feature4Title: "Favorites",
        feature4Desc: "Bookmark frequently used AI tools for quick access",
        feature5Title: "Progress Tracking",
        feature5Desc: "Track your completed tutorials and learning journey",
        feature6Title: "Dark Mode",
        feature6Desc: "Comfortable viewing for late-night study sessions",
        
        // Footer
        footerTitle: "AI Instructional Toolkit",
        footerSub: "Filipino 107 - Innovative Teaching of Filipino",
        footerMenu: "Menu",
        footerFeatures: "Features",
        footerTools: "AI Tools",
        footerLogin: "Login",
        footerSupport: "Support",
        footerHelp: "Help Center",
        footerContact: "Contact Us",
        footerLegal: "Legal",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms of Use",
        footerCopyright: "© 2024 AI Integrated Instructional Toolkit | Filipino 107 - Tarlac State University",
        footerResearch: "A research project for innovative teaching of Filipino",
        
        // Login Page
        loginTitle: "Login - AI Instructional Toolkit",
        loginWelcome: "Welcome Back",
        loginSubtitle: "Login to access your AI Instructional Toolkit",
        loginEmail: "Group Email",
        loginPassword: "Password",
        loginPlaceholderEmail: "group@research.com",
        loginPlaceholderPassword: "Enter your password",
        loginRemember: "Remember me",
        loginForgot: "Forgot password?",
        loginBtn: "Login",
        loginFooter: "⚠️ For authorized Filipino 107 research group members only",
        loginFooterSmall: "Tarlac State University - College of Education | Filipino 107",
        loginError: "Invalid email or password. Please try again.",
        loginQuote: "Technology is a tool, but the teacher brings learning to life",
        loginQuoteAuthor: "Filipino 107 Research Group",
        
        // Dashboard
        dashboardWelcome: "Welcome back,",
        dashboardSubtitle: "Continue your study of AI tools for innovative teaching of Filipino.",
        dashboardSearch: "Search AI tools...",
        dashboardAllTools: "All Tools",
        dashboardChatbots: "Chatbots",
        dashboardWriting: "Writing",
        dashboardResearch: "Research",
        dashboardFavorites: "Favorites",
        dashboardStreak: "Learning Streak",
        dashboardDays: "days",
        dashboardCompleted: "tutorials completed",
        
        // Tool Pages
        toolMarkComplete: "Mark as Complete",
        toolCompleted: "Completed!",
        toolProTip: "Pro Tip",
        
        // Logout
        logoutTitle: "Logging out...",
        logoutMessage: "Thank you for using AI Instructional Toolkit",
        
        // Common
        back: "Back",
        logout: "Logout",
        viewTutorial: "View Tutorial →"
    },
    
    fil: {
        // Navigation
        navFeatures: "Mga Tampok",
        navTools: "AI Kasangkapan",
        navLogin: "Mag-login",
        navStart: "Simulan",
        
        // Hero Section
        heroBadge: "Filipino 107 | Inobatibong Pagtuturo",
        heroTitle1: "AI-Integrated",
        heroTitle2: "Instructional Toolkit",
        heroDesc: "Isang makabagong toolkit para sa pagtuturo ng Filipino 107 gamit ang 10 AI tools. Dinisenyo para sa mga magiging guro ng Tarlac State University - College of Education.",
        heroBtnStart: "Simulan",
        heroBtnLearn: "Alamin Pa",
        
        // Stats
        statTools: "AI Kasangkapan",
        statTuts: "Tutorial",
        statAccess: "Access",
        
        // Floating Cards
        card1: "AI sa Filipino",
        card2: "Video Tutorial",
        card3: "Inobatibong Turo",
        
        // Features Section
        featuresTag: "Bakit Kami",
        featuresTitle: "Lahat ng Kailangan sa Makabagong Pagtuturo",
        featuresSub: "Espesyal na ginawa para sa Filipino 107 - Inobatibong Pagtuturo ng Filipino",
        
        feature1Title: "10 AI Kasangkapan",
        feature1Desc: "Kompletong tutorial para sa mga sikat na AI tools na pwedeng gamitin sa pagtuturo ng Filipino",
        feature2Title: "Video Tutorial",
        feature2Desc: "Step-by-step video guides para madaling maintindihan",
        feature3Title: "Inobatibong Estratehiya",
        feature3Desc: "Mga halimbawa ng leksyon gamit ang AI sa pagtuturo ng Filipino",
        feature4Title: "Mga Paborito",
        feature4Desc: "I-bookmark ang mga madalas gamiting AI tools",
        feature5Title: "Pagsubaybay sa Progreso",
        feature5Desc: "Subaybayan ang iyong natapos na mga tutorial",
        feature6Title: "Dark Mode",
        feature6Desc: "Komportableng pag-aaral kahit gabi na",
        
        // Footer
        footerTitle: "AI Instructional Toolkit",
        footerSub: "Filipino 107 - Inobatibong Pagtuturo ng Filipino",
        footerMenu: "Menu",
        footerFeatures: "Mga Tampok",
        footerTools: "AI Kasangkapan",
        footerLogin: "Mag-login",
        footerSupport: "Suporta",
        footerHelp: "Help Center",
        footerContact: "Makipag-ugnayan",
        footerLegal: "Legal",
        footerPrivacy: "Patakaran sa Privacy",
        footerTerms: "Terms of Use",
        footerCopyright: "© 2024 AI Integrated Instructional Toolkit | Filipino 107 - Tarlac State University",
        footerResearch: "Isang proyektong pananaliksik para sa inobatibong pagtuturo ng Filipino",
        
        // Login Page
        loginTitle: "Mag-login - AI Instructional Toolkit",
        loginWelcome: "Maligayang Pagbabalik",
        loginSubtitle: "Mag-login para ma-access ang AI Instructional Toolkit",
        loginEmail: "Email ng Grupo",
        loginPassword: "Password",
        loginPlaceholderEmail: "group@research.com",
        loginPlaceholderPassword: "Ilagay ang iyong password",
        loginRemember: "Tandaan ako",
        loginForgot: "Nakalimutan ang password?",
        loginBtn: "Mag-login",
        loginFooter: "⚠️ Para lamang sa awtorisadong miyembro ng Filipino 107 research group",
        loginFooterSmall: "Tarlac State University - College of Education | Filipino 107",
        loginError: "Mali ang email o password. Pakisubukang muli.",
        loginQuote: "Ang teknolohiya ay kasangkapan, ngunit ang guro ang siyang nagbibigay-buhay sa pagkatuto",
        loginQuoteAuthor: "Filipino 107 Research Group",
        
        // Dashboard
        dashboardWelcome: "Maligayang Pagbabalik,",
        dashboardSubtitle: "Ipagpatuloy ang iyong pag-aaral ng AI tools para sa inobatibong pagtuturo ng Filipino.",
        dashboardSearch: "Maghanap ng AI tools...",
        dashboardAllTools: "Lahat ng Kasangkapan",
        dashboardChatbots: "Chatbots",
        dashboardWriting: "Pagsulat",
        dashboardResearch: "Pananaliksik",
        dashboardFavorites: "Mga Paborito",
        dashboardStreak: "Sunod-sunod na Araw",
        dashboardDays: "araw",
        dashboardCompleted: "natapos na tutorial",
        
        // Tool Pages
        toolMarkComplete: "Markahan bilang Tapos",
        toolCompleted: "Tapos na!",
        toolProTip: "Pro Tip",
        
        // Logout
        logoutTitle: "Lumabas na...",
        logoutMessage: "Salamat sa paggamit ng AI Instructional Toolkit",
        
        // Common
        back: "Bumalik",
        logout: "Lumabas",
        viewTutorial: "Tingnan ang Tutorial →"
    }
};

// Current language (default: English)
let currentLang = localStorage.getItem("language") || "en";

// Function to apply translations to the page
function applyTranslations() {
    const elements = document.querySelectorAll("[data-key]");
    elements.forEach(element => {
        const key = element.getAttribute("data-key");
        if (translations[currentLang][key]) {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                element.placeholder = translations[currentLang][key];
            } else {
                element.innerHTML = translations[currentLang][key];
            }
        }
    });
    
    // Update language toggle button text
    const langToggle = document.getElementById("langToggle");
    if (langToggle) {
        langToggle.innerHTML = currentLang === "en" ? 
            '<i class="fas fa-globe"></i> Filipino' : 
            '<i class="fas fa-globe"></i> English';
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang === "en" ? "en" : "tl";
}


// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('show');
            }
        });
        
        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('show');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('show');
            
            // Change icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});


// Initialize language switcher
function initLanguageSwitcher() {
    const langToggle = document.getElementById("langToggle");
    if (langToggle) {
        langToggle.addEventListener("click", () => {
            currentLang = currentLang === "en" ? "fil" : "en";
            localStorage.setItem("language", currentLang);
            applyTranslations();
        });
    }
    
    applyTranslations();
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initLanguageSwitcher();
});