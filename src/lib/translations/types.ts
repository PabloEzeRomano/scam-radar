export type Locale = 'en' | 'es';

export interface TranslationDictionary {
  nav: {
    home: string;
    reports: string;
    submit: string;
    about: string;
  };
  home: {
    title: string;
    subtitle: string;
    description: string;
    ctaBrowse: string;
    ctaSubmit: string;
    redFlags: {
      title: string;
      subtitle: string;
      item1: string;
      item1Desc: string;
      item2: string;
      item2Desc: string;
      item3: string;
      item3Desc: string;
    };
    advice: {
      title: string;
      subtitle: string;
      item1: string;
      item1Desc: string;
      item2: string;
      item2Desc: string;
      item3: string;
      item3Desc: string;
    };
    cta: {
      title: string;
      subtitle: string;
    };
  };
  reports: {
    title: string;
    subtitle: string;
  };
  submit: {
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    subtitle: string;
  };
}

export interface Translations {
  en: TranslationDictionary;
  es: TranslationDictionary;
}
