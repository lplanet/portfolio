// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Gestion des filtres de projets
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const sortSelect = document.getElementById('sort-select');
    const projectsContainer = document.getElementById('projects-container');

    // Filtrage des projets
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const semestre = card.getAttribute('data-semestre');
                    
                    if (filter === 'all') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else if (semestre && semestre.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Tri des projets
    if (sortSelect && projectsContainer) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const projectsArray = Array.from(projectCards);

            projectsArray.sort((a, b) => {
                if (sortValue === 'recent') {
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    return dateB - dateA; // Plus récent en premier
                } else if (sortValue === 'ancien') {
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    return dateA - dateB; // Plus ancien en premier
                } else if (sortValue === 'alphabetical') {
                    const titleA = a.getAttribute('data-title').toLowerCase();
                    const titleB = b.getAttribute('data-title').toLowerCase();
                    return titleA.localeCompare(titleB);
                }
                return 0;
            });

            // Réinsérer les projets dans l'ordre trié
            projectsArray.forEach(project => {
                projectsContainer.appendChild(project);
            });
        });
    }

    // Animation au scroll pour les cartes et éléments
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer tous les éléments qui doivent apparaître au scroll
    const animatedElements = document.querySelectorAll(
        '.highlight-card, .timeline-item, .progression-card, ' +
        '.soft-skill-card, .quality-item, .defect-item, ' +
        '.work-style-item, .vision-item, .job-card, ' +
        '.feedback-item, .improvement-item, .reason-card, ' +
        '.conseil-card, .mission-card, .cesure-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Animation des barres de progression au scroll
    const progressBars = document.querySelectorAll('.bar-fill, .skill-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Gestion du scroll fluide pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mise en évidence de la page active dans la navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Animation des statistiques (compteur)
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = element.textContent;
        const number = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/[\d\s]/g, '');
        const duration = 2000;
        const increment = number / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                element.textContent = number + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Toggle menu mobile (au cas où ajouté plus tard)
    const createMobileMenu = () => {
        const nav = document.querySelector('.navbar');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth <= 768 && !document.querySelector('.hamburger')) {
            const hamburger = document.createElement('button');
            hamburger.className = 'hamburger';
            hamburger.innerHTML = '☰';
            hamburger.style.cssText = `
                display: block;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--primary-dark);
                cursor: pointer;
            `;
            
            nav.querySelector('.nav-container').insertBefore(
                hamburger, 
                navMenu
            );

            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navMenu.style.display = navMenu.classList.contains('active') 
                    ? 'flex' 
                    : 'none';
            });
        }
    };

    // Vérifier la taille de l'écran au chargement et au redimensionnement
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    console.log('Portfolio Leslie Planet - JavaScript chargé ✅');
});
