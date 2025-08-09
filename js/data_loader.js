// Data loading and management functionality

class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    /**
     * Load JSON data from a given URL with error handling and caching
     */
    async loadJSON(url, useCache = true) {
        try {
            // Check cache first
            if (useCache && this.cache.has(url)) {
                window.log('info', `Using cached data for: ${url}`);
                return this.cache.get(url);
            }

            // Check if already loading to prevent duplicate requests
            if (this.loadingPromises.has(url)) {
                window.log('info', `Awaiting existing request for: ${url}`);
                return await this.loadingPromises.get(url);
            }

            window.log('info', `Loading: ${url}`);

            // Create loading promise
            const loadPromise = this.fetchWithRetry(url);
            this.loadingPromises.set(url, loadPromise);

            const data = await loadPromise;

            // Cache the result
            if (useCache) {
                this.cache.set(url, data);
            }

            // Clean up loading promise
            this.loadingPromises.delete(url);

            window.log('info', `Successfully loaded: ${url}`);
            return data;

        } catch (error) {
            // Clean up loading promise on error
            this.loadingPromises.delete(url);

            window.log('error', `Error loading ${url}:`, error);

            // Return appropriate fallback data
            return this.getFallbackData(url);
        }
    }

    /**
     * Fetch with retry logic and exponential backoff
     */
    async fetchWithRetry(url, attempt = 1) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${url}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            if (attempt >= CONFIG.UI.retryAttempts) {
                throw error;
            }

            // Exponential backoff: 2s, 4s, 8s...
            const delay = Math.pow(2, attempt) * CONFIG.UI.retryDelay;
            window.log('warn', `Retry ${attempt}/${CONFIG.UI.retryAttempts} for ${url} in ${delay}ms`);

            await new Promise(resolve => setTimeout(resolve, delay));
            return this.fetchWithRetry(url, attempt + 1);
        }
    }

    /**
     * Get fallback data based on the URL
     */
    getFallbackData(url) {
        if (url.includes('personal.json')) {
            return CONFIG.FALLBACK_DATA.personal;
        }

        // Return null for other files to indicate loading failed
        return null;
    }

    /**
     * Load all portfolio data
     */
    async loadAllData() {
        if (window.portfolioData.loading) {
            window.log('info', 'Data loading already in progress');
            return;
        }

        window.portfolioData.loading = true;

        try {
            // Show global loading state
            this.showGlobalLoading(true);

            // Load all data files in parallel
            const dataPromises = Object.entries(CONFIG.DATA_PATHS).map(([key, path]) => ({
                key,
                promise: this.loadJSON(path)
            }));

            const results = await Promise.allSettled(
                dataPromises.map(item => item.promise)
            );

            // Process results and store in global data object
            dataPromises.forEach((item, index) => {
                const result = results[index];
                if (result.status === 'fulfilled' && result.value) {
                    window.portfolioData[item.key] = result.value;
                    window.log('info', `✅ ${item.key} data loaded successfully`);
                } else {
                    window.log('warn', `❌ Failed to load ${item.key} data`);
                    // Store null to indicate failed loading
                    window.portfolioData[item.key] = null;
                }
            });

            window.portfolioData.loaded = true;
            window.portfolioData.loading = false;

            // Hide global loading state
            this.showGlobalLoading(false);

            window.log('info', 'All data loading completed');

        } catch (error) {
            window.portfolioData.loading = false;
            this.showGlobalLoading(false);
            window.log('error', 'Critical error during data loading:', error);

            if (CONFIG.FEATURES.enableErrorReporting) {
                this.showErrorMessage('Failed to load portfolio data. Please check your internet connection.');
            }

            throw error;
        }
    }

    /**
     * Show/hide global loading indicator
     */
    showGlobalLoading(show) {
        const navbar = document.querySelector('.navbar');

        if (show) {
            navbar.classList.add('loading-data');

            // Add loading spinner to navbar if it doesn't exist
            if (!navbar.querySelector('.navbar-loading')) {
                const loadingSpinner = document.createElement('div');
                loadingSpinner.className = 'navbar-loading';
                loadingSpinner.innerHTML = '<div class="spinner"></div>';
                loadingSpinner.style.cssText = `
                    position: absolute;
                    right: 120px;
                    top: 50%;
                    transform: translateY(-50%);
                `;
                navbar.appendChild(loadingSpinner);
            }

        } else {
            navbar.classList.remove('loading-data');
            const loadingSpinner = navbar.querySelector('.navbar-loading');
            if (loadingSpinner) {
                loadingSpinner.remove();
            }
        }
    }

    /**
     * Show error message to user
     */
    showErrorMessage(message, duration = 10000) {
        // Remove existing error messages
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; padding: 0.25rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(errorDiv);

        // Auto-remove after specified duration
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, duration);
    }

    /**
     * Refresh specific data section
     */
    async refreshData(section) {
        if (!CONFIG.DATA_PATHS[section]) {
            throw new Error(`Unknown data section: ${section}`);
        }

        try {
            const data = await this.loadJSON(CONFIG.DATA_PATHS[section], false); // Don't use cache
            window.portfolioData[section] = data;
            window.log('info', `Refreshed data for: ${section}`);
            return data;
        } catch (error) {
            window.log('error', `Failed to refresh data for ${section}:`, error);
            throw error;
        }
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
        window.log('info', 'Cache cleared');
    }
}

// Create global instance
window.dataLoader = new DataLoader();