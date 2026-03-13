/* ============================================
   SHIFT — Data Layer
   Contenu extrait du livre blanc "Du Chiffre à la Valeur"
   ============================================ */

const SHIFT_DATA = {

  // ==========================================
  // DIAGNOSTIC QUESTIONS (15 questions, 3 par axe)
  // ==========================================
  axes: [
    { id: 'gouvernance', label: 'Gouvernance', color: '#00A9E0', icon: '⚙️' },
    { id: 'production', label: 'Production', color: '#3B82F6', icon: '🔧' },
    { id: 'donnee', label: 'Donnée', color: '#8B5CF6', icon: '📊' },
    { id: 'client', label: 'Client', color: '#10B981', icon: '🤝' },
    { id: 'offre', label: 'Offre', color: '#EC4899', icon: '🎯' }
  ],

  questions: [
    // --- GOUVERNANCE (3 questions) ---
    {
      axis: 'gouvernance',
      text: "Qui pilote réellement la transformation de votre cabinet ?",
      context: "Un cabinet sans sponsor identifié subit le changement au lieu de le piloter.",
      answers: [
        { label: "Personne en particulier, on gère au jour le jour", score: 1 },
        { label: "Moi-même, mais c'est noyé dans l'opérationnel", score: 2 },
        { label: "Un associé désigné avec du temps dédié", score: 3 },
        { label: "Un binôme sponsor + pilote avec 3 KPIs suivis mensuellement", score: 4 }
      ]
    },
    {
      axis: 'gouvernance',
      text: "À quelle fréquence mesurez-vous la performance de votre cabinet ?",
      context: "73% des cabinets veulent évoluer, mais sans tableau de bord, c'est du wishful thinking.",
      answers: [
        { label: "On regarde les chiffres au bilan annuel", score: 1 },
        { label: "Suivi trimestriel sur quelques indicateurs", score: 2 },
        { label: "Dashboard mensuel avec KPIs définis", score: 3 },
        { label: "Pilotage en temps réel avec alertes automatiques", score: 4 }
      ]
    },
    {
      axis: 'gouvernance',
      text: "Votre indice de délégation : combien de décisions opérationnelles passent encore par vous ?",
      context: "La pyramide inversée — passer de l'expert 'sachant' à l'organisation multi-métiers.",
      answers: [
        { label: "Quasiment toutes, je suis le goulot d'étranglement", score: 1 },
        { label: "La majorité, mais j'ai commencé à déléguer", score: 2 },
        { label: "Seules les décisions stratégiques remontent", score: 3 },
        { label: "Subsidiarité totale, chaque niveau décide dans son périmètre", score: 4 }
      ]
    },

    // --- PRODUCTION (3 questions) ---
    {
      axis: 'production',
      text: "Quel pourcentage de vos écritures comptables est automatisé ?",
      context: "60 à 80% des écritures sont automatisables. Si vous êtes en dessous, votre productivité détruit votre CA.",
      answers: [
        { label: "Moins de 20%, on saisit encore énormément", score: 1 },
        { label: "Entre 20% et 50%, on avance doucement", score: 2 },
        { label: "Entre 50% et 75%, la majorité est automatisée", score: 3 },
        { label: "Plus de 75%, nos équipes supervisent les flux", score: 4 }
      ]
    },
    {
      axis: 'production',
      text: "Avez-vous défini des règles de production claires et documentées ?",
      context: "Sans process standardisé, chaque collaborateur invente ses propres méthodes. Le client le subit.",
      answers: [
        { label: "Non, chacun fait à sa manière", score: 1 },
        { label: "Quelques règles informelles partagées oralement", score: 2 },
        { label: "Processus documenté pour les tâches principales", score: 3 },
        { label: "Manuel de production complet, audité et mis à jour régulièrement", score: 4 }
      ]
    },
    {
      axis: 'production',
      text: "Combien de dysfonctionnements avez-vous formellement identifiés et traités cette année ?",
      context: "Un audit interne honnête révèle toujours plus de problèmes qu'on ne le pense.",
      answers: [
        { label: "On ne fait pas ce type d'exercice", score: 1 },
        { label: "On connaît les problèmes mais on ne les formalise pas", score: 2 },
        { label: "On a listé les dysfonctionnements, certains sont résolus", score: 3 },
        { label: "Processus d'amélioration continue avec revue trimestrielle", score: 4 }
      ]
    },

    // --- DONNÉE (3 questions) ---
    {
      axis: 'donnee',
      text: "Avez-vous un 'Data Owner' identifié dans votre cabinet ?",
      context: "La donnée est votre nouvelle matière première. Sans gardien, elle se dégrade.",
      answers: [
        { label: "Non, on ne sait même pas ce que c'est", score: 1 },
        { label: "C'est un peu tout le monde et personne", score: 2 },
        { label: "Un collaborateur a cette casquette parmi d'autres", score: 3 },
        { label: "Oui, avec une fiche de poste claire et des indicateurs de qualité", score: 4 }
      ]
    },
    {
      axis: 'donnee',
      text: "Vos flux de données clients sont-ils sécurisés et normalisés ?",
      context: "Septembre 2026 : généralisation de la facture électronique. Êtes-vous prêt ?",
      answers: [
        { label: "On reçoit les pièces par email, voire papier", score: 1 },
        { label: "Mix de canaux, pas de processus unifié", score: 2 },
        { label: "Plateforme de collecte déployée pour la majorité des clients", score: 3 },
        { label: "Flux automatisés, normalisés, avec contrôle qualité en amont", score: 4 }
      ]
    },
    {
      axis: 'donnee',
      text: "Utilisez-vous l'IA pour analyser ou contrôler vos données ?",
      context: "Radar de contrôle, crash-test prévisionnel, benchmark — l'IA change la donne.",
      answers: [
        { label: "Non, c'est encore du futur pour nous", score: 1 },
        { label: "On a testé quelques outils sans les adopter", score: 2 },
        { label: "L'IA est utilisée sur certaines tâches de contrôle", score: 3 },
        { label: "L'IA est intégrée dans notre chaîne de production et d'analyse", score: 4 }
      ]
    },

    // --- CLIENT (3 questions) ---
    {
      axis: 'client',
      text: "Connaissez-vous les besoins latents de vos clients ?",
      context: "Au-delà des besoins basiques (conformité) et exprimés (tableaux de bord), les besoins latents sont : sérénité, survie, croissance. C'est là que réside la VRAIE valeur.",
      answers: [
        { label: "On fait ce qu'on nous demande : bilan et déclarations", score: 1 },
        { label: "On commence à proposer des tableaux de bord", score: 2 },
        { label: "On explore activement les attentes non exprimées", score: 3 },
        { label: "On anticipe et adresse la sérénité, la survie et la croissance", score: 4 }
      ]
    },
    {
      axis: 'client',
      text: "Avez-vous standardisé l'onboarding de vos clients ?",
      context: "Premier contact = première impression. Un onboarding cadré pose les règles du jeu.",
      answers: [
        { label: "Non, chaque client est pris 'comme il vient'", score: 1 },
        { label: "On a quelques étapes mais c'est informel", score: 2 },
        { label: "Processus structuré : lettre de mission, collecte, formation outils", score: 3 },
        { label: "Parcours d'onboarding automatisé avec suivi de satisfaction à J+30", score: 4 }
      ]
    },
    {
      axis: 'client',
      text: "Pratiquez-vous un rituel de pilotage régulier avec vos clients clés ?",
      context: "15 minutes par mois suffisent. Mais 15 minutes préparées et structurées.",
      answers: [
        { label: "On échange uniquement quand il y a un problème", score: 1 },
        { label: "Rendez-vous annuel pour le bilan", score: 2 },
        { label: "Points trimestriels avec les principaux clients", score: 3 },
        { label: "Rituel mensuel structuré de 15 min avec tableau de bord partagé", score: 4 }
      ]
    },

    // --- OFFRE (3 questions) ---
    {
      axis: 'offre',
      text: "Avez-vous formalisé vos offres sous forme de 'fiches produit' ?",
      context: "Promesse, Cadence, Prérequis, Livrables, Limites — chaque mission doit être packagée.",
      answers: [
        { label: "Non, on propose du sur-mesure à chaque fois", score: 1 },
        { label: "On a une grille tarifaire mais pas de fiches structurées", score: 2 },
        { label: "Fiches produit en cours de rédaction pour les missions principales", score: 3 },
        { label: "Catalogue complet avec 3 niveaux (Essentiel/Confort/Copilote)", score: 4 }
      ]
    },
    {
      axis: 'offre',
      text: "Comment fixez-vous vos prix ?",
      context: "L'équation inversée : si vous restez au temps passé, votre productivité détruit votre CA.",
      answers: [
        { label: "Au temps passé, c'est la norme", score: 1 },
        { label: "Forfaits basés sur une estimation du temps", score: 2 },
        { label: "Tarification mixte : forfait + valeur ajoutée", score: 3 },
        { label: "Pricing à la valeur : 3 niveaux basés sur l'impact client", score: 4 }
      ]
    },
    {
      axis: 'offre',
      text: "Proposez-vous des missions RSE/Durabilité à vos clients ?",
      context: "78% des entreprises voient l'expert-comptable comme partenaire clé sur la RSE. Êtes-vous prêt ?",
      answers: [
        { label: "Non, ce n'est pas notre métier", score: 1 },
        { label: "On en entend parler mais on ne sait pas par où commencer", score: 2 },
        { label: "On a lancé un diagnostic RSE 'starter' pour quelques clients", score: 3 },
        { label: "Mission Durabilité structurée avec accompagnement CSRD", score: 4 }
      ]
    }
  ],

  // ==========================================
  // MATURITY LEVELS
  // ==========================================
  maturityLevels: [
    {
      name: 'Réactif',
      range: [1, 1.5],
      description: "Votre cabinet subit les changements. L'urgence dicte chaque journée. C'est dangereux — mais c'est aussi le point de départ de toute transformation.",
      color: '#EF4444',
      verdict: "🚨 Alerte rouge. Il est temps d'agir — pas demain, maintenant."
    },
    {
      name: 'Optimisé',
      range: [1.5, 2.5],
      description: "Vous avez commencé à structurer, mais le modèle reste fragile. Les fondations sont là, il faut accélérer.",
      color: '#F97316',
      verdict: "⚡ Les bases sont posées. Maintenant, il faut accélérer avant que le marché ne vous dépasse."
    },
    {
      name: 'Data-Ready',
      range: [2.5, 3],
      description: "La donnée est en place, les process sont définis. Vous êtes prêt à passer en mode pilotage et création de valeur.",
      color: '#00A9E0',
      verdict: "📊 Vous avez la data. Il est temps de la transformer en intelligence stratégique."
    },
    {
      name: 'Copilote',
      range: [3, 3.5],
      description: "Vous pilotez votre cabinet avec des indicateurs, et vos clients vous voient comme un partenaire de décision. Bravo.",
      color: '#10B981',
      verdict: "🎯 Vous êtes en route. Il reste à monétiser cette valeur et à structurer la durabilité."
    },
    {
      name: 'À Impact',
      range: [3.5, 4],
      description: "Votre cabinet crée de la valeur mesurable. Vous êtes un exemple pour la profession. Continuez à innover.",
      color: '#8B5CF6',
      verdict: "🏆 Vous êtes un leader de la transformation. Inspirez la profession."
    }
  ],

  // ==========================================
  // SPRINTS ROADMAP (8 sprints de 30 jours)
  // ==========================================
  sprints: [
    {
      id: 1,
      title: 'Gouvernance',
      icon: '⚙️',
      tagline: 'Nommer un sponsor et un pilote, fixer le cap',
      description: "Avant de transformer, il faut désigner qui pilote. Sans capitaine, le navire dérive.",
      duration: '30 jours',
      checklist: [
        { task: "Nommer un sponsor (décideur) et un pilote (exécutant)", how: "Le sponsor est l'associé qui lève les blocages. Le pilote est le bras droit qui gère le quotidien du projet. Documentez ce binôme officiellement." },
        { task: "Définir 3 KPIs simples et mesurables", how: "Exemple : % d'adoption de l'outil de collecte, Temps de saisie moyen, Nombre de rituels clients réalisés." },
        { task: "Organiser le premier comité de pilotage", how: "Bloquez 1h par mois. L'ordre du jour : revue des KPIs, décisions à prendre, revue des blocages." },
        { task: "Communiquer la vision à toute l'équipe", how: "Expliquez le POURQUOI (ADKAR) lors d'une réunion plénière. Montrez que la transformation est une opportunité, pas une menace." },
        { task: "Planifier les 3 prochains mois", how: "Utilisez un outil simple (Trello, Planner) pour lister les tâches prioritaires sans surcharger l'agenda." }
      ],
      kpis: ['Sponsor désigné', 'KPIs définis', 'Comité lancé']
    },
    {
      id: 2,
      title: 'Pyramide',
      icon: '🔺',
      tagline: 'Cartographier et déléguer',
      description: "Inversez la pyramide : passez du sachant unique à l'intelligence collective.",
      duration: '30 jours',
      checklist: [
        { task: "Cartographier toutes les tâches du cabinet", how: "Listez tout : du scan des pièces au conseil stratégique. Identifiez les tâches chronophages sans valeur." },
        { task: "Identifier les rôles : qui fait quoi vraiment ?", how: "Clarifiez qui supervise les flux, qui gère la relation client, qui traite les anomalies." },
        { task: "Calculer l'indice de délégation actuel", how: "Quel % de décisions opérationnelles est pris sans intervention de l'associé ? Visez > 60%." },
        { task: "Définir les périmètres de décision par niveau", how: "Règle de subsidiarité : une décision doit être prise au niveau le plus bas possible." },
        { task: "Mettre en place les 5 familles de rôles", how: "Attribuez les nouveaux rôles : Transformers, Génies client, Superviseurs, Gardiens, Grands marges." }
      ],
      kpis: ['Cartographie complète', 'Indice délégation > 60%', 'Rôles assignés']
    },
    {
      id: 3,
      title: 'Production',
      icon: '🔧',
      tagline: 'Auditer et standardiser',
      description: "60-80% de vos écritures sont automatisables. Identifiez les gaspillages, fixez les règles.",
      duration: '30 jours',
      checklist: [
        { task: "Auditer les 10 principaux dysfonctionnements", how: "Interrogez les collaborateurs sur ce qui les ralentit (pièces manquantes, erreurs outils, double saisie)." },
        { task: "Documenter les processus de production clés", how: "Créez des fiches réflexes simples : 'Comment onboarder un flux', 'Comment traiter un rejet'." },
        { task: "Définir les règles de production non négociables", how: "Exemple : 'Zéro papier entrant', 'Réponse scriptée sous 24h', 'Saisie à flux continu'." },
        { task: "Mesurer le taux d'automatisation actuel", how: "Calculez : (Ecritures auto / Total écritures). L'IA doit traiter la masse, l'humain traite l'exception." },
        { task: "Identifier les 3 premiers flux à automatiser", how: "Commencez par les flux les plus répétitifs et volumineux (Bancaire, Factures Achat)." }
      ],
      kpis: ['Audit complété', 'Process documentés', 'Règles diffusées']
    },
    {
      id: 4,
      title: 'Données',
      icon: '📊',
      tagline: 'Sécuriser et fiabiliser les flux',
      description: "Nommez un Data Owner. Sans gardien de la donnée, elle se dégrade en silence.",
      duration: '30 jours',
      checklist: [
        { task: "Nommer un Data Owner", how: "Un profil hybride Expert/IT garant de l'intégrité et de la fraîcheur des bases FEC et CRM." },
        { task: "Auditer la qualité des données actuelles", how: "Cherchez les doublons, les SIRET manquants, les emails clients erronés. Votre conseil dépend de votre data." },
        { task: "Sécuriser les flux de collecte clients", how: "Supprimez l'email comme canal de collecte. Forcez l'usage de la plateforme (OCR/API)." },
        { task: "Normaliser les formats d'entrée", how: "Standardisez la ventilation comptable pour permettre le benchmark sectoriel automatique." },
        { task: "Préparer la facture électronique (sept. 2026)", how: "Évaluez les PDP (Plateformes de Dématérialisation Partenaires) et sensibilisez vos clients dès maintenant." }
      ],
      kpis: ['Data Owner nommé', 'Flux sécurisés', 'FE ready']
    },
    {
      id: 5,
      title: 'Relation Client',
      icon: '🤝',
      tagline: 'Standardiser et cadrer',
      description: "Ne subissez plus l'urgence client. Posez les règles du jeu dès l'onboarding.",
      duration: '30 jours',
      checklist: [
        { task: "Créer le parcours d'onboarding standardisé", how: "Une check-list de 10 points : Lettre de mission signée, Outils paramétrés, Formation client faite, etc." },
        { task: "Définir les SLA (engagements de service)", how: "Soyez clairs : 'Délai de réponse 24h', 'Reporting J+5'. C'est le contrat de service." },
        { task: "Mettre en place le rituel mensuel de 15 min", how: "Un point flash de 15 min par mois avec le client pour commenter le tableau de bord, pas faire du social." },
        { task: "Segmenter les clients par potentiel de valeur", how: "Distinguez les clients 'Conformité' des clients 'Accompagnement'. Adaptez vos efforts." },
        { task: "Déployer un outil de satisfaction (NPS)", how: "Envoyez une question simple après le bilan : 'Quelle est la probabilité que vous nous recommandiez ?'." }
      ],
      kpis: ['Onboarding déployé', 'Rituels lancés', 'NPS > 40']
    },
    {
      id: 6,
      title: 'Offres Valeur',
      icon: '🎯',
      tagline: 'Créer des fiches produit structurées',
      description: "Chaque mission doit être packagée : Promesse, Cadence, Prérequis, Livrables, Limites.",
      duration: '30 jours',
      checklist: [
        { task: "Créer la fiche produit Co-pilotage", how: "Utilisez le template du livre blanc : Promesse, Cadence, Prérequis, Livrables, Limites et Tarif." },
        { task: "Créer la fiche produit Full Service", how: "Définissez bien le périmètre (Paiements, Relances) et les outils partagés avec le client." },
        { task: "Créer la fiche produit Data & IA", how: "Listez les livrables : Radar de contrôle, Crash-test prévisionnel, Benchmark." },
        { task: "Créer la fiche produit Durabilité", how: "Intégrez le diagnostic RSE starter comme porte d'entrée." },
        { task: "Tester les offres sur 5 clients pilotes", how: "Proposez l'offre en test gratuit 3 mois à vos meilleurs clients pour obtenir du feedback." }
      ],
      kpis: ['4 fiches créées', 'Catalogue validé', '5 pilotes lancés']
    },
    {
      id: 7,
      title: 'Prix',
      icon: '💰',
      tagline: 'Sortir du temps passé',
      description: "L'équation est inversée : votre productivité détruit votre CA si vous restez au temps passé.",
      duration: '30 jours',
      checklist: [
        { task: "Analyser la rentabilité réelle par client", how: "Comparez le CA facturé au coût réel (temps passé + coût outils). Ciblez les clients déficitaires." },
        { task: "Définir les 3 niveaux de prix (Essentiel/Confort/Copilote)", how: "Créez des packages clairs. Ne vendez pas des heures, vendez de la sérénité et du pilotage." },
        { task: "Former l'équipe à la vente de valeur", how: "Workshop sur le changement de posture : de l'exécutant au conseil." },
        { task: "Préparer les argumentaires client", how: "Préparez les réponses aux objections : 'Pourquoi je paie plus ?', 'Quel est mon bénéfice ?'." },
        { task: "Migrer 10% du portefeuille vers le nouveau pricing", how: "Commencez par les nouveaux dossiers et les renouvellements de lettre de mission." }
      ],
      kpis: ['Grille 3 niveaux', 'Équipe formée', '10% migrés']
    },
    {
      id: 8,
      title: 'Durabilité',
      icon: '🌱',
      tagline: 'Lancer le diagnostic RSE starter',
      description: "78% des entreprises voient l'EC comme partenaire RSE. Saisissez cette opportunité massive.",
      duration: '30 jours',
      checklist: [
        { task: "Se former aux fondamentaux CSRD/RSE", how: "Formez les collaborateurs référents sur les nouveaux enjeux de durabilité." },
        { task: "Créer le diagnostic RSE 'starter'", how: "Un questionnaire simple de 30 points sur l'Environnement, le Social et la Gouvernance." },
        { task: "Identifier 10 clients cibles", how: "Ciblez ceux qui ont des enjeux de recrutement, de financement bancaire ou de conformité." },
        { task: "Lancer les 3 premiers diagnostics", how: "Testez la méthode, récoltez les données et produisez le premier rapport d'impact." },
        { task: "Formaliser l'offre Durabilité récurrente", how: "Transformez le diag initial en accompagnement annuel sur la trajectoire carbone/sociale." }
      ],
      kpis: ['Formation faite', 'Diagnostic créé', '3 missions lancées']
    }
  ],


  // ==========================================
  // MISSIONS (Les 4 nouvelles missions)
  // ==========================================
  missions: [
    {
      id: 'copilotage',
      title: 'Co-pilotage',
      icon: '🎯',
      color: '#00A9E0',
      tagline: "Fin du bilan post-mortem. Place au pilotage en temps réel.",
      description: "Transformez le bilan annuel statique en un tableau de bord vivant. Devenez le copilote stratégique de vos clients en utilisant la donnée pour anticiper plutôt que pour constater.",
      promesse: "Donner au dirigeant une visibilité financière à J+3 pour piloter son entreprise en temps réel.",
      honoraires: "À partir de 5 000 € / an",
      cadence: "Rituel mensuel de 15 minutes + alertes automatiques",
      prerequis: ["Données fiables et à jour", "Outil de dashboard déployé", "Client formé à la lecture"],
      livrables: ["Tableau de bord mensuel", "Analyse des écarts", "3 recommandations actionnables", "Projection à 3 mois"],
      plan_action: [
        "Connecter les flux comptables à votre outil de BI/Dashboarding.",
        "Définir avec le client ses 3 indicateurs de survie et de croissance.",
        "Automatiser l'envoi d'un flash hebdomadaire le lundi matin.",
        "Bloquer 15 min dans l'agenda client chaque 5 du mois pour le débrief."
      ],
      conseil_pro: "Ne montrez pas trop de chiffres. Le client veut comprendre l'impact sur son cash, pas ses écritures de dotations.",
      gain_potentiel: "Libère +20% de temps pour le conseil et augmente la satisfaction client de 40%.",
      limites: ["Ne remplace pas le conseil juridique", "Nécessite l'engagement du client sur la donnée"]
    },
    {
      id: 'fullservice',
      title: 'Full Service',
      icon: '🏢',
      color: '#3B82F6',
      tagline: "Libérez le dirigeant de sa fonction de banquier.",
      description: "Gestion administrative complète : de la facturation au social, en passant par la trésorerie. C'est l'externalisation totale du back-office client.",
      promesse: "Permettre au dirigeant de se concentrer sur son métier en externalisant 100% de l'administratif.",
      honoraires: "À partir de 8 000 € / an",
      cadence: "Traitement continu + reporting hebdomadaire",
      prerequis: ["Flux digitalisés", "Procédures documentées", "Outils cloud partagés"],
      livrables: ["Facturation gérée", "Trésorerie pilotée", "Social traité", "Reporting de conformité"],
      plan_action: [
        "Mettre en place une plateforme de collecte unique (ex: Receipt Bank, Hubdoc).",
        "Établir un calendrier de paiement fournisseur automatisé.",
        "Prendre la main sur la relance client de manière diplomatique.",
        "Documenter le manuel de procédures administratives du client."
      ],
      conseil_pro: "Commencez par le cycle achat/paiement, c'est là que la douleur du client est la plus forte.",
      gain_potentiel: "Génère un CA récurrent 3x plus élevé qu'une mission comptable classique.",
      limites: ["Responsabilité partagée avec le dirigeant", "Engagement minimum 12 mois"]
    },
    {
      id: 'dataia',
      title: 'Data & IA',
      icon: '🤖',
      color: '#8B5CF6',
      tagline: "Le Radar, le Crash-test et le Benchmark.",
      description: "Exploitez l'intelligence artificielle pour contrôler, simuler et comparer les performances. C'est la mission haute technologie du cabinet.",
      promesse: "Transformer la donnée brute en intelligence décisionnelle grâce à l'IA.",
      honoraires: "À partir de 7 500 € / an",
      cadence: "Contrôle continu + analyses trimestrielles",
      prerequis: ["Données normalisées", "Data Owner nommé", "Flux automatisés"],
      livrables: ["Radar de contrôle IA", "Crash-test prévisionnel", "Benchmark sectoriel", "Alertes prédictives"],
      plan_action: [
        "Lancer un audit complet de la base FEC pour identifier les anomalies via IA.",
        "Utiliser des outils de simulation prédictive pour le stress-test de trésorerie.",
        "Produire une comparaison anonymisée avec le TOP 10 du secteur (Benchmark).",
        "Mettre en place les 'Alertes Intelligentes' sur les seuils critiques."
      ],
      conseil_pro: "L'IA ne remplace pas votre jugement, elle le multiplie. Gardez toujours le dernier mot sur l'analyse.",
      gain_potentiel: "Positionne le cabinet comme un leader technologique et justifie des honoraires premium.",
      limites: ["Qualité des résultats dépendante de la qualité des données", "Formation requise"]
    },
    {
      id: 'rse',
      title: 'Durabilité & RSE',
      icon: '🌱',
      color: '#10B981',
      tagline: "L'extra-financier, votre prochain levier de croissance.",
      description: "Accompagnement sur les nouvelles obligations extra-financières (CSRD) et la stratégie durable pour pérenniser l'entreprise face aux enjeux écologiques.",
      promesse: "Aider les entreprises à structurer leur démarche RSE et préparer la conformité CSRD.",
      honoraires: "À partir de 4 000 € / an",
      cadence: "Diagnostic initial + suivi semestriel",
      prerequis: ["Audit environnemental de base", "Engagement de la direction", "Données ESG collectées"],
      livrables: ["Diagnostic RSE starter", "Plan d'action durabilité", "Tableau de bord ESG", "Rapport de conformité CSRD"],
      plan_action: [
        "Réaliser le premier bilan carbone simplifié du client.",
        "Identifier les 3 risques climatiques majeurs pour son business model.",
        "Mettre en place des indicateurs de diversité et de bien-être au travail.",
        "Rédiger le narratif extra-financier pour valoriser l'entreprise auprès des banques."
      ],
      conseil_pro: "Ne visez pas la perfection tout de suite. La RSE est une course de fond, commencez par des 'Quick Wins'.",
      gain_potentiel: "Ouvre un marché totalement vierge. 78% des PME attendent cette mission de votre part.",
      limites: ["Non certifiant (audit externe requis)", "Scope limité aux PME/ETI"]
    }
  ],

  // ==========================================
  // ASSISTANT - Knowledge Base (from book)
  // ==========================================
  assistantKnowledge: {
    "temps passé": {
      response: "**L'équation économique inversée** est le piège central du modèle traditionnel. Quand vous automatisez la saisie (60-80% des écritures), vous gagnez en productivité mais vous perdez en chiffre d'affaires si vous facturez au temps passé.\n\n**La solution :** Passer à un pricing à la valeur en 3 niveaux :\n- **Essentiel** : Conformité + déclarations\n- **Confort** : Essentiel + tableaux de bord + pilotage trimestriel\n- **Copilote** : Confort + accompagnement stratégique mensuel\n\nLe livre blanc recommande de commencer par migrer 10% de votre portefeuille vers ce nouveau modèle au Sprint 7.",
      followUp: "Voulez-vous que je vous montre le simulateur de pricing ?"
    },
    "nouvelles missions": {
      response: "Le livre blanc identifie **4 missions à forte valeur ajoutée** qui constituent l'avenir de la profession :\n\n1. 🎯 **Co-pilotage** — Fin du bilan post-mortem, pilotage en temps réel avec rituel mensuel de 15 min\n2. 🏢 **Full Service** — Gestion administrative complète pour libérer le dirigeant\n3. 🤖 **Data & IA** — Radar de contrôle, crash-test prévisionnel, benchmark sectoriel\n4. 🌱 **Durabilité & RSE** — Diagnostic RSE starter, accompagnement CSRD\n\nChaque mission est structurée en fiche produit : **Promesse, Cadence, Prérequis, Livrables, Limites**.",
      followUp: "Quelle mission vous intéresse le plus ?"
    },
    "commencer": {
      response: "**Le Playbook en 8 sprints de 30 jours** — c'est la roadmap d'exécution du livre blanc :\n\n1. ⚙️ **Gouvernance** — Sponsor, pilote, 3 KPIs\n2. 🔺 **Pyramide** — Cartographier, déléguer, indice de délégation\n3. 🔧 **Production** — Audit, standardisation, automatisation\n4. 📊 **Données** — Data Owner, sécurisation, facture électronique\n5. 🤝 **Client** — Onboarding, SLA, rituel mensuel\n6. 🎯 **Offres** — Fiches produit des 4 missions\n7. 💰 **Prix** — Sortir du temps passé, 3 niveaux\n8. 🌱 **Durabilité** — Diagnostic RSE starter\n\n**Conseil : ne sautez pas d'étape.** La gouvernance d'abord, toujours.",
      followUp: "Voulez-vous voir votre roadmap personnalisée ?"
    },
    "changement": {
      response: "Le livre blanc utilise le **modèle ADKAR adapté** pour gérer la résistance au changement :\n\n- **A**wareness (Conscience) — Faire comprendre POURQUOI changer\n- **D**esire (Désir) — Donner ENVIE de changer (montrer les bénéfices)\n- **K**nowledge (Connaissance) — Former sur le COMMENT\n- **A**bility (Capacité) — Donner les MOYENS (outils, temps, budget)\n- **R**einforcement (Renforcement) — Ancrer le changement dans la DURÉE\n\n**Les 5 nouvelles familles de rôles** pour embarquer vos équipes :\n- 🔍 Superviseurs de flux\n- 🛡️ Gardiens du temple\n- 😊 Génies client\n- 💎 Grands marges\n- ⚡ Transformers",
      followUp: "Souhaitez-vous approfondir un aspect en particulier ?"
    },
    "facture électronique": {
      response: "**Septembre 2026** — C'est la date clé de la généralisation de la facturation électronique (réception obligatoire pour toutes les entreprises).\n\nCe que ça change pour votre cabinet :\n- 📥 Les flux de pièces comptables seront 100% digitaux\n- ⚙️ La saisie comptable traditionnelle disparaît\n- 📊 La valeur se déplace vers l'analyse et le conseil\n\n**Action immédiate (Sprint 4 — Données) :**\n1. Nommer un Data Owner\n2. Auditer la qualité des données actuelles\n3. Normaliser les formats d'entrée\n4. Tester les plateformes de facturation électronique",
      followUp: "Avez-vous déjà commencé la préparation ?"
    },
    "rse": {
      response: "**78% des entreprises** voient l'expert-comptable comme un partenaire clé sur la RSE — c'est une opportunité massive !\n\nLe livre blanc propose une **Mission Durabilité structurée** :\n\n📋 **Diagnostic RSE Starter** — Évaluation rapide sur les 3 piliers (Environnemental, Social, Gouvernance)\n📊 **Tableau de bord ESG** — Indicateurs clés suivis dans le temps\n📄 **Conformité CSRD** — Accompagnement aux nouvelles obligations extra-financières\n\n**Sprint 8** de la roadmap est entièrement dédié à cette mission.\n\nLe premier pas : se former aux fondamentaux CSRD et identifier 10 clients cibles.",
      followUp: "Voulez-vous voir la fiche mission complète ?"
    },
    "pentagone": {
      response: "Le **Modèle de Maturité en Pentagone** évalue votre cabinet sur 5 dimensions :\n\n1. ⚙️ **Gouvernance** — Qui pilote ? Avec quels KPIs ?\n2. 🔧 **Production** — Quel niveau d'automatisation et de standardisation ?\n3. 📊 **Donnée** — La data est-elle fiable, sécurisée, exploitée ?\n4. 🤝 **Client** — Connaissez-vous les besoins latents ? L'onboarding est-il cadré ?\n5. 🎯 **Offre** — Vos missions sont-elles packagées ? Le pricing est-il basé sur la valeur ?\n\n**5 niveaux de maturité** : Réactif → Optimisé → Data-Ready → Copilote → À Impact\n\nLe diagnostic interactif de SHIFT évalue votre position sur chaque axe.",
      followUp: "Avez-vous déjà fait votre diagnostic ?"
    }
  }
};
