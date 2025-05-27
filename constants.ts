import { MemoItem, Flashcard, QuizQuestion } from './types';

// Données mémo réorganisées pour la section "Mémo"
export const memoData: MemoItem[] = [
  {
    title: "Cas comptoir",
    content: "Une femme de 26 ans se présente à l'officine :\n\n« J'ai des brûlures et des démangeaisons vaginales »\n\nSignes associés :\n- Pertes blanchâtres grumeleuses\n- Dyspareunie (douleurs lors des rapports)\n- Érythème vulvaire"
  },
  {
    title: "Questions à poser",
    content: "1. Depuis combien de temps ces symptômes ?\n2. Nature des pertes (couleur, odeur) ?\n3. Brûlures mictionnelles associées ?\n4. Grossesse ou contraception hormonale ?\n5. Fièvre/douleurs pelviennes ?\n6. Premier épisode ou récidive ?\n7. Traitements en cours (antibiotiques, corticoïdes) ?\n8. Antécédents de mycoses ?"
  },
  {
    title: "Quand orienter vers le médecin",
    content: "Orientation nécessaire si :\n\n- Patiente enceinte\n- Symptômes persistants sous traitement\n- Récidives fréquentes (>4 épisodes/an)\n- Signes généraux (fièvre, frissons)\n- Douleurs pelviennes\n- Pertes purulentes/malodorantes\n- Échec de 2 traitements bien conduits"
  },
  {
    title: "Pathologie et signes typiques",
    content: "Candidose vulvo-vaginale :\n\n- Agent : Candida albicans (90%)\n- Signes pathognomoniques :\n  • Prurit vulvaire intense\n  • Leucorrhées blanchâtres « fromage blanc »\n  • Brûlures mictionnelles terminales\n  • Vulve érythèmeuse\n\nFacteurs favorisants :\n- Antibiotiques, diabète\n- Grossesse, œstrogènes\n- Immunodépression"
  },
  {
    title: "Conseils produits",
    content: "Traitements antifongiques :\n\n- Ovule éconazole 150mg (1/j le soir au coucher pendant 3 à 6 jours)\n- Crème antifongique 2x/j (7j)\n\nProduits associés :\n- Gel lavant pH alcalin (max 14j)\n- Probiotiques vaginaux\n- Ovules hydratantes (post-traitement)\n\nNB : Pas de traitement systématique du partenaire"
  },
  {
    title: "Hygiène de vie",
    content: "Conseils à dispenser :\n\n- Sous-vêtements 100% coton\n- Éviter vêtements serrés\n- Hygiène douce sans savon parfumé\n- Séchage minutieux après toilette\n- Essuyage antéro-postérieur\n- Éviter bains/jacuzzi prolongés\n- Changement fréquent des protège-slips\n- Lavage du linge à 60°C minimum"
  }
];

// Flashcards (7 items) pour la section "Flashcards"
export const flashcardsData: Flashcard[] = [
  { question: "Agent principal responsable ?", answer: "Candida albicans (90% des cas)" },
  { question: "Signe le plus spécifique ?", answer: "Pertes blanchâtres grumeleuses 'fromage blanc'" },
  { question: "Durée traitement local standard ?", answer: "3 jours (ovule) ou 7 jours (crème)" },
  { question: "Quand traiter le partenaire ?", answer: "Uniquement s'il est symptomatique" },
  { question: "Gel lavant pH alcalin : durée max ?", answer: "14 jours maximum" },
  { question: "Critère d'orientation médicale ?", answer: "Grossesse, fièvre, échec thérapeutique" },
  { question: "Conseil vestimentaire clé ?", answer: "Sous-vêtements 100% coton, éviter les serrages" }
];

// Questions du quiz (10 items) pour la section "Quiz"
export const quizQuestionsData: QuizQuestion[] = [
  {
    question: "Quel est le principal agent pathogène responsable de la candidose vulvo-vaginale ?",
    options: ["Gardnerella vaginalis", "Candida albicans", "Trichomonas vaginalis", "Escherichia coli"],
    answer: 1,
    explanation: "La candidose vulvo-vaginale est principalement causée par la levure Candida albicans dans 90% des cas."
  },
  {
    question: "Quel symptôme est le plus fréquemment associé à la candidose vulvo-vaginale ?",
    options: ["Douleur pelvienne intense", "Fièvre et frissons", "Prurit vulvaire intense", "Pertes jaunes malodorantes"],
    answer: 2,
    explanation: "Le prurit vulvaire intense (démangeaisons) est l'un des symptômes les plus fréquents et caractéristiques de la candidose vulvo-vaginale."
  },
  {
    question: "Quelle est l'apparence typique des pertes vaginales en cas de candidose ?",
    options: ["Fluides et transparentes", "Blanchâtres grumeleuses 'fromage blanc'", "Jaunes mousseuses", "Grises et homogènes"],
    answer: 1,
    explanation: "Les pertes blanchâtres grumeleuses, souvent décrites comme ayant l'aspect de 'fromage blanc', sont très évocatrices d'une candidose vulvo-vaginale."
  },
  {
    question: "Dans quel cas une patiente doit-elle être systématiquement orientée vers un médecin ?",
    options: ["Symptômes modérés", "Premier épisode de mycose", "Patiente enceinte", "si elle a des pertes blanchâtres"],
    answer: 2,
    explanation: "Une patiente enceinte doit toujours être orientée vers une consultation médicale en cas de candidose, car le choix du traitement nécessite un avis médical spécialisé."
  },
  {
    question: "Quelle est la durée recommandée pour un traitement par ovule antifongique local (ex: éconazole) ?",
    options: ["1 jour", "3 à 6 jours", "14 jours", "Un mois"],
    answer: 1,
    explanation: "Le traitement par ovule ou capsule vaginale à base d'imidazolés est généralement d'un ovule le soir pendant 3 à 6 jours."
  },
  {
    question: "Le traitement du partenaire est-il systématique en cas de candidose vulvo-vaginale ?",
    options: ["Oui, toujours", "Non, uniquement s'il est symptomatique", "Oui, si la patiente est enceinte", "Non, jamais"],
    answer: 1,
    explanation: "Le traitement du partenaire n'est pas systématique et ne se fait qu'en présence de symptômes chez ce dernier."
  },
  {
    question: "Pourquoi ne faut-il pas dépasser 14 jours d'utilisation d'un gel lavant intime à pH alcalin ?",
    options: ["Pour éviter une irritation cutanée", "Pour protéger l'équilibre naturel de la flore vaginale", "Pour augmenter l'efficacité du traitement", "Pour des raisons économiques"],
    answer: 1,
    explanation: "Il ne faut pas dépasser 14 jours d'utilisation d'un gel à pH alcalin afin de protéger l'équilibre naturel de la flore vaginale, car il peut réduire l'acidité protectrice du vagin."
  },
  {
    question: "Une candidose est considérée comme récidivante à partir de combien d'épisodes par an ?",
    options: ["2 épisodes", "3 épisodes", "4 épisodes ou plus", "6 épisodes ou plus"],
    answer: 2,
    explanation: "Une candidose récidivante est définie par au moins quatre épisodes par an."
  },
  {
    question: "Quel conseil d'hygiène est recommandé pour prévenir les récidives ?",
    options: ["Utiliser des savons parfumés", "Porter des sous-vêtements synthétiques", "S'essuyer et sécher parfaitement après chaque hygiène intime", "Éviter les sous-vêtements en coton"],
    answer: 2,
    explanation: "S'essuyer et sécher parfaitement après chaque hygiène intime est une règle d'hygiène importante pour éviter l'humidité, propice à la prolifération de Candida."
  },
  {
    question: "Quel type de vêtement est déconseillé en cas de candidose ou pour la prévenir ?",
    options: ["Vêtements amples en coton", "Vêtements serrés ou synthétiques", "Jupes et robes", "Vêtements en lin"],
    answer: 1,
    explanation: "Le port de vêtements serrés ou synthétiques est un facteur de risque car ils favorisent l'humidité et la chaleur, propices à la prolifération de Candida."
  }
];

// Liste des termes à définir automatiquement au chargement pour le surlignage
// Ces termes seront également affichés dans l'onglet Glossaire
export const termsToDefineAutomatically: string[] = [
  "Candidose vulvo-vaginale",
  "Candida albicans",
  "Prurit vulvaire",
  "Leucorrhées",
  "Dyspareunie",
  "Brûlures mictionnelles",
  "Antifongiques",
  "Probiotiques vaginaux",
  "pH alcalin",
  "Récidives fréquentes",
];
