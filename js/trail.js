// Mouse trail for dark mode
let mouseTrail = [];
const trailLength = 8;
var drawTrail = true;

document.addEventListener('mousemove', (e) => {
    if(document.documentElement.getAttribute('data-theme') === 'dark' && drawTrail) {
        createTrailDot(e.pageX, e.pageY);
    } else {
        createTrailSquare(e.pageX, e.pageY)
    }
});

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