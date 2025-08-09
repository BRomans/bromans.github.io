// View management and navigation functionality

class ViewManager {
    constructor() {
        this.currentView = 'about';
        this.loadedViews = new Set();
        this.viewHistory = [];
    }

    /**
     * Show a specific view with smooth transitions
     */
    showView(viewName, addToHistory = true) {
        if (!this.isValidView(viewName)) {
            window.log('error', `Invalid view name: ${viewName}`);
            return;
        }

        // Add to history for browser navigation
        if (addToHistory && viewName !== this.currentView) {
            this.viewHistory.push(this.currentView);
            window.history.pushState({ view: viewName }, '', `#${viewName}`);
        }

        // Update current view
        this.currentView = viewName;

        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
        });

        // Update navigation links
        this.updateNavigation(viewName);

        // Show selected view with delay for smooth transition
        const targetView = document.getElementById(viewName);
        if (targetView) {
            setTimeout(() => {
                targetView.classList.add('active');

                // Load content if not already loaded
                if (!this.loadedViews.has(viewName)) {
                    this.loadViewContent(viewName);
                }
            }, 50);
        }

        // Close mobile menu if open
        this.closeMobileMenu();

        window.log('info', `Switched to view: ${viewName}`);
    }

    /**
     * Update navigation active states
     */
    updateNavigation(activeView) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');

            // Find the link that corresponds to the active view
            const onclick = link.getAttribute('onclick');
            if (onclick && onclick.includes(`'${activeView}'`)) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Load content for a specific view
     */
    async loadViewContent(viewName) {
        try {
            // Wait for data to be loaded if it's still loading
            if (window.portfolioData.loading) {
                window.log('info', `Waiting for data to load before rendering ${viewName}`);
                await this.waitForDataLoad();
            }

            switch (viewName) {
                case 'about':
                    window.contentLoader.loadAboutContent();
                    break;
                case 'career':
                    window.contentLoader.loadCareerContent();
                    break;
                case 'education':
                    window.contentLoader.loadEducationContent();
                    break;
                case 'projects':
                    window.contentLoader.loadProjectsContent();
                    break;
                case 'publications':
                    window.contentLoader.loadPublicationsContent();
                    break;
                case 'art':
                    window.contentLoader.loadArtContent();
                    break;
                case 'music':
                    window.contentLoader.loadMusicContent();
                    break;
                default:
                    window.log('warn', `No content loader for view: ${viewName}`);
            }

            // Mark view as loaded
            this.loadedViews.add(viewName);

        } catch (error) {
            window.log('error', `Error loading content for ${viewName}:`, error);
            this.showViewError(viewName, error);
        }
    }

    /**
     * Wait for data to finish loading
     */
    async waitForDataLoad(timeout = 10000) {
        const startTime = Date.now();

        while (window.portfolioData.loading && (Date.now() - startTime) < timeout) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (window.portfolioData.loading) {
            throw new Error('Data loading timed out in waitForDataLoad');