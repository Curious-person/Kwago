import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// This is a client-side i18n setup since InteractiveArticle is a Client Component.
// The translation dictionary includes static UI elements and mock translations
// for specific blog post blocks to demonstrate multi-language support.

const resources = {
  en: {
    translation: {
      listen_to_article: "Listen to Article",
      resume: "Resume",
      pause: "Pause",
      stop: "Stop",
      speaking: "Speaking",
      tts_disabled: "Audio unavailable in this language",

      // Mock dictionary for dynamic block translations ("The Art of Admin Pending Approval")
      "In the fast-paced world of digital publishing, every post carries weight. Whether it’s a product launch, a thought leadership piece, or a community update, the process of admin pending approval is more than just a technical checkpoint—it’s an art form.":
        "In the fast-paced world of digital publishing, every post carries weight. Whether it’s a product launch, a thought leadership piece, or a community update, the process of admin pending approval is more than just a technical checkpoint—it’s an art form.",
      "Why Approval Matters": "Why Approval Matters",
    },
  },
  es: {
    translation: {
      listen_to_article: "Escuchar Artículo",
      resume: "Reanudar",
      pause: "Pausar",
      stop: "Detener",
      speaking: "Hablando",
      tts_disabled: "Audio no disponible en este idioma",

      // Mock dictionary for dynamic block translations
      "In the fast-paced world of digital publishing, every post carries weight. Whether it’s a product launch, a thought leadership piece, or a community update, the process of admin pending approval is more than just a technical checkpoint—it’s an art form.":
        "En el acelerado mundo de la publicación digital, cada publicación tiene peso. Ya sea el lanzamiento de un producto, un artículo de liderazgo intelectual o una actualización de la comunidad, el proceso de aprobación pendiente del administrador es más que un simple punto de control técnico: es una forma de arte.",
      "Why Approval Matters": "Por qué es importante la aprobación",
    },
  },
  fr: {
    translation: {
      listen_to_article: "Écouter l'article",
      resume: "Reprendre",
      pause: "Pause",
      stop: "Arrêter",
      speaking: "En parlant",
      tts_disabled: "Audio non disponible dans cette langue",

      // Mock dictionary for dynamic block translations
      "In the fast-paced world of digital publishing, every post carries weight. Whether it’s a product launch, a thought leadership piece, or a community update, the process of admin pending approval is more than just a technical checkpoint—it’s an art form.":
        "Dans le monde en évolution rapide de la publication numérique, chaque article a du poids. Qu'il s'agisse du lancement d'un produit, d'un article de réflexion ou d'une mise à jour de la communauté, le processus d'approbation en attente de l'administrateur est plus qu'un simple point de contrôle technique : c'est une forme d'art.",
      "Why Approval Matters": "Pourquoi l'approbation est importante",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en", // Fallback to english if key doesn't exist
  interpolation: {
    escapeValue: false, // React already safely escapes HTML
  },
});

export default i18n;
