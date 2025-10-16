/**
 * Professional HTML Course - Main JavaScript
 * Interactive functionality for the HTML course website
 */

// ==========================================================================
// DOM Ready and Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeTabSystem();
    initializeProgressTracking();
    initializeAnimations();
    initializeNavigation();
    initializeSearchFunctionality();
    initializeLessonInteractions();
    initializeThemeToggle();
    
    // Load saved progress
    loadProgress();
    
    console.log('HTML Course initialized successfully');
});

// ==========================================================================
// Tab System
// ==========================================================================

let currentTab = 'lessons'; // Default tab

function initializeTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Show default tab
    switchTab(currentTab);
}

function switchTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active class from all tabs and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);
    
    if (activeButton && activeContent) {
        activeButton.classList.add('active');
        activeContent.classList.add('active');
        currentTab = tabId;
        
        // Trigger animations for the active tab
        triggerTabAnimations(activeContent);
        
        // Update URL hash
        history.replaceState(null, null, `#${tabId}`);
    }
}

function triggerTabAnimations(tabContent) {
    const animatedElements = tabContent.querySelectorAll('.lesson-card, .project-card, .feature-card, .resource-category');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ==========================================================================
// Progress Tracking System
// ==========================================================================

let courseProgress = {
    completedLessons: [],
    totalLessons: 15,
    startDate: null,
    lastAccessed: null
};

function initializeProgressTracking() {
    updateProgressDisplay();
    
    // Track lesson interactions
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach((card, index) => {
        const lessonNumber = index + 1;
        
        // Add click tracking
        card.addEventListener('click', () => {
            trackLessonAccess(lessonNumber);
        });
        
        // Add completion checkbox
        addCompletionCheckbox(card, lessonNumber);
    });
}

function trackLessonAccess(lessonNumber) {
    if (!courseProgress.startDate) {
        courseProgress.startDate = new Date().toISOString();
    }
    
    courseProgress.lastAccessed = new Date().toISOString();
    
    // You can add analytics here
    console.log(`Lesson ${lessonNumber} accessed`);
    
    saveProgress();
}

function markLessonComplete(lessonNumber) {
    if (!courseProgress.completedLessons.includes(lessonNumber)) {
        courseProgress.completedLessons.push(lessonNumber);
        updateProgressDisplay();
        saveProgress();
        
        // Show completion animation
        showCompletionAnimation(lessonNumber);
    }
}

function addCompletionCheckbox(card, lessonNumber) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'lesson-checkbox';
    checkbox.checked = courseProgress.completedLessons.includes(lessonNumber);
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            markLessonComplete(lessonNumber);
        } else {
            const index = courseProgress.completedLessons.indexOf(lessonNumber);
            if (index > -1) {
                courseProgress.completedLessons.splice(index, 1);
                updateProgressDisplay();
                saveProgress();
            }
        }
    });
    
    const actions = card.querySelector('.lesson-actions');
    if (actions) {
        const checkboxContainer = document.createElement('label');
        checkboxContainer.className = 'checkbox-container';
        checkboxContainer.innerHTML = `
            <input type="checkbox" class="lesson-checkbox" ${checkbox.checked ? 'checked' : ''}>
            <span class="checkmark">✓</span>
            <span class="checkbox-label">Complete</span>
        `;
        
        checkboxContainer.querySelector('input').addEventListener('change', checkbox.onchange);
        actions.appendChild(checkboxContainer);
    }
}

function updateProgressDisplay() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const miniProgressFills = document.querySelectorAll('.mini-progress-fill');
    
    const completedCount = courseProgress.completedLessons.length;
    const progressPercentage = (completedCount / courseProgress.totalLessons) * 100;
    
    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${completedCount} of ${courseProgress.totalLessons} lessons completed (${Math.round(progressPercentage)}%)`;
    }
    
    // Update mini progress bars in footer
    miniProgressFills.forEach(fill => {
        fill.style.width = `${progressPercentage}%`;
    });
    
    // Update lesson card states
    updateLessonCardStates();
}

function updateLessonCardStates() {
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach((card, index) => {
        const lessonNumber = index + 1;
        const isCompleted = courseProgress.completedLessons.includes(lessonNumber);
        
        if (isCompleted) {
            card.classList.add('completed');
            const checkbox = card.querySelector('.lesson-checkbox');
            if (checkbox) checkbox.checked = true;
        } else {
            card.classList.remove('completed');
        }
    });
}

function showCompletionAnimation(lessonNumber) {
    // Create celebration animation
    const celebration = document.createElement('div');
    celebration.className = 'completion-celebration';
    celebration.innerHTML = '🎉 Lesson Complete! 🎉';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 3000);
}

// ==========================================================================
// Navigation & Smooth Scrolling
// ==========================================================================

function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update navigation on scroll
    window.addEventListener('scroll', updateNavigationState);
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchTab(hash);
        }
    });
}

function updateNavigationState() {
    const header = document.querySelector('.site-header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ==========================================================================
// Search Functionality
// ==========================================================================

function initializeSearchFunctionality() {
    // Create search input if it doesn't exist
    createSearchInterface();
    
    const searchInput = document.getElementById('course-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', showSearchSuggestions);
    }
}

function createSearchInterface() {
    const header = document.querySelector('.header-nav');
    if (header && !document.getElementById('course-search')) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="course-search" placeholder="Search lessons, topics..." class="search-input">
            <div class="search-results" id="search-results"></div>
        `;
        
        header.appendChild(searchContainer);
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const searchResults = document.getElementById('search-results');
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }
    
    const results = searchLessons(query);
    displaySearchResults(results);
}

function searchLessons(query) {
    const lessons = [
        { number: 1, title: 'Introduction to HTML', topics: ['html', 'basics', 'structure'] },
        { number: 2, title: 'HTML Document Structure', topics: ['doctype', 'head', 'body'] },
        { number: 3, title: 'Text Elements', topics: ['paragraphs', 'headings', 'formatting'] },
        { number: 4, title: 'Links and Navigation', topics: ['links', 'anchors', 'navigation'] },
        { number: 5, title: 'Images and Media', topics: ['images', 'media', 'multimedia'] },
        { number: 6, title: 'Lists and Tables', topics: ['lists', 'tables', 'data'] },
        { number: 7, title: 'Forms and Input', topics: ['forms', 'input', 'validation'] },
        { number: 8, title: 'Semantic Elements', topics: ['semantic', 'html5', 'structure'] },
        { number: 9, title: 'HTML5 Features', topics: ['html5', 'modern', 'features'] },
        { number: 10, title: 'Audio and Video', topics: ['audio', 'video', 'multimedia'] },
        { number: 11, title: 'Canvas and SVG', topics: ['canvas', 'svg', 'graphics'] },
        { number: 12, title: 'Web APIs', topics: ['apis', 'geolocation', 'storage'] },
        { number: 13, title: 'Accessibility', topics: ['accessibility', 'a11y', 'inclusive'] },
        { number: 14, title: 'Performance', topics: ['performance', 'optimization', 'speed'] },
        { number: 15, title: 'Best Practices', topics: ['best practices', 'standards', 'modern'] }
    ];
    
    return lessons.filter(lesson => {
        const titleMatch = lesson.title.toLowerCase().includes(query);
        const topicMatch = lesson.topics.some(topic => topic.includes(query));
        return titleMatch || topicMatch;
    });
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
        searchResults.innerHTML = results.map(lesson => `
            <div class="search-result" onclick="goToLesson(${lesson.number})">
                <strong>Lesson ${lesson.number}</strong>: ${lesson.title}
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

function goToLesson(lessonNumber) {
    switchTab('lessons');
    const lessonCard = document.querySelector(`.lesson-card:nth-child(${lessonNumber})`);
    if (lessonCard) {
        lessonCard.scrollIntoView({ behavior: 'smooth' });
        lessonCard.classList.add('highlight');
        setTimeout(() => lessonCard.classList.remove('highlight'), 2000);
    }
    
    // Hide search results
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('course-search').value = '';
}

// ==========================================================================
// Lesson Interactions
// ==========================================================================

function initializeLessonInteractions() {
    // Add hover effects and interactions
    const interactiveCards = document.querySelectorAll('.lesson-card, .project-card, .feature-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

function handleCardHover(event) {
    const card = event.currentTarget;
    card.style.transform = 'translateY(-8px) scale(1.02)';
}

function handleCardLeave(event) {
    const card = event.currentTarget;
    card.style.transform = '';
}

function handleKeyboardNavigation(event) {
    // Arrow key navigation for lesson cards
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const focusedElement = document.activeElement;
        const lessonCards = Array.from(document.querySelectorAll('.lesson-card'));
        const currentIndex = lessonCards.indexOf(focusedElement);
        
        if (currentIndex >= 0) {
            event.preventDefault();
            let nextIndex;
            
            if (event.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % lessonCards.length;
            } else {
                nextIndex = (currentIndex - 1 + lessonCards.length) % lessonCards.length;
            }
            
            lessonCards[nextIndex].focus();
        }
    }
}

// ==========================================================================
// Animations
// ==========================================================================

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.lesson-card, .project-card, .feature-card, .module-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add staggered animation delays
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// ==========================================================================
// Theme Toggle
// ==========================================================================

function initializeThemeToggle() {
    // Create theme toggle button
    createThemeToggle();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('html-course-theme') || 'light';
    setTheme(savedTheme);
}

function createThemeToggle() {
    const header = document.querySelector('.header-nav');
    if (header && !document.getElementById('theme-toggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        
        themeToggle.addEventListener('click', toggleTheme);
        header.appendChild(themeToggle);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('html-course-theme', theme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }
}

// ==========================================================================
// Data Persistence
// ==========================================================================

function saveProgress() {
    try {
        localStorage.setItem('html-course-progress', JSON.stringify(courseProgress));
    } catch (error) {
        console.warn('Could not save progress:', error);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('html-course-progress');
        if (saved) {
            courseProgress = { ...courseProgress, ...JSON.parse(saved) };
            updateProgressDisplay();
        }
    } catch (error) {
        console.warn('Could not load progress:', error);
    }
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================================================
// Code Playground Integration (Future Enhancement)
// ==========================================================================

function initializeCodePlayground() {
    // This function will be expanded when creating individual lesson pages
    // It will integrate with code editors like CodeMirror or Monaco Editor
    console.log('Code playground ready for lesson pages');
}

// ==========================================================================
// Analytics & Tracking (Optional)
// ==========================================================================

function trackEvent(category, action, label = null) {
    // Integration point for analytics (Google Analytics, etc.)
    console.log('Event tracked:', { category, action, label });
}

function trackPageView(page) {
    // Track page/tab views
    console.log('Page view tracked:', page);
}

// ==========================================================================
// Export functions for global access
// ==========================================================================

window.HTMLCourse = {
    switchTab,
    markLessonComplete,
    goToLesson,
    toggleTheme,
    trackEvent
};

// ==========================================================================
// Performance Monitoring
// ==========================================================================

// Monitor page load performance
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`HTML Course loaded in ${Math.round(loadTime)}ms`);
    
    // Track load time for analytics
    trackEvent('Performance', 'Page Load Time', Math.round(loadTime));
});

// Monitor for errors
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    trackEvent('Error', 'JavaScript Error', event.error.message);
});

// ==========================================================================
// Service Worker Registration (Future Enhancement)
// ==========================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker will be implemented for offline functionality
        console.log('Service worker support detected');
    });
}