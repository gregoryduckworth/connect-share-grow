
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.communities': 'Communities',
    'nav.discover': 'Discover',
    'nav.chat': 'Chat',
    'nav.connections': 'Connections',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    
    // Homepage
    'home.welcome': 'Welcome to ConnectSphere',
    'home.subtitle': 'Connect with friends and communities that share your interests',
    'home.findCommunities': 'Find Communities',
    'home.hotTopics': 'Hot Topics',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Full Name',
    'auth.language': 'Preferred Language',
    'auth.verificationSent': 'Verification email sent! Please check your inbox.',
    'auth.accountSuspended': 'Account Suspended',
    'auth.suspendedMessage': 'Your account has been suspended. You can browse but cannot post or interact.',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.save': 'Save',
    
    // Communities
    'communities.title': 'Communities',
    'communities.create': 'Create Community',
    'communities.search': 'Search communities...',
    'communities.all': 'All Communities',
    'communities.joined': 'My Communities',
    'communities.discover': 'Discover',
    
    // Common
    'common.loading': 'Loading...',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.communities': 'Comunidades',
    'nav.discover': 'Descubrir',
    'nav.chat': 'Chat',
    'nav.connections': 'Conexiones',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',
    
    // Homepage
    'home.welcome': 'Bienvenido a ConnectSphere',
    'home.subtitle': 'Conecta con amigos y comunidades que comparten tus intereses',
    'home.findCommunities': 'Encontrar Comunidades',
    'home.hotTopics': 'Temas Populares',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.name': 'Nombre Completo',
    'auth.language': 'Idioma Preferido',
    'auth.verificationSent': '¡Correo de verificación enviado! Por favor revisa tu bandeja de entrada.',
    'auth.accountSuspended': 'Cuenta Suspendida',
    'auth.suspendedMessage': 'Tu cuenta ha sido suspendida. Puedes navegar pero no puedes publicar o interactuar.',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.profile': 'Perfil',
    'settings.notifications': 'Notificaciones',
    'settings.privacy': 'Privacidad',
    'settings.appearance': 'Apariencia',
    'settings.language': 'Idioma',
    'settings.save': 'Guardar',
    
    // Communities
    'communities.title': 'Comunidades',
    'communities.create': 'Crear Comunidad',
    'communities.search': 'Buscar comunidades...',
    'communities.all': 'Todas las Comunidades',
    'communities.joined': 'Mis Comunidades',
    'communities.discover': 'Descubrir',
    
    // Common
    'common.loading': 'Cargando...',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.close': 'Cerrar',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.communities': 'Communautés',
    'nav.discover': 'Découvrir',
    'nav.chat': 'Chat',
    'nav.connections': 'Connexions',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    
    // Homepage
    'home.welcome': 'Bienvenue sur ConnectSphere',
    'home.subtitle': 'Connectez-vous avec des amis et des communautés qui partagent vos intérêts',
    'home.findCommunities': 'Trouver des Communautés',
    'home.hotTopics': 'Sujets Populaires',
    
    // Auth
    'auth.login': 'Se Connecter',
    'auth.register': 'S\'inscrire',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de Passe',
    'auth.confirmPassword': 'Confirmer le Mot de Passe',
    'auth.name': 'Nom Complet',
    'auth.language': 'Langue Préférée',
    'auth.verificationSent': 'E-mail de vérification envoyé ! Veuillez vérifier votre boîte de réception.',
    'auth.accountSuspended': 'Compte Suspendu',
    'auth.suspendedMessage': 'Votre compte a été suspendu. Vous pouvez naviguer mais ne pouvez pas publier ou interagir.',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.profile': 'Profil',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Confidentialité',
    'settings.appearance': 'Apparence',
    'settings.language': 'Langue',
    'settings.save': 'Sauvegarder',
    
    // Communities
    'communities.title': 'Communautés',
    'communities.create': 'Créer une Communauté',
    'communities.search': 'Rechercher des communautés...',
    'communities.all': 'Toutes les Communautés',
    'communities.joined': 'Mes Communautés',
    'communities.discover': 'Découvrir',
    
    // Common
    'common.loading': 'Chargement...',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.close': 'Fermer',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.communities': 'Gemeinschaften',
    'nav.discover': 'Entdecken',
    'nav.chat': 'Chat',
    'nav.connections': 'Verbindungen',
    'nav.profile': 'Profil',
    'nav.settings': 'Einstellungen',
    
    // Homepage
    'home.welcome': 'Willkommen bei ConnectSphere',
    'home.subtitle': 'Verbinden Sie sich mit Freunden und Gemeinschaften, die Ihre Interessen teilen',
    'home.findCommunities': 'Gemeinschaften Finden',
    'home.hotTopics': 'Beliebte Themen',
    
    // Auth
    'auth.login': 'Anmelden',
    'auth.register': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort Bestätigen',
    'auth.name': 'Vollständiger Name',
    'auth.language': 'Bevorzugte Sprache',
    'auth.verificationSent': 'Bestätigungs-E-Mail gesendet! Bitte überprüfen Sie Ihren Posteingang.',
    'auth.accountSuspended': 'Konto Gesperrt',
    'auth.suspendedMessage': 'Ihr Konto wurde gesperrt. Sie können browsen, aber nicht posten oder interagieren.',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.profile': 'Profil',
    'settings.notifications': 'Benachrichtigungen',
    'settings.privacy': 'Datenschutz',
    'settings.appearance': 'Erscheinungsbild',
    'settings.language': 'Sprache',
    'settings.save': 'Speichern',
    
    // Communities
    'communities.title': 'Gemeinschaften',
    'communities.create': 'Gemeinschaft Erstellen',
    'communities.search': 'Gemeinschaften suchen...',
    'communities.all': 'Alle Gemeinschaften',
    'communities.joined': 'Meine Gemeinschaften',
    'communities.discover': 'Entdecken',
    
    // Common
    'common.loading': 'Laden...',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.close': 'Schließen',
  }
};

let currentLanguage = 'en';

export const setLanguage = (language: string) => {
  if (translations[language]) {
    currentLanguage = language;
    localStorage.setItem('user_language', language);
  }
};

export const getCurrentLanguage = () => {
  const stored = localStorage.getItem('user_language');
  if (stored && translations[stored]) {
    currentLanguage = stored;
  }
  return currentLanguage;
};

export const t = (key: string): string => {
  const lang = getCurrentLanguage();
  return translations[lang]?.[key] || translations['en'][key] || key;
};

export const getSupportedLanguages = () => {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];
};

// Initialize language from localStorage on load
getCurrentLanguage();
