// Mouse trail for dark mode
let mouseTrail = [];
const trailLength = 8;

document.addEventListener('mousemove', (e) => {
    if(document.documentElement.getAttribute('data-theme') === 'dark') {
        createTrailDot(e.pageX, e.pageY);
    }
});

function createTrailDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    document.body.appendChild(dot);

    setTimeout(() => dot.remove(), 600);
}