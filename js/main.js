// Data storage
let contentData = {
    about: null,
    career: null,
    education: null,
    projects: null,
    publications: null,
    art: null,
    music: null
};

// Navigation
function navigateToView(viewName) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(viewName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });

    // Load content if needed
    if (viewName !== 'home') {
        loadContent(viewName);
    }

    // Close mobile menu
    document.getElementById('navMenu').classList.remove('active');

    // Smooth scroll to top
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Load content from JSON files
async function loadContent(section) {
    if (contentData[section]) {
        renderContent(section, contentData[section]);
        return;
    }

    try {
        const response = await fetch(`data/${section}.json`);
        if (!response.ok) {
            throw new Error('Content not found');
        }
        const data = await response.json();
        contentData[section] = data;
        renderContent(section, data);
    } catch (error) {
        console.warn(`Loading fallback content for ${section}`);
        renderFallbackContent(section);
    }
}

// Render content based on section
function renderContent(section, data) {
    const container = document.getElementById(`${section}Content`);
    if (!container) return;

    switch (section) {
        case 'about':
            renderAbout(container, data);
            break;
        case 'career':
            renderCareer(container, data);
            break;
        case 'education':
            renderEducation(container, data);
            break
        case 'projects':
            renderProjects(container, data);
            break;
        case 'publications':
            renderPublications(container, data);
            break;
        case 'art':
            renderArt(container, data);
            break;
        case 'music':
            renderMusic(container, data);
            break;
    }
}

// Render About content
function renderAbout(container, data) {
    container.innerHTML = `
        <p>${data.bio || getFallbackData('about').bio}</p>
        ${data.skills ? `
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Skills</h3>
            <div class="hero-tags">
                ${data.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        ` : ''}
        ${data.languages ? `
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Languages</h3>
            <div class="languages-grid">
                ${data.languages.map(lang => `
                    <div class="language-item">
                        <img src="assets/images/flags/${lang.flag}" alt="${lang.name}" class="language-flag">
                        <span class="language-name">${lang.name}</span>
                        <div class="language-level-bar">
                            <div class="level-fill" style="width: ${lang.proficiency}%"></div>
                        </div>
                        <span class="language-level">${lang.level}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
}

// Render Career content
function renderCareer(container, data) {
    const fallback = getFallbackData('career');
    const workData = data.work || fallback.work;

    container.innerHTML = `
        <h3 style="margin-bottom: 2rem;">Work Experience</h3>
        <div class="timeline work-timeline">
            ${workData.map(job => `
                <div class="timeline-item card">
                    <div class="timeline-header">
                        ${job.image ? `<img src="${job.image}" alt="${job.title}" class="timeline-photo">` : ''}
                        <h3>${job.title}</h3>
                    </div>
                    <div class="card-meta">
                        <span class="card-tag">${job.company}</span>
                        <span class="card-tag">${job.period}</span>
                    </div>
                    <p>${job.description}</p>
                    ${job.location ? `<p style="font-size: 0.9rem; opacity: 0.7;"><em>${job.location}</em></p>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function renderEducation(container, data) {
    const fallback = getFallbackData('career');
    const educationData = data.education || fallback.education;

    container.innerHTML = `
        <h3 style="margin-top: 4rem; margin-bottom: 2rem;">Education</h3>
        <div class="timeline education-timeline">
            ${educationData.map(edu => `
                <div class="timeline-item card">
                    <div class="timeline-header">
                        ${edu.image ? `<img src="${edu.image}" alt="${edu.degree}" class="timeline-photo">` : ''}
                        <h3>${edu.degree}</h3>
                    </div>
                    <div class="card-meta">
                        <span class="card-tag">${edu.institution}</span>
                        <span class="card-tag">${edu.period}</span>
                    </div>
                    ${edu.specialization ? `<p>${edu.specialization}</p>` : ''}
                    ${edu.location ? `<p style="font-size: 0.9rem; opacity: 0.7;"><em>${edu.location}</em></p>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Render Projects content
function renderProjects(container, data) {
    const projects = data.projects || getFallbackData('projects').projects;

    container.innerHTML = `
                <div class="grid grid-3">
                    ${projects.map((project, index) => `
                        <div class="card" onclick="showProjectDetails(${index})">
                            ${project.image ? `<img src="${project.image}" alt="${project.title}" class="card-image">` : ''}
                            <h3>${project.title}</h3>
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

// Render Publications content
function renderPublications(container, data) {
    const publications = data.publications || getFallbackData('publications').publications;

    container.innerHTML = `
        <div class="grid grid-2">
            ${publications.map(pub => `
                <div class="card publication-card">
                    ${pub.image ? `
                        <div class="publication-image">
                            <img src="${pub.image}" alt="${pub.title}">
                        </div>
                    ` : ''}
                    <div class="publication-content">
                        <h3>${pub.title}</h3>
                        ${pub.authors ? `
                            <p class="publication-authors">${pub.authors.join(', ')}</p>
                        ` : ''}
                        <div class="card-meta">
                            <span class="card-tag">${pub.type}</span>
                            <span class="card-tag">${pub.year}</span>
                            ${pub.venue ? `<span class="card-tag">${pub.venue}</span>` : ''}
                        </div>
                        <p class="publication-abstract">${pub.abstract || pub.description}</p>
                        ${pub.keywords ? `
                            <div class="publication-keywords">
                                ${pub.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                            </div>
                        ` : ''}
                        <div class="publication-links">
                            ${pub.link ? `<a href="${pub.link}" target="_blank" class="btn btn-secondary">Read Paper</a>` : ''}
                            ${pub.github ? `<a href="${pub.github}" target="_blank" class="btn btn-secondary">View Code</a>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render Art content
function renderArt(container, data) {
    const installations = data.installations || getFallbackData('art').installations;

    container.innerHTML = `
        <div class="art-grid">
            ${installations.map(art => `
                <div class="art-card">
                    <div class="art-media">
                        ${art.image ? `
                            <img src="${art.image}" alt="${art.title}" class="art-image">
                        ` : ''}
                        ${art.video ? `
                            <div class="play-overlay" onclick="playVideo('${art.video}')">
                                <svg width="60" height="60" fill="white" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        ` : ''}
                    </div>
                    <div class="art-content">
                        <div class="art-header">
                            <h3>${art.title}</h3>
                            ${art.award ? `<span class="award-badge">🏆 ${art.award}</span>` : ''}
                        </div>
                        <div class="art-meta">
                            <span class="meta-item">${art.type}</span>
                            <span class="meta-item">${art.year}</span>
                        </div>
                        ${art.venue ? `<p class="art-venue"><strong>${art.venue}</strong></p>` : ''}
                        <p class="art-description">${art.description}</p>
                        
                        ${art.technologies ? `
                            <div class="art-tech">
                                ${art.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                        
                        ${art.collaborators ? `
                            <p class="art-collaborators">
                                <strong>Collaborators:</strong> ${art.collaborators.join(', ')}
                            </p>
                        ` : ''}
                        
                        <div class="art-links">
                            ${art.github ? `<a href="${art.github}" target="_blank" class="btn btn-secondary">View Code</a>` : ''}
                            ${art.video ? `<a href="${art.video}" target="_blank" class="btn btn-secondary">Watch Video</a>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render Music content
function renderMusic(container, data) {
    const music = data || getFallbackData('music');

    container.innerHTML = `
                <div style="margin-bottom: 3rem;">
                    <h3>About My Music</h3>
                    <p>${music.bio || 'Electronic music producer and DJ, exploring the intersection of neuroscience and sound.'}</p>
                </div>

                ${music.releases ? `
                    <h3 style="margin-bottom: 2rem;">Releases</h3>
                    <div class="grid grid-3">
                        ${music.releases.map(release => `
                            <div class="card">
                                ${release.artwork ? `<img src="${release.artwork}" alt="${release.title}" class="card-image">` : ''}
                                <h3>${release.title}</h3>
                                <div class="card-meta">
                                    <span class="card-tag">${release.type}</span>
                                    <span class="card-tag">${release.year}</span>
                                </div>
                                ${release.spotify ? `<a href="${release.spotify}" target="_blank" class="btn btn-secondary">Listen on Spotify</a>` : ''}
                                ${release.soundcloud ? `<a href="${release.soundcloud}" target="_blank" class="btn btn-secondary">SoundCloud</a>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${music.performances ? `
                    <h3 style="margin-top: 3rem; margin-bottom: 2rem;">Recent Performances</h3>
                    <div class="grid grid-2">
                        ${music.performances.map(gig => `
                            <div class="card">
                                <h3>${gig.event}</h3>
                                <div class="card-meta">
                                    <span class="card-tag">${gig.venue}</span>
                                    <span class="card-tag">${gig.date}</span>
                                </div>
                                <p>${gig.description || ''}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
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
                ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 12px; margin: 1rem 0;">` : ''}
                ${project.video ? `
                    <div class="video-container">
                        <iframe src="${getVideoEmbed(project.video)}" allowfullscreen></iframe>
                    </div>
                ` : ''}
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

// Convert video URLs to embed format
function getVideoEmbed(url) {
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
}

// Fallback content
function getFallbackData(section) {
    const fallbackData = {
        about: {
            bio: "I am Michele Romani, a PhD student in Computer Science specializing in Brain-Computer Interfaces. I come from Asola, a little town in Northern Italy near the beautiful Garda lake. As far as I remember, I have always been passionate about understanding our relationship with technology. I strongly believe that my work should have a positive impact on the relationship between humans and technology, and that AI will play a major role in better understanding the underlying cognitive processes of the brain. At the core, I see myself as a designer: my work lies at the intersection between technology and human behavior, focused on enhancing the interaction between users and computers through Human-Centered AI applications.",
            skills: ["Machine Learning", "Python", "Unity", "Brain-Computer Interfaces", "Signal Processing", "Creative Design", "Deep Learning", "C++", "C#"]
        },
        career: {
            work: [
                {
                    title: "Research & Development",
                    company: "g.tec Medical Engineering GmbH",
                    period: "Sept 2023 - May 2024",
                    description: "Development of Brain-Computer Interfaces for Gaming",
                    location: "Schiedlberg, Austria"
                },
                {
                    title: "Research Engineer",
                    company: "myBrainTechnologies",
                    period: "Apr 2022 - Jul 2023",
                    description: "Research and development of ML pipelines in Python for neuroscience applications.",
                    location: "Paris, France"
                },
                {
                    title: "Research Engineer, Intern",
                    company: "University of Twente - myBrainTechnologies",
                    period: "Mar 2021 - Sep 2021",
                    description: "Research project in Python on emotions classification during music listening.",
                    location: "Enschede, The Netherlands"
                }
            ],
            education: [
                {
                    degree: "PhD in Computer Science",
                    institution: "Università di Trento",
                    image: "assets/images/avatar.jpg",
                    period: "2023 - Present",
                    specialization: "Brain-Computer Interfaces for Gaming",
                    location: "Trento, Italy"
                },
                {
                    degree: "MSc HCI & Design",
                    institution: "University of Twente & Université Paris-Saclay",
                    period: "2019 - 2021",
                    specialization: "Intelligent Systems & Situated Interaction",
                    location: "Netherlands & France"
                },
                {
                    degree: "BSc Computer Science",
                    institution: "Università di Trento",
                    period: "2013 - 2017",
                    specialization: "Minor in Economics and Finance",
                    location: "Trento, Italy"
                }
            ]
        },
        projects: {
            projects: [
                {
                    title: "BCHJam",
                    description: "Neuro controller for live music performance in shared Mixed Reality environments.",
                    fullDescription: "BCHJam is a neuro controller for live music performance in shared Mixed Reality environments. The musician, equipped with a BCI, can use brain input to activate effects and control the music in real-time. Alpha and beta waves generate visual effects visible to the audience using mixed reality headsets.",
                    tags: ["BCI", "Machine Learning", "Unity", "Mixed Reality"],
                    award: "1st Place - BR41N.IO 2024",
                    github: "https://github.com/BRomans/BCHJam",
                    image: "assets/projects/BCHJam/bchjam.png",
                    video: "https://youtube.com/watch?v=...",
                },
                {
                    title: "NervCon",
                    description: "Powerful overlay controller integrating BCI technology with games.",
                    fullDescription: "NervCon is a powerfful overlay controller designed to seamlessly integrate Brain-Computer Interface (BCI) technology with your favourite games. This innovative controller allows users to control games using their brain signals, making gaming more immersive and accessible.",
                    tags: ["BCI", "Unity", "Gaming", "Machine Learning"],
                    award: "1st Place - NTX Global Hackathon 2023",
                    github: "https://github.com/unicorn-bi/NervCon",
                    image: "assets/projects/NervCon/nervcon.png"
                },
                {
                    title: "P.E.R.S.O.N.A.",
                    description: "AI for artistic expression of human empathy.",
                    fullDescription: "P.E.R.S.O.N.A. is an AI created for artistic expression of human empathy. A participatory experience of an interactive reinforcement learning model that learns to communicate with humans through facial expressions and proximity sensors.",
                    tags: ["AI", "Machine Learning", "Unreal Engine", "Arduino"],
                    award: "3rd Place - CREARTATHON 2021",
                    github: "https://github.com/BRomans/PERSONA",
                    image: "assets/projects/PERSONA/poster.png"
                }
            ]
        },
        publications: {
            publications: [
                {
                    title: "BCHJam: a Brain-Computer Music Interface for Live Music Performance",
                    type: "Conference Paper",
                    year: "2024",
                    venue: "IEEE",
                    abstract: "Integration of brain-computer interfaces and mixed reality headsets in Internet of Musical Things performance ecosystems.",
                    link: "https://ieeexplore.ieee.org/document/10704087",
                    github: "https://github.com/BRomans/BCHJam"
                },
                {
                    title: "Hybrid Harmony: A Multi-Person Neurofeedback Application",
                    type: "Journal Article",
                    year: "2021",
                    venue: "Frontiers in Neuroergonomics",
                    abstract: "Hyperscanning research demonstrating brain activity synchronization across people during social interaction.",
                    link: "https://www.frontiersin.org/articles/10.3389/fnrgo.2021.687108/full"
                }
            ]
        },
        art: {
            installations: [
                {
                    title: "Neural Resonance",
                    year: "2024",
                    description: "Interactive installation using EEG to create real-time visual and audio experiences.",
                    venue: "Digital Art Festival",
                    image: "assets/art/neural_resonance.jpg"
                }
            ]
        },
        music: {
            bio: "Electronic music producer and DJ, exploring the intersection of neuroscience and sound design. My sets blend techno, ambient, and experimental electronic music, often incorporating live brain-computer interface performances.",
            releases: [],
            performances: []
        }
    };

    return fallbackData[section] || {};
}

// Render fallback content
function renderFallbackContent(section) {
    const fallbackData = getFallbackData(section);
    renderContent(section, fallbackData);
}

// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', function () {
    document.getElementById('navMenu').classList.toggle('active');
});

// Nav item clicks
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
        const view = this.dataset.view;
        navigateToView(view);
    });
});

// Close modal on outside click
document.getElementById('projectModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Handle scroll effect on navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Check for hash navigation
    if (window.location.hash) {
        const view = window.location.hash.substring(1);
        navigateToView(view);
    }
});

// Handle browser back/forward
window.addEventListener('hashchange', function () {
    const view = window.location.hash.substring(1) || 'home';
    navigateToView(view);
});