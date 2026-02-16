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

    // Gestion des modales de projets
    const projectsData = {
        'stage-ima': {
            title: 'Stage IMA - 10 semaines',
            date: 'Avril - Juin 2025',
            description: `
                <p>Stage de 10 semaines au sein du Service Analyses et Pilotage d'Inter Mutuelles Assistance (IMA), 
                mutuelle d'assurance spécialisée dans l'assistance automobile et habitation.</p>
                
                <h4>Missions principales</h4>
                <ul>
                    <li><strong>Mise à jour de bases de données :</strong> Gestion rigoureuse de données sensibles avec échéances serrées, 
                    garantissant la fiabilité des informations utilisées pour le pilotage stratégique.</li>
                    <li><strong>Cartographies géographiques :</strong> Création de cartes interactives pour visualiser le maillage 
                    territorial des prestataires, facilitant les décisions d'implantation.</li>
                    <li><strong>Automatisation VBA :</strong> Développement de macros pour automatiser des tâches répétitives 
                    et optimiser les processus de reporting.</li>
                    <li><strong>Intégration prospects PRAXEDO :</strong> Adaptation à un outil métier spécifique pour intégrer 
                    de nouveaux prestataires dans le système.</li>
                </ul>
            `,
            challenges: [
                'Gestion rigoureuse de données sensibles sous contrainte de temps',
                'Apprentissage rapide d\'un outil métier interne (PRAXEDO)',
                'Communication efficace avec plusieurs services (commercial, technique, direction)',
                'Adaptation aux processus et standards de l\'entreprise',
                'Production de livrables professionnels (cartes, rapports) exploitables immédiatement'
            ],
            metiers: [
                'Data Analyst',
                'Chargé d\'études décisionnelles',
                'Consultant BI',
                'Cartographe / Géomaticien',
                'Gestionnaire de bases de données'
            ]
        },
        'api-ccam': {
            title: 'Développement API REST - CCAM',
            date: 'Février 2025',
            description: `
                <p>Développement d'une API REST avec Node.js et Express pour simplifier l'accès aux données de la 
                Classification Commune des Actes Médicaux (CCAM), une nomenclature complexe utilisée dans le secteur médical.</p>
                
                <h4>Objectifs du projet</h4>
                <ul>
                    <li><strong>Faciliter l'accès aux données CCAM :</strong> Créer des endpoints RESTful permettant 
                    d'interroger facilement une base complexe de plus de 7000 actes médicaux.</li>
                    <li><strong>Format JSON standardisé :</strong> Retourner les données dans un format exploitable 
                    par des applications tierces.</li>
                    <li><strong>Base MySQL :</strong> Conception et alimentation d'une base de données relationnelle 
                    structurée.</li>
                </ul>
                
                <h4>Technologies utilisées</h4>
                <p>Node.js, Express, MySQL, Postman (tests), JSON</p>
            `,
            challenges: [
                'Première expérience avec Node.js et le framework Express',
                'Compréhension des principes REST (GET, POST, PUT, DELETE, codes HTTP)',
                'Structuration d\'une API professionnelle avec endpoints cohérents',
                'Optimisation des requêtes SQL sur une base volumineuse',
                'Documentation claire des endpoints pour les utilisateurs de l\'API'
            ],
            metiers: [
                'Développeur Backend',
                'Développeur API / Web Services',
                'Ingénieur logiciel',
                'Développeur Full Stack',
                'Architecte API'
            ]
        },
        'datawarehouse': {
            title: 'Intégration Datawarehouse - SportOne',
            date: 'Décembre 2024',
            description: `
                <p>Conception et implémentation d'un entrepôt de données (datawarehouse) pour l'entreprise fictive SportOne, 
                spécialisée dans la vente d'articles de sport. Projet complet couvrant la modélisation, l'alimentation 
                (ETL) et la restitution (tableaux de bord).</p>
                
                <h4>Étapes du projet</h4>
                <ul>
                    <li><strong>Modélisation multidimensionnelle :</strong> Conception d'un modèle en étoile avec 5 dimensions 
                    (Temps, Produit, Magasin, Client, Promotion) et 1 table de faits (Ventes).</li>
                    <li><strong>Processus ETL :</strong> Extraction, Transformation et Chargement de données couvrant 
                    6 années (2017-2022) avec gestion des anomalies et nettoyage.</li>
                    <li><strong>Tableaux de bord interactifs :</strong> Création de 10+ dashboards Power BI pour analyser 
                    les ventes, la rentabilité, les tendances produits, et piloter la stratégie commerciale.</li>
                </ul>
                
                <h4>Compétences développées</h4>
                <p>Modélisation dimensionnelle, SQL avancé, ETL, Power BI, analyse décisionnelle</p>
            `,
            challenges: [
                'Modélisation multidimensionnelle complexe avec 5 axes d\'analyse',
                'Processus ETL sur données volumineuses (6 ans de transactions)',
                'Création de métriques métier pertinentes (CA, marge, panier moyen)',
                'Gestion des hiérarchies temporelles (jour, mois, trimestre, année)',
                'Optimisation des performances de l\'entrepôt pour requêtes rapides'
            ],
            metiers: [
                'Consultant BI / Business Intelligence',
                'Ingénieur Datawarehouse',
                'Architecte de données',
                'Data Analyst',
                'Développeur ETL'
            ]
        },
        'reporting-multivariee': {
            title: 'Reporting Analyse Multivariée - Pauvreté',
            date: 'Octobre 2024',
            description: `
                <p>Développement d'un outil visuel automatisé pour le suivi de la pauvreté en France, permettant 
                d'analyser la situation de 9,1 millions de personnes vivant sous le seuil de pauvreté.</p>
                
                <h4>Objectifs</h4>
                <ul>
                    <li><strong>Dashboards interactifs R Shiny :</strong> Interface web permettant d'explorer les données 
                    de pauvreté par département, année, et catégorie socio-professionnelle.</li>
                    <li><strong>Analyse en Composantes Principales (ACP) :</strong> Réduction de dimensionnalité pour 
                    identifier les variables clés expliquant les disparités territoriales.</li>
                    <li><strong>Données INSEE :</strong> Exploitation de données officielles fiables et à jour.</li>
                </ul>
            `,
            challenges: [
                'Maîtrise de R Shiny pour créer des interfaces interactives',
                'Compréhension et application de l\'ACP (Analyse en Composantes Principales)',
                'Interprétation des axes factoriels et visualisation des résultats',
                'Gestion de données multidimensionnelles (région, CSP, âge, emploi)',
                'Création de visualisations pertinentes pour un public non technique'
            ],
            metiers: [
                'Data Analyst',
                'Chargé d\'études statistiques',
                'Consultant en statistiques publiques',
                'Data Scientist',
                'Analyste décisionnel'
            ]
        },
        'web-scraping': {
            title: 'Collecte de données web',
            date: 'Novembre 2024',
            description: `
                <p>Projet de collecte et d'analyse de données via deux sources : web scraping de Wikipédia (musées de France) 
                et consommation d'API ADEME (Diagnostic de Performance Énergétique des logements).</p>
                
                <h4>Réalisations</h4>
                <ul>
                    <li><strong>Web scraping avec BeautifulSoup :</strong> Extraction automatisée des informations sur 
                    les musées français depuis Wikipédia (nom, localisation, type).</li>
                    <li><strong>Consommation d'API REST ADEME :</strong> Récupération des données DPE pour 4 villes 
                    (Paris, Lyon, Marseille, Toulouse).</li>
                    <li><strong>Cartographie interactive Folium :</strong> Visualisation géographique des musées et 
                    analyse comparative de la performance énergétique des logements.</li>
                </ul>
            `,
            challenges: [
                'Maîtrise de BeautifulSoup pour parser des pages HTML complexes',
                'Compréhension de la structure des API REST et formats JSON',
                'Gestion des requêtes HTTP et des erreurs de connexion',
                'Géolocalisation et cartographie avec Folium',
                'Nettoyage et harmonisation de données provenant de sources hétérogènes'
            ],
            metiers: [
                'Data Engineer',
                'Web Scraper / Data Scraper',
                'Data Analyst',
                'Développeur Python',
                'Ingénieur données'
            ]
        },
        'besoin-territoire': {
            title: 'Besoin du territoire - Enseignement NSI',
            date: 'Année complète 2024-2025',
            description: `
                <p>Animation de 3 séances de 2 heures chacune pour 2 classes de première (option NSI - Numérique et 
                Sciences Informatiques) au Lycée Paul Guérin à Niort.</p>
                
                <h4>Contenu pédagogique</h4>
                <ul>
                    <li><strong>Séance 1 :</strong> Introduction au HTML/CSS - Structure de pages web, balises, mise en forme.</li>
                    <li><strong>Séance 2 :</strong> Formats de données (CSV) - Manipulation, import/export.</li>
                    <li><strong>Séance 3 :</strong> Formulaires web - Création, validation, traitement des données.</li>
                </ul>
                
                <h4>Compétences pédagogiques</h4>
                <p>Préparation de cours, création d'exercices progressifs, gestion de classe, adaptation du discours technique</p>
            `,
            challenges: [
                'Adapter le discours technique à un public lycéen débutant',
                'Conception d\'exercices progressifs et motivants',
                'Gestion de groupes (20-25 élèves) et animation de séances',
                'Gérer l\'hétérogénéité des niveaux au sein d\'une même classe',
                'Transmission de connaissances de manière claire et structurée'
            ],
            metiers: [
                'Formateur en informatique',
                'Enseignant / Professeur',
                'Médiateur numérique',
                'Chargé de formation',
                'Responsable pédagogique'
            ]
        },
        'dataviz': {
            title: 'DataVisualisation - SAE Nationale',
            date: 'Juin 2024',
            description: `
                <p>Participation à la SAE nationale d'une journée organisée pour tous les étudiants de BUT Science des Données 
                en France, en partenariat avec Météo France.</p>
                
                <h4>Format et objectifs</h4>
                <ul>
                    <li><strong>Durée :</strong> 1 journée intensive de travail en équipe de 5 personnes.</li>
                    <li><strong>Sujet :</strong> Analyse et visualisation de données climatiques fournies par Météo France.</li>
                    <li><strong>Livrables :</strong> Rapport d'analyse + visualisations pertinentes à présenter 
                    en fin de journée.</li>
                </ul>
                
                <h4>Compétences mobilisées</h4>
                <p>Travail d'équipe sous pression, gestion du temps, data visualisation, communication des résultats</p>
            `,
            challenges: [
                'Gestion efficace du temps sous contrainte (1 journée)',
                'Coordination et répartition des tâches en équipe de 5',
                'Compréhension rapide d\'un jeu de données inconnu',
                'Production de visualisations claires et impactantes',
                'Synthèse et présentation orale des résultats'
            ],
            metiers: [
                'Data Analyst',
                'Data Visualisation Specialist',
                'Consultant en dataviz',
                'Business Analyst',
                'Chargé d\'études'
            ]
        },
        'bdr': {
            title: 'Base de données relationnelle',
            date: 'Mars 2024',
            description: `
                <p>Projet complet de conception, alimentation et exploitation d'une base de données relationnelle 
                pour gérer des informations structurées.</p>
                
                <h4>Étapes du projet</h4>
                <ul>
                    <li><strong>Conception :</strong> Modélisation Entité-Association, normalisation, création du 
                    schéma relationnel.</li>
                    <li><strong>Alimentation :</strong> Import de données depuis fichiers CSV avec gestion des 
                    clés étrangères et cohérence des données.</li>
                    <li><strong>Interface Tkinter :</strong> Développement d'une application Python permettant 
                    de visualiser, ajouter et modifier des données via une interface graphique.</li>
                    <li><strong>Requêtes SQL complexes :</strong> Jointures, agrégations, sous-requêtes pour 
                    extraire des informations pertinentes.</li>
                </ul>
            `,
            challenges: [
                'Remplissage de tables avec croisement de plusieurs fichiers CSV',
                'Gestion rigoureuse des clés étrangères et intégrité référentielle',
                'Cohérence des données entre sources différentes',
                'Développement d\'une interface graphique fonctionnelle avec Tkinter',
                'Écriture de requêtes SQL optimisées'
            ],
            metiers: [
                'Administrateur de bases de données (DBA)',
                'Développeur bases de données',
                'Data Engineer',
                'Développeur Backend',
                'Analyste de données'
            ]
        },
        'regression': {
            title: 'Régression - Prix logements parisiens',
            date: 'Mars 2024',
            description: `
                <p>Projet de prédiction du prix des logements parisiens à l'aide de modèles de régression statistique 
                en R, sur la base de caractéristiques descriptives (surface, nombre de pièces, localisation, etc.).</p>
                
                <h4>Méthodologie</h4>
                <ul>
                    <li><strong>Exploration des données :</strong> Analyse descriptive, visualisations, détection 
                    des valeurs aberrantes.</li>
                    <li><strong>Test de modèles :</strong> Régression linéaire simple, multiple, polynomiale, 
                    exponentielle. Comparaison des performances (R², RMSE).</li>
                    <li><strong>Segmentation :</strong> Séparation maisons / appartements pour améliorer la 
                    précision des prédictions.</li>
                    <li><strong>Interprétation :</strong> Analyse des coefficients, significativité des variables.</li>
                </ul>
            `,
            challenges: [
                'Choix du modèle le plus adapté aux données',
                'Sélection des variables prédictives pertinentes',
                'Segmentation cohérente du jeu de données (maisons vs appartements)',
                'Interprétation des résultats et validation statistique',
                'Diagnostic des résidus et respect des hypothèses de régression'
            ],
            metiers: [
                'Data Scientist',
                'Statisticien',
                'Analyste quantitatif',
                'Data Analyst',
                'Chargé d\'études prédictives'
            ]
        },
        'echantillonnage': {
            title: 'Échantillonnage',
            date: 'Mars 2024',
            description: `
                <p>Projet d'estimation de la population de l'Île-de-France via des techniques d'échantillonnage, 
                en comparant différentes méthodes et leur précision.</p>
                
                <h4>Méthodes testées</h4>
                <ul>
                    <li><strong>Échantillonnage aléatoire simple :</strong> Tirage aléatoire d'individus sans stratification.</li>
                    <li><strong>Échantillonnage stratifié :</strong> Division de la population en strates homogènes 
                    (par département) pour améliorer la précision.</li>
                    <li><strong>Test du khi-deux :</strong> Vérification de l'adéquation de la distribution observée 
                    à la distribution attendue.</li>
                </ul>
                
                <h4>Outils</h4>
                <p>R, lois de probabilité, tests statistiques, intervalles de confiance</p>
            `,
            challenges: [
                'Compréhension des concepts d\'échantillonnage et de représentativité',
                'Calcul des intervalles de confiance et marges d\'erreur',
                'Application du test du khi-deux et interprétation des résultats',
                'Comparaison rigoureuse des différentes méthodes d\'échantillonnage',
                'Rédaction d\'un compte-rendu statistique rigoureux'
            ],
            metiers: [
                'Statisticien',
                'Chargé d\'études statistiques',
                'Analyste de sondage',
                'Data Analyst',
                'Biostatisticien'
            ]
        },
        'martinique': {
            title: 'Étude démographique - Martinique',
            date: 'Janvier 2024',
            description: `
                <p>Premier projet de BUT consistant à réaliser un compte rendu descriptif de la situation démographique 
                et du marché du travail en Martinique, en exploitant des données INSEE.</p>
                
                <h4>Contenu du rapport</h4>
                <ul>
                    <li><strong>Démographie :</strong> Évolution de la population, pyramide des âges, taux de natalité/mortalité.</li>
                    <li><strong>Marché du travail :</strong> Taux de chômage, secteurs d'activité, catégories 
                    socio-professionnelles.</li>
                    <li><strong>Graphiques Excel :</strong> Visualisations simples (histogrammes, courbes, secteurs) 
                    pour illustrer les tendances.</li>
                </ul>
            `,
            challenges: [
                'Première manipulation de données réelles issues de l\'INSEE',
                'Compréhension des concepts démographiques et économiques',
                'Création de graphiques clairs et pertinents avec Excel',
                'Rédaction d\'un compte rendu structuré et professionnel',
                'Analyse critique des données et formulation de conclusions'
            ],
            metiers: [
                'Chargé d\'études statistiques',
                'Data Analyst',
                'Statisticien public',
                'Analyste socio-économique',
                'Chargé d\'études démographiques'
            ]
        },
        'islande': {
            title: 'Présentation bilingue - Islande',
            date: 'Février 2024',
            description: `
                <p>Projet de présentation bilingue (français/anglais) sur l'Islande, réalisé en équipe, couvrant 
                les aspects économiques et culturels du pays.</p>
                
                <h4>Structure de la présentation</h4>
                <ul>
                    <li><strong>Partie en anglais :</strong> Économie islandaise (PIB, secteurs d'activité, exportations, 
                    tourisme).</li>
                    <li><strong>Partie en français :</strong> Culture islandaise (traditions, gastronomie, langue, patrimoine).</li>
                    <li><strong>Support :</strong> PowerPoint structuré avec visuels et données chiffrées.</li>
                </ul>
            `,
            challenges: [
                'Présenter en anglais devant un public avec aisance',
                'Coordination et répartition du travail en équipe',
                'Recherche et synthèse d\'informations fiables',
                'Création d\'un support visuel clair et professionnel',
                'Gestion du temps de parole et articulation entre les parties'
            ],
            metiers: [
                'Chargé de communication',
                'Consultant international',
                'Analyste économique',
                'Business Analyst',
                'Chef de projet'
            ]
        },
        'gestion-fichier': {
            title: 'Gestion de fichier CSV',
            date: 'Janvier 2024',
            description: `
                <p>Projet de manipulation de fichiers CSV en Python : suppression de colonnes inutiles tout en conservant 
                l'ordre et l'organisation des données.</p>
                
                <h4>Objectifs techniques</h4>
                <ul>
                    <li><strong>Lecture de CSV :</strong> Import d'un fichier CSV dans une structure Python (liste de listes).</li>
                    <li><strong>Suppression de colonnes :</strong> Identification et retrait de colonnes spécifiques 
                    sans altérer les autres.</li>
                    <li><strong>Conservation de l'ordre :</strong> Maintien de l'organisation initiale des lignes et colonnes.</li>
                    <li><strong>Export :</strong> Réécriture du fichier nettoyé au format CSV.</li>
                </ul>
            `,
            challenges: [
                'Manipulation de listes imbriquées en Python',
                'Préservation de l\'ordre des données après suppression de colonnes',
                'Rigueur dans le traitement ligne par ligne',
                'Gestion des en-têtes et des types de données',
                'Première expérience de traitement de données avec Python'
            ],
            metiers: [
                'Data Engineer',
                'Développeur Python',
                'Data Analyst',
                'Automaticien de données',
                'Développeur ETL'
            ]
        },
        'reporting-s1': {
            title: 'Gestionnaire de notes - VBA',
            date: 'Décembre 2023',
            description: `
                <p>Développement d'un gestionnaire de notes automatisé en VBA/Excel, permettant de suivre et calculer 
                automatiquement les moyennes des étudiants.</p>
                
                <h4>Fonctionnalités</h4>
                <ul>
                    <li><strong>Recalcul automatique :</strong> Mise à jour de la moyenne générale à chaque ajout/suppression 
                    de note.</li>
                    <li><strong>Ajout de notes :</strong> Insertion automatique des nouvelles notes à la suite des précédentes, 
                    sans intervention manuelle.</li>
                    <li><strong>Suppression de notes :</strong> Retrait de notes avec réorganisation automatique du tableau.</li>
                    <li><strong>Validation du passage :</strong> Vérification automatique si l'étudiant valide son année 
                    (moyenne ≥ 10/20).</li>
                </ul>
            `,
            challenges: [
                'Insertion automatique des notes à la suite des précédentes',
                'Réorganisation du tableau après suppression de notes',
                'Logique d\'automatisation avec VBA (première expérience de programmation)',
                'Gestion des formules Excel dynamiques',
                'Interface utilisateur simple et intuitive'
            ],
            metiers: [
                'Développeur VBA / Excel',
                'Consultant en automatisation',
                'Analyste de gestion',
                'Développeur d\'outils métier',
                'Business Analyst'
            ]
        }
    };

    // Gestion des clics sur les cartes de projets pour les modales
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal-close');

    if (modal && modalBody && projectCards.length > 0) {
        projectCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                // Ne pas ouvrir si on clique sur un lien
                if (e.target.tagName === 'A') return;
                
                const projectId = this.id;
                const projectData = projectsData[projectId];
                
                if (projectData) {
                    // Remplir la modale avec les données du projet
                    modalBody.innerHTML = `
                    <h2>${projectData.title}</h2>
                    <p class="modal-date">${projectData.date}</p>
                    
                    <div class="modal-section">
                        <h3>Description détaillée</h3>
                        ${projectData.description}
                    </div>
                    
                    <div class="modal-section">
                        <h3>Difficultés abordées</h3>
                        <ul class="challenges-list">
                            ${projectData.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-section modal-metiers">
                        <h3>Métiers associés</h3>
                        <div class="metiers-tags">
                            ${projectData.metiers.map(metier => `<span class="metier-tag">${metier}</span>`).join('')}
                        </div>
                    </div>
                `;
                
                // Afficher la modale
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

        // Fermeture de la modale
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Fermeture au clic en dehors de la modale
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Fermeture avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    console.log('Portfolio Leslie Planet - JavaScript chargé ✅');
});
