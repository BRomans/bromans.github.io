// Add a "Sync with Scholar" button that fetches and displays the JSON to copy
async function generatePublicationsJSON() {
    const publications = await fetchGoogleScholarPublications();
    if (publications) {
        const json = JSON.stringify({
            lastUpdated: new Date().toISOString(),
            publications: publications
        }, null, 2);

        // Show in a modal for copying
        console.log('Copy this JSON to your publications.json file:', json);
        return json;
    }
}

// Render publications with Scholar data
async function renderPublications(container, data) {
    // Try to fetch from local json file first
    let publications = data.publications || getFallbackData('publications').publications;
    if (!publications || publications.length === 0) {
        publications = await fetchGoogleScholarPublications() || await fetchLocalScholarPublications();
        if (!publications || publications.length === 0) {
            console.error('No publications found.');
            container.innerHTML = '<p>No publications available.</p>';
            return;
        }
    }

    // Sort by year (newest first) before rendering
    publications.sort((a, b) => (b.year || 0) - (a.year || 0));

    container.innerHTML = `
        <div class="research-section-description">
            <p>Explore my research contributions in the field of Brain-Computer Interfaces and Machine Learning.</p>
        </div>
        <div class="publications-header">
            <div class="publications-stats">
                <div class="stat-box">
                    <span class="stat-number">${publications.length}</span>
                    <span class="stat-label">Publications</span>
                </div>
                <div class="stat-box">
                    <span class="stat-number">${publications.reduce((sum, p) => sum + (p.citations || 0), 0)}</span>
                    <span class="stat-label">Citations</span>
                </div>
            </div>
            <div class="publications-controls">
                <select id="publicationSort" onchange="sortPublications(this.value)">
                    <option value="year-desc">Year (Newest First)</option>
                    <option value="year-asc">Year (Oldest First)</option>
                    <option value="citations">Most Cited</option>
                    <option value="title">Alphabetical</option>
                </select>
                <a href="https://scholar.google.com/citations?user=iizn9w0AAAAJ&hl=en" 
                   target="_blank" 
                   class="btn btn-secondary">
                    View on GScholar
                </a>
            </div>
        </div>
        <div id="publicationsList" class="publications-list">
            ${renderPublicationCards(publications)}
        </div>
    `;

    // Store for sorting
    window.currentPublications = publications;
}

function renderPublicationCards(publications) {
    return publications.map((pub, index) => `
        <div class="publication-card" data-year="${pub.year}">
            <!--<div class="publication-number">${index + 1}</div>-->
            <div class="publication-content">
                <h3 class="publication-title">
                    ${pub.link ? `<a href="${pub.link}" target="_blank">${pub.title}</a>` : pub.title}
                </h3>
                <p class="publication-authors">${pub.authors}</p>
                <div class="publication-meta">
                    <span class="meta-venue">${pub.venue}</span>
                    <span class="meta-year">${pub.year || 'N/A'}</span>
                    ${pub.citations ? `<span class="meta-citations">🔗 ${pub.citations} citations</span>` : ''}
                </div>
                ${pub.snippet ? `<p class="publication-snippet">${pub.snippet}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function sortPublications(sortBy) {
    if (!window.currentPublications) return;

    let sorted = [...window.currentPublications];

    switch (sortBy) {
        case 'year-desc':
            sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
            break;
        case 'year-asc':
            sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
            break;
        case 'citations':
            sorted.sort((a, b) => (b.citations || 0) - (a.citations || 0));
            break;
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    document.getElementById('publicationsList').innerHTML = renderPublicationCards(sorted);
}


async function fetchGoogleScholarPublications() {
    const scholarId = 'iizn9w0AAAAJ';
    const proxyUrl = 'https://corsproxy.io/?';
    const scholarUrl = `https://scholar.google.com/citations?user=${scholarId}&hl=en&cstart=0&pagesize=100`;

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(scholarUrl));
        const html = await response.text();

        // Parse the HTML to extract publications
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const publications = [];
        const rows = doc.querySelectorAll('#gsc_a_t .gsc_a_tr');

        rows.forEach(row => {
            const titleElement = row.querySelector('.gsc_a_at');
            const authorsElement = row.querySelector('.gs_gray:first-of-type');
            const venueElement = row.querySelector('.gs_gray:last-of-type');
            const yearElement = row.querySelector('.gsc_a_y');
            const citationsElement = row.querySelector('.gsc_a_c');

            if (titleElement) {
                publications.push({
                    title: titleElement.textContent,
                    link: titleElement.href ? `https://scholar.google.com${titleElement.getAttribute('href')}` : null,
                    authors: authorsElement?.textContent || '',
                    venue: venueElement?.textContent || '',
                    year: parseInt(yearElement?.textContent) || null,
                    citations: parseInt(citationsElement?.textContent) || 0
                });
            }
        });

        return publications;
    } catch (error) {
        console.error('Error fetching Scholar data:', error);
        return null;
    }
}

async function fetchLocalScholarPublications() {

    try {
        //const response = await fetch(proxyUrl + encodeURIComponent(scholarUrl));
        const response = await fetch("data/scholar.json");
        const jsonData = await response.json();
        const html = await jsonData.contents;

        // Parse the HTML to extract publications
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const publications = [];
        const rows = doc.querySelectorAll('#gsc_a_t .gsc_a_tr');

        rows.forEach(row => {
            const titleElement = row.querySelector('.gsc_a_at');
            const authorsElement = row.querySelector('.gs_gray:first-of-type');
            const venueElement = row.querySelector('.gs_gray:last-of-type');
            const yearElement = row.querySelector('.gsc_a_y');
            const citationsElement = row.querySelector('.gsc_a_c');

            if (titleElement) {
                publications.push({
                    title: titleElement.textContent,
                    link: titleElement.href ? `https://scholar.google.com${titleElement.getAttribute('href')}` : null,
                    authors: authorsElement?.textContent || '',
                    venue: venueElement?.textContent || '',
                    year: parseInt(yearElement?.textContent) || null,
                    citations: parseInt(citationsElement?.textContent) || 0
                });
            }
        });

        return publications;
    } catch (error) {
        console.error('Error fetching Scholar data:', error);
        return null;
    }
}