// Render About content
function renderAbout(container, data) {
    container.innerHTML = `
        <p>${data.bio || getFallbackData('about').bio}</p>
        <!--<canvas id="skillsRadar" width="400" height="400"></canvas>-->
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

    //setTimeout(() => initSkillsRadar(data), 100);
}


// Add to renderAbout function
function createSkillsRadar(skills) {
    return `
        <div class="skills-visualization">
            <canvas id="skillsRadar"></canvas>
        </div>
    `;
}

// Initialize Chart.js radar chart
function initSkillsRadar(data) {
    const ctx = document.getElementById('skillsRadar').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.skills.map(s => s.name),
            datasets: [{
                label: 'Proficiency',
                data: data.skills.map(s => s.level),
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'var(--primary)',
                pointBackgroundColor: 'var(--primary)'
            }]
        }
    });
}