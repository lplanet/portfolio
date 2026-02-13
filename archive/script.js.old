document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');
  const closeBtn = document.getElementById('close-btn');

  // Quand on clique sur une image projet
  document.querySelectorAll('.project-thumb').forEach(img => {
    img.addEventListener('click', () => {
      const projectDiv = img.parentElement;
      modalTitle.textContent = projectDiv.getAttribute('data-title');
      modalDesc.textContent = projectDiv.getAttribute('data-description');
      modalImg.src = img.src;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Pour bloquer le scroll du fond
    });
  });

  // Fermer la modale
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // Fermer la modale en cliquant à l'extérieur du contenu
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  const projectsContainer = document.querySelector('.projects');
  const sortSelect = document.getElementById('sort-select');

  sortSelect.addEventListener('change', () => {
    const projects = Array.from(projectsContainer.children);

    if (sortSelect.value === 'date') {
      projects.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-date'));
        const dateB = new Date(b.getAttribute('data-date'));
        return dateA - dateB; // du plus ancien au plus récent, ou inverse en inversant la soustraction
      });
    } else if (sortSelect.value === 'alphabetical') {
      projects.sort((a, b) => {
        const titleA = a.getAttribute('data-title').toLowerCase();
        const titleB = b.getAttribute('data-title').toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
      });
    }

    // On réinsère les projets dans l'ordre trié
    projects.forEach(project => projectsContainer.appendChild(project));
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      const projects = document.querySelectorAll('.project');

      // Appliquer le filtre
      projects.forEach(proj => {
        if (filter === 'all' || proj.getAttribute('data-semestre').includes(filter)) {
          proj.style.display = 'block';
        } else {
          proj.style.display = 'none';
        }
      });

      // Mettre à jour les styles des boutons
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});