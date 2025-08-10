const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
let mouseTrailEnabled = false;

// Initialize trail based on device
if (!isMobile) {
    // Enable on desktop by default if you want, or keep it false
    mouseTrailEnabled = localStorage.getItem('mouseTrail') === 'true' || false;
}

// Mouse trail event listener
document.addEventListener('mousemove', (e) => {
    if (!mouseTrailEnabled || isMobile) return;

    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        createTrailDot(e.pageX, e.pageY);
    } else {
        createTrailSquare(e.pageX, e.pageY);
    }
});

// Toggle trail function
function toggleMouseTrail() {
    mouseTrailEnabled = !mouseTrailEnabled;
    localStorage.setItem('mouseTrail', mouseTrailEnabled);

    // Update button appearance
    const btn = document.getElementById('trailToggle');
    if (btn) {
        btn.classList.toggle('active', mouseTrailEnabled);
    }
}

function createTrailDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    document.body.appendChild(dot);

    setTimeout(() => dot.remove(), 300);
}

function createTrailSquare(x, y) {
    const square = document.createElement('div');
    square.className = 'trail-square';
    square.style.left = x + 'px';
    square.style.top = y + 'px';
    document.body.appendChild(square);

    setTimeout(() => square.remove(), 300);
}