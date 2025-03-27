document.addEventListener('DOMContentLoaded', () => {
    // Portrait hover effect
    const portrait = document.querySelector('.portrait-frame');
    
    const handleMouseMove = (e) => {
        if(window.innerWidth > 768) {
            const rect = portrait.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            portrait.style.transform = `
                rotateX(${y * 10}deg)
                rotateY(${x * 10}deg)
                translateZ(20px)
            `;
        }
    };

    const resetPosition = () => {
        if(window.innerWidth > 768) {
            portrait.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
        }
    };

    portrait.addEventListener('mousemove', handleMouseMove);
    portrait.addEventListener('mouseleave', resetPosition);

    // Intersection Observer for fade-up effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.bio-title, .intro-text, .bio-details').forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});