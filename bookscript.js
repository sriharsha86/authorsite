// Read More Toggle
document.querySelector('.read-more').addEventListener('click', function() {
    const description = document.querySelector('.book-description');
    this.textContent = description.classList.toggle('expanded') ? 'Read Less' : 'Read More';
});

// Button Hover Effect
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });
});