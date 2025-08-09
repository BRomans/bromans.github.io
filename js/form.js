// Contact form functions
function openContactModal() {
    document.getElementById('contactModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    // Reset form
    document.getElementById('contactForm').reset();
    document.querySelector('.contact-form').style.display = 'block';
    document.querySelector('.form-success').style.display = 'none';
}

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loading').style.display = 'inline-block';
    submitBtn.disabled = true;

    try {
        // Here you would send to your backend or email service
        // For now, we'll simulate with a timeout
        await sendEmail(formData);

        // Show success state
        document.querySelector('.contact-form').style.display = 'none';
        document.querySelector('.form-success').style.display = 'block';

        // Close modal after 3 seconds
        setTimeout(() => {
            closeContactModal();
        }, 3000);

    } catch (error) {
        console.error('Error sending message:', error);
        alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
        // Reset button state
        submitBtn.querySelector('.btn-text').style.display = 'inline-block';
        submitBtn.querySelector('.btn-loading').style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Replace the sendEmail function in your contact form code
async function sendEmail(formData) {
    try {
        const response = await fetch('https://formspree.io/f/xrblrgll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                _subject: `Portfolio Contact: ${formData.subject}`, // Email subject line
                _replyto: formData.email // Reply-to address
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send message');
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Close modal on outside click
document.getElementById('contactModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeContactModal();
    }
});

// Close on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('contactModal').classList.contains('active')) {
        closeContactModal();
    }
});