// Tipos compartidos por las landings /mujeres y /hombres.
// El mismo shell (GenderPage) renderiza con la data que recibe.

import type { LucideIcon } from "lucide-react";
import type { GenderAudience } from "../../lib/supabase";

export interface StatItem {
  value: string;
  label: string;
  source: string;
}

export interface CardItem {
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface LifeStageItem {
  icon: LucideIcon;
  badge: string;
  title: string;
  body: string;
}

// Arquetipos: perfiles concretos para que cada persona se sienta vista.
// Cada uno incluye un dato estadístico real con su fuente.
export interface ArchetypeItem {
  icon: LucideIcon;
  name: string;
  ageRange: string;
  profile: string;
  stat: string;
  source: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormConfig {
  // campo específico del género (life_stage para mujeres, main_goal para hombres)
  specificField: {
    key: "lifeStage" | "mainGoal";
    label: string;
    options: SelectOption[];
  };
  // campo secundario (main_concern mujeres, exercise_frequency hombres)
  secondaryField: {
    key: "mainConcern" | "exerciseFrequency";
    label: string;
    options: SelectOption[];
  };
}

export interface GenderContent {
  audience: GenderAudience;
  route: "/mujeres" | "/hombres";

  // Theme — controla la paleta primary/secondary vía CSS vars.
  // Valor: "theme-women" o "theme-men" (definidos en src/index.css).
  themeClass: string;

  // SEO
  seoTitle: string;
  seoDescription: string;

  // Hero
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubhead: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroBadgeLeft: string;
  heroBadgeRight: string;
  heroVisualLabel: string; // "Cíclico" / "Sostenido"

  // Stats
  stats: StatItem[];

  // Problem
  problemEyebrow: string;
  problemTitle: string;
  problemTitleHighlight: string;
  problemBullets: string[];
  problemClosing: string;

  // Archetypes — sección clave para que cada persona se reconozca
  archetypesEyebrow: string;
  archetypesTitle: string;
  archetypesTitleHighlight: string;
  archetypesLede: string;
  archetypes: ArchetypeItem[];

  // Science
  scienceEyebrow: string;
  scienceTitle: string;
  scienceTitleHighlight: string;
  scienceCards: CardItem[];

  // Experience
  experienceEyebrow: string;
  experienceTitle: string;
  experienceTitleHighlight: string;
  experienceLede: string;
  experienceBullets: string[];

  // Life stages
  lifeStagesEyebrow: string;
  lifeStagesTitle: string;
  lifeStagesTitleHighlight: string;
  lifeStagesLede: string;
  lifeStages: LifeStageItem[];

  // Benefits
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsTitleHighlight: string;
  benefits: CardItem[];

  // Guide
  guideEyebrow: string;
  guideTitle: string;
  guideQuote: string;

  // FAQ
  faqEyebrow: string;
  faqTitle: string;
  faqs: FAQItem[];

  // Form
  formEyebrow: string;
  formTitle: string;
  formTitleHighlight: string;
  formLede: string;
  formConfig: FormConfig;
  ageRanges: SelectOption[];
  interests: SelectOption[];

  // Final CTA
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalCtaButton: string;

  // Inclusivity
  inclusivityNote: string;

  // Source for tracking
  trackingSource: "men_landing" | "women_landing";
}
