export type Lang = 'en' | 'es' | 'fr' | 'de' | 'pt'

export const dictionaries: Record<Lang, Record<string, string>> = {
  en: {
    app_title: 'Aletheia',
    hero_tagline: 'One Dilemma. Three Minds. Your Verdict.',
    learn_ai: 'Learn about the AI',
    create_dilemma: 'Create new dilemma',
    signin: 'Sign in',
    signup: 'Sign up',
    settings: 'Settings',
    history: 'History',
    utilitarian_ai: 'Utilitarian AI',
    deontologist_ai: 'Deontologist AI',
    virtue_ai: 'Virtue Ethicist AI',
    utilitarian_desc: 'Maximize total well-being. Minimize suffering. Decisions by expected value.',
    deontologist_desc: 'Follow universalizable rules. Respect persons as ends in themselves.',
    virtue_desc: 'Cultivate character. Act with courage, justice, compassion, and wisdom.',
    not_saved_notice: 'History isn’t saved when you’re not signed in.',
    sign_in_to_keep: 'Sign in to keep your analyses.',
    my_history: 'My History',
    back: 'Back',
  },
  es: {
    app_title: 'Aletheia',
    hero_tagline: 'Un dilema. Tres mentes. Tu veredicto.',
    learn_ai: 'Aprender sobre la IA',
    create_dilemma: 'Crear nuevo dilema',
    signin: 'Iniciar sesión',
    signup: 'Registrarse',
    settings: 'Ajustes',
    history: 'Historial',
    utilitarian_ai: 'IA Utilitarista',
    deontologist_ai: 'IA Deontológica',
    virtue_ai: 'IA de la Virtud',
    utilitarian_desc: 'Maximiza el bienestar total. Minimiza el sufrimiento. Decisiones por valor esperado.',
    deontologist_desc: 'Sigue reglas universalizables. Respeta a las personas como fines en sí mismos.',
    virtue_desc: 'Cultiva el carácter. Actúa con coraje, justicia, compasión y sabiduría.',
    not_saved_notice: 'El historial no se guarda cuando no has iniciado sesión.',
    sign_in_to_keep: 'Inicia sesión para guardar tus análisis.',
    my_history: 'Mi Historial',
    back: 'Atrás',
  },
  fr: {
    app_title: 'Aletheia',
    hero_tagline: 'Un dilemme. Trois esprits. Votre verdict.',
    learn_ai: "En savoir plus sur l'IA",
    create_dilemma: 'Créer un nouveau dilemme',
    signin: 'Se connecter',
    signup: "S'inscrire",
    settings: 'Paramètres',
    history: 'Historique',
    utilitarian_ai: 'IA Utilitariste',
    deontologist_ai: 'IA Déontologique',
    virtue_ai: 'IA de la Vertu',
    utilitarian_desc: 'Maximiser le bien-être total. Minimiser la souffrance. Décisions par valeur attendue.',
    deontologist_desc: 'Suivre des règles universalisables. Respecter les personnes comme des fins en soi.',
    virtue_desc: 'Cultiver le caractère. Agir avec courage, justice, compassion et sagesse.',
    not_saved_notice: "L'historique n'est pas enregistré lorsque vous n'êtes pas connecté.",
    sign_in_to_keep: 'Connectez-vous pour conserver vos analyses.',
    my_history: 'Mon Historique',
    back: 'Retour',
  },
  de: {
    app_title: 'Aletheia',
    hero_tagline: 'Ein Dilemma. Drei Köpfe. Ihr Urteil.',
    learn_ai: 'Über die KI lernen',
    create_dilemma: 'Neues Dilemma erstellen',
    signin: 'Anmelden',
    signup: 'Registrieren',
    settings: 'Einstellungen',
    history: 'Verlauf',
    utilitarian_ai: 'Utilitaristische KI',
    deontologist_ai: 'Deontologische KI',
    virtue_ai: 'Tugendethische KI',
    utilitarian_desc: 'Maximiert das Gesamtwohl. Minimiert Leid. Entscheidungen nach Erwartungswert.',
    deontologist_desc: 'Befolgt universalisierbare Regeln. Respektiert Menschen als Zwecke an sich.',
    virtue_desc: 'Pflegt Charakter. Handelt mit Mut, Gerechtigkeit, Mitgefühl und Weisheit.',
    not_saved_notice: 'Der Verlauf wird nicht gespeichert, wenn Sie nicht angemeldet sind.',
    sign_in_to_keep: 'Melden Sie sich an, um Ihre Analysen zu speichern.',
    my_history: 'Mein Verlauf',
    back: 'Zurück',
  },
  pt: {
    app_title: 'Aletheia',
    hero_tagline: 'Um dilema. Três mentes. Seu veredicto.',
    learn_ai: 'Saiba mais sobre a IA',
    create_dilemma: 'Criar novo dilema',
    signin: 'Entrar',
    signup: 'Registrar',
    settings: 'Configurações',
    history: 'Histórico',
    utilitarian_ai: 'IA Utilitarista',
    deontologist_ai: 'IA Deontológica',
    virtue_ai: 'IA da Virtude',
    utilitarian_desc: 'Maximiza o bem-estar total. Minimiza o sofrimento. Decisões por valor esperado.',
    deontologist_desc: 'Segue regras universalizáveis. Respeita as pessoas como fins em si mesmas.',
    virtue_desc: 'Cultiva o caráter. Age com coragem, justiça, compaixão e sabedoria.',
    not_saved_notice: 'O histórico não é salvo quando você não está conectado.',
    sign_in_to_keep: 'Entre para manter suas análises.',
    my_history: 'Meu Histórico',
    back: 'Voltar',
  },
}

export function t(lang: Lang, key: string): string {
  const dict = dictionaries[lang] || dictionaries.en
  return dict[key] || dictionaries.en[key] || key
}

export function getLang(): Lang {
  if (typeof document !== 'undefined') {
    const dl = document.documentElement.getAttribute('data-lang') as Lang | null
    if (dl) return dl
  }
  if (typeof localStorage !== 'undefined') {
    const ls = localStorage.getItem('aletheia_lang') as Lang | null
    if (ls) return ls
  }
  return 'en'
}

export function setLang(lang: Lang) {
  try {
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-lang', lang)
    if (typeof localStorage !== 'undefined') localStorage.setItem('aletheia_lang', lang)
  } catch {}
}
