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