// ========== OFFLINE DATA STORAGE ==========

// Save all tools data to localStorage for offline access
function cacheToolsOffline() {
    const toolsData = [
        { id: "gemini", name: "Google Gemini", icon: "fab fa-google", category: "chat", description: "Google's most advanced AI model - Best for Filipino language tasks", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "copilot", name: "Microsoft Copilot", icon: "fab fa-microsoft", category: "chat", description: "AI powered by GPT-4 - Great for lesson planning", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "perplexity", name: "Perplexity AI", icon: "fas fa-search", category: "research", description: "AI search engine with citations - Perfect for research", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "jasper", name: "Jasper AI", icon: "fas fa-pen-fancy", category: "writing", description: "Content writing assistant - For creating Filipino materials", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "character-ai", name: "Character AI", icon: "fas fa-comment-dots", category: "chat", description: "Chat with AI characters - Interactive learning", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "poe", name: "Poe", icon: "fas fa-feather", category: "chat", description: "Multi-bot chat platform - Access multiple AI models", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "pi-ai", name: "Pi AI", icon: "fas fa-brain", category: "chat", description: "Personal intelligence assistant - Friendly conversation", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "gizmo", name: "Gizmo", icon: "fas fa-cogs", category: "learning", description: "AI learning platform - Gamified learning", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "dola", name: "Dola", icon: "fas fa-chart-bar", category: "research", description: "AI data assistant - Analyze educational data", videoUrl: "https://www.youtube.com/embed/..." },
        { id: "youchat", name: "Deepseek", icon: "fas fa-comment", category: "chat", description: "AI search assistant - Quick answers", videoUrl: "https://www.youtube.com/embed/..." }
    ];

    localStorage.setItem('toolsData', JSON.stringify(toolsData));
}

// Load tools from offline cache
function loadToolsOffline() {
    const cached = localStorage.getItem('toolsData');
    if (cached) {
        return JSON.parse(cached);
    }
    return null;
}

// Initialize offline data on first visit
if (!localStorage.getItem('toolsData')) {
    cacheToolsOffline();
}