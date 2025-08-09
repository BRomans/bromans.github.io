// Content loading functions for different portfolio sections

class ContentLoader {

    /**
     * Load About section content
     */
    loadAboutContent() {
        const personal = window.portfolioData.personal;
        const aboutContent = document.getElementById('aboutContent');

        if (!personal) {
            window.log('error', 'Personal data not loaded');
            aboutContent.innerHTML = this.getErrorHTML('personal information');
            return;
        }

        // Update hero section
        this.updateHeroSection(personal);

        // Update bio section
        aboutContent.innerHTML = `
            <p>${personal.bio}</p>
            <div style="margin-top: 2rem; text-align: center;">
                <p><i class="fas fa-map-marker-alt"></i> ${personal.location}</p>
                <p><i class="fas fa-envelope"></i> <a href="mailto:${personal.email}">${personal.email}</a></p>
                ${this.renderDownloadButtons(personal)}
            </div>
        `;
    }

    /**
     * Update hero section with personal data
     */
    updateHeroSection(personal) {
        const heroName = document.getElementById('heroName');
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const profileImage = document.getElementById('profileImage');
        const socialLinks = document.getElementById('socialLinks');

        if (heroName) heroName.textContent = personal.name;
        if (heroTitle) heroTitle.textContent = personal.title;
        if (heroSubtitle) heroSubtitle.textContent = personal.subtitle;
        if (profileImage && personal.image) profileImage.src = personal.image;

        // Update social links
        if (socialLinks && personal.social) {
            const socialLinksHtml = personal.social.map(social =>
                `<a href="${social.url}" class="social-link" target="_blank" rel="noopener">
                    <i class="${social.icon}"></i>
                </a>`
            ).join('');
            socialLinks.innerHTML = socialLinksHtml;
        }
    }

    /**
     * Render download buttons for resume/CV
     */
    renderDownloadButtons(personal) {
        if (!personal.resume_url && !personal.cv_url) return '';

        return `
            <div style="margin-top: 1rem;">
                ${personal.resume_url ? `
                    <a href="${personal.resume_url}" class="btn btn-primary" target="_blank" rel="noopener">
                        <i class="fas fa-download"></i> Download Resume
                    </a>
                ` : ''}
                ${personal.cv_url ? `
                    <a href="${personal.cv_url}" class="btn btn-secondary" target="_blank" rel="noopener">
                        <i class="fas fa-download"></i> Download CV
                    </a>
                ` : ''}
            </div>
        `;
    }

    /**
     * Load Career section content
     */
    loadCareerContent() {
        const experience = window.portfolioData.experience;
        const experienceTimeline = document.getElementById('experienceTimeline');

        if (!experience || !experience.experience) {
            window.log('error', 'Experience data not loaded');
            experienceTimeline.innerHTML = this.getErrorHTML('professional experience');
            return;
        }

        const timelineHtml = experience.experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h3>${exp.title}</h3>
                    <h4><a href="${exp.company_url}" target="_blank" rel="noopener">${exp.company}</a></h4>
                    <p><strong>${exp.period}</strong></p>
                    <p>${exp.description}</p>
                    ${this.renderResponsibilities(exp.responsibilities)}
                    ${this.renderTechnologies(exp.technologies)}
                    ${this.renderAchievements(exp.achievements)}
                    <p><em>${exp.location}</em></p>
                </div>
            </div>
        `).join('');

        experienceTimeline.innerHTML = timelineHtml;
    }

    /**
     * Load Education section content
     */
    loadEducationContent() {
        const education = window.portfolioData.education;
        const educationTimeline = document.getElementById('educationTimeline');

        if (!education) {
            window.log('error', 'Education data not loaded');
            educationTimeline.innerHTML = this.getErrorHTML('education information');
            return;
        }

        // Combine current and completed education
        const allEducation = [
            ...(education.current_education || []),
            ...(education.completed_education || [])
        ];

        const educationHtml = allEducation.map(edu => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <h3>${edu.degree}</h3>
                    <h4>${edu.institution}</h4>
                    <p><strong>${edu.period}</strong></p>
                    <p><strong>Field:</strong> ${edu.field}</p>
                    ${edu.minor ? `<p><strong>Minor:</strong> ${edu.minor}</p>` : ''}
                    ${edu.specialization ? `<p><strong>Specialization:</strong> ${edu.specialization}</p>` : ''}
                    <p>${edu.description}</p>
                    ${edu.thesis_title ? `<p><strong>Thesis:</strong> ${edu.thesis_title}</p>` : ''}
                    ${edu.grade ? `<p><strong>Grade:</strong> ${edu.grade}</p>` : ''}
                    <p><em>${edu.location}</em></p>
                    ${this.renderExchangePrograms(edu.exchange_programs)}
                </div>
            </div>
        `).join('');

        educationTimeline.innerHTML = educationHtml;
    }

    /**
     * Load Projects section content
     */
    loadProjectsContent() {
        const projects = window.portfolioData.projects;
        const projectsGrid = document.getElementById('projectsGrid');

        if (!projects) {
            window.log('error', 'Projects data not loaded');
            projectsGrid.innerHTML = this.getErrorHTML('projects');
            return;
        }

        // Combine featured and regular projects
        const allProjects = [
            ...(projects.featured || []),
            ...(projects.regular || [])
        ];

        const projectsHtml = allProjects.map(project => `
            <div class="card">
                ${project.image ? `<img src="${project.image}" alt="${project.title}" class="card-image" loading="lazy">` : ''}
                <div class="card-content">
                    <h3 class="card-title">${project.title}</h3>
                    ${this.renderAward(project.award)}
                    <p class="card-description">${project.description}</p>
                    ${this.renderVideo(project.videos)}
                    <div class="card-meta">
                        ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-links">
                        ${this.renderLinks(project.links)}
                    </div>
                </div>
            </div>
        `).join('');

        projectsGrid.innerHTML = projectsHtml;
    }

    /**
     * Load Publications section content
     */
    loadPublicationsContent() {
        const publications = window.portfolioData.publications;
        const publicationsGrid = document.getElementById('publicationsGrid');

        if (!publications) {
            window.log('error', 'Publications data not loaded');
            publicationsGrid.innerHTML = this.getErrorHTML('publications');
            return;
        }

        // Combine all publication types
        const allPublications = [
            ...(publications.conference || []),
            ...(publications.journal || []),
            ...(publications.unpublished || [])
        ];

        const publicationsHtml = allPublications.map(pub => `
            <div class="card">
                <div class="card-content">
                    <h3 class="card-title">${pub.title}</h3>
                    <p><strong>Authors:</strong> ${pub.authors.join(', ')}</p>
                    <p><strong>Venue:</strong> ${pub.venue} (${pub.year})</p>
                    <p class="card-description">${pub.abstract}</p>
                    <div class="card-meta">
                        ${(pub.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-links">
                        ${this.renderLinks(pub.links)}
                    </div>
                </div>
            </div>
        `).join('');

        publicationsGrid.innerHTML = publicationsHtml;
    }

    /**
     * Load Art Installations section content
     */
    loadArtContent() {
        const art = window.portfolioData.art;
        const artGrid = document.getElementById('artGrid');

        if (!art || !art.installations) {
            window.log('warn', 'Art installations data not available');
            artGrid.innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <h3 class="card-title">Art Installations</h3>
                        <p class="card-description">Art installations content will be available soon.</p>
                    </div>
                </div>
            `;
            return;
        }

        const artHtml = art.installations.map(installation => `
            <div class="card">
                ${installation.image ? `<img src="${installation.image}" alt="${installation.title}" class="card-image" loading="lazy">` : ''}
                <div class="card-content">
                    <h3 class="card-title">${installation.title}</h3>
                    ${installation.subtitle ? `<h4>${installation.subtitle}</h4>` : ''}
                    ${this.renderAward(installation.award)}
                    <p class="card-description">${installation.description}</p>
                    <p><strong>Year:</strong> ${installation.year} | <strong>Medium:</strong> ${installation.medium}</p>
                    ${this.renderVideo(installation.videos)}
                    <div class="card-meta">
                        ${(installation.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-links">
                        ${this.renderLinks(installation.links)}
                    </div>
                </div>
            </div>
        `).join('');

        artGrid.innerHTML = artHtml;
    }

    /**
     * Load Music section content
     */
    loadMusicContent() {
        const music = window.portfolioData.music;
        const musicGrid = document.getElementById('musicGrid');

        if (!music) {
            window.log('warn', 'Music data not available');
            musicGrid.innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <h3 class="card-title">Music & DJ Sets</h3>
                        <p class="card-description">DJ sets and music production content will be available soon.</p>
                    </div>
                </div>
            `;
            return;
        }

        // Combine performances, releases, and mixes
        const musicContent = [];

        if (music.performances) {
            musicContent.push(...music.performances.map(item => ({...item, type: 'performance'})));
        }
        if (music.releases) {
            musicContent.push(...music.releases.map(item => ({...item, type: 'release'})));
        }
        if (music.mixes) {
            musicContent.push(...music.mixes.map(item => ({...item, type: 'mix'})));
        }

        const musicHtml = musicContent.map(item => `
            <div class="card">
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <h4>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</h4>
                    ${item.date ? `<p><strong>Date:</strong> ${item.date}</p>` : ''}
                    ${item.venue ? `<p><strong>Venue:</strong> ${item.venue}, ${item.location}</p>` : ''}
                    ${item.duration ? `<p><strong>Duration:</strong> ${item.duration}</p>` : ''}
                    <p class="card-description">${item.description}</p>
                    ${item.genres ? `
                        <div class="card-meta">
                            ${item.genres.map(genre => `<span class="tag">${genre}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${this.renderMusicLinks(item.links)}
                </div>
            </div>
        `).join('');

        musicGrid.innerHTML = musicHtml;
    }

    // Helper rendering methods

    renderResponsibilities(responsibilities) {
        if (!responsibilities || responsibilities.length === 0) return '';

        return `
            <h5>Key Responsibilities:</h5>
            <ul>
                ${responsibilities.map(resp => `<li>${resp}</li>`).join('')}
            </ul>
        `;
    }

    renderTechnologies(technologies) {
        if (!technologies || technologies.length === 0) return '';

        return `
            <div class="card-meta">
                ${technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
            </div>
        `;
    }

    renderAchievements(achievements) {
        if (!achievements || achievements.length === 0) return '';

        return `
            <h5>Key Achievements:</h5>
            <ul>
                ${achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
        `;
    }

    renderExchangePrograms(exchangePrograms) {
        if (!exchangePrograms || exchangePrograms.length === 0) return '';

        return exchangePrograms.map(exchange =>
            `<p><em>Exchange: ${exchange.program} at ${exchange.institution}, ${exchange.location}</em></p>`
        ).join('');
    }

    renderAward(award) {
        if (!award) return '';

        const color = award.color || '#fbbf24';
        const textColor = this.getContrastColor(color);

        return `
            <div class="tag" style="background: ${color}; color: ${textColor}; margin-bottom: 1rem;">
                ${award.title}${award.event ? ` - ${award.event}` : ''}
            </div>
        `;
    }

    renderVideo(videos) {
        if (!videos || videos.length === 0) return '';

        const videoUrl = window.utils.createVideoEmbed(videos[0].url);
        return `
            <div class="video-wrapper">
                <iframe src="${videoUrl}" frameborder="0" allowfullscreen loading="lazy"></iframe>
            </div>
        `;
    }

    renderLinks(links) {
        if (!links || links.length === 0) return '';

        return links.map(link => `
            <a href="${link.url}" class="btn btn-secondary" target="_blank" rel="noopener">
                <i class="${link.icon}"></i> ${link.title}
            </a>
        `).join('');
    }

    renderMusicLinks(links) {
        if (!links) return '';

        return `
            <div class="card-links">
                ${Object.entries(links).map(([platform, url]) => `
                    <a href="${url}" class="btn btn-secondary" target="_blank" rel="noopener">
                        <i class="fab fa-${platform}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                `).join('')}
            </div>
        `;
    }

    getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    getErrorHTML(contentType) {
        return `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Unable to load ${contentType}</h3>
                <p>Please check your internet connection and try refreshing the page.</p>
                <button class="btn btn-primary" onclick="window.dataLoader.loadAllData().then(() => window.location.reload())">
                    <i class="fas fa-refresh"></i> Retry
                </button>
            </div>
        `;
    }
}

// Create global instance
window.contentLoader = new ContentLoader();