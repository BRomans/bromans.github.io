function renderProjects(container, data) {
    const projects = data.projects || getFallbackData('projects').projects;

    // Extract unique tags
    const allTags = [...new Set(projects.flatMap(p => p.tags || []))];

    container.innerHTML = `
        <div class="project-filters">
            <button class="filter-btn active" onclick="filterProjects('all')">All</button>
            ${allTags.map(tag => `
                <button class="filter-btn" onclick="filterProjects('${tag}')">${tag}</button>
            `).join('')}
        </div>
        <div class="grid grid-3" id="projectsGrid">
            ${projects.map((project, index) => `
                <div class="card project-card" data-tags="${(project.tags || []).join(',')}" onclick="showProjectDetails(${index})">
                     ${project.image ? `<img src="${project.image}" alt="${project.title}" class="card-image" fetchpriority="high" >` : ''}
                     <div class="card-title">
                                <h3>${project.title}</h3>
                                <h4>(${project.year})</h4>
                     </div>
                    <div class="card-meta">
                        ${project.tags ? project.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('') : ''}
                    </div>
                    <p>${project.description}</p>
                    ${project.award ? `<p style="color: var(--accent); font-weight: 600;">🏆 ${project.award}</p>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Show project details in modal
function showProjectDetails(index) {
    const projects = contentData.projects?.projects || getFallbackData('projects').projects;
    const project = projects[index];

    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
                <h2>${project.title}</h2>
                ${project.video ? `
                    <div class="video-container">
                        <iframe src="${getVideoEmbed(project.video)}" allowfullscreen></iframe>
                    </div>
                ` : `<img src="${project.image}" alt="${project.title}" fetchpriority="high"  style="width: 100%; border-radius: 12px; margin: 1rem 0;">`}
                
                <div class="card-meta" style="margin: 1rem 0;">
                    ${project.tags ? project.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('') : ''}
                </div>
                ${project.award ? `<p style="color: var(--accent); font-weight: 600;">🏆 ${project.award}</p>` : ''}
                <p>${project.fullDescription || project.description}</p>
                <div style="margin-top: 2rem;">
                    ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-primary">View on GitHub</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-secondary">Live Demo</a>` : ''}
                    ${project.paper ? `<a href="${project.paper}" target="_blank" class="btn btn-secondary">Read Paper</a>` : ''}
                </div>
            `;

    modal.classList.add('active');
}


// Close modal
function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
}

// Make filterProjects global
window.filterProjects = function(tag) {
    const buttons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    // Update active button
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent === tag || (tag === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });

    // Filter projects
    projects.forEach(project => {
        if(tag === 'all') {
            project.style.display = 'block';
        } else {
            const tags = project.dataset.tags.split(',');
            project.style.display = tags.includes(tag) ? 'block' : 'none';
        }
    });
}