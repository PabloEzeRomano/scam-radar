export type Locale = 'en' | 'es';

export interface TranslationDictionary {
  nav: {
    home: string;
    reports: string;
    submit: string;
    about: string;
    contact: string;
    switchToSpanish: string;
    switchToEnglish: string;
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
      item4: string;
      item4Desc: string;
      item5: string;
      item5Desc: string;
      item6: string;
      item6Desc: string;
      item7: string;
      item7Desc: string;
      item8: string;
      item8Desc: string;
      item9: string;
      item9Desc: string;
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
      item4: string;
      item4Desc: string;
      item5: string;
      item5Desc: string;
      item6: string;
      item6Desc: string;
      item7: string;
      item7Desc: string;
      item8: string;
      item8Desc: string;
      item9: string;
      item9Desc: string;
    };
    cta: {
      title: string;
      subtitle: string;
    };
  };
  reports: {
    title: string;
    subtitle: string;
    loading: string;
    noResults: string;
    noReports: string;
    noResultsDesc: string;
    noReportsDesc: string;
    submitFirst: string;
    untitled: string;
    platform: string;
    unknown: string;
    whySuspicious: string;
    types: {
      project: string;
      profile: string;
      company: string;
    };
    statuses: {
      pending: string;
      approved: string;
      rejected: string;
    };
  };
  filters: {
    filterByType: string;
    allTypes: string;
    projects: string;
    profiles: string;
    companies: string;
    searchReports: string;
    searchPlaceholder: string;
  };
  submit: {
    title: string;
    subtitle: string;
    form: {
      type: string;
      selectType: string;
      url: string;
      urlPlaceholder: string;
      title: string;
      titlePlaceholder: string;
      platform: string;
      platformPlaceholder: string;
      reason: string;
      reasonPlaceholder: string;
      contactInfo: string;
      contactInfoDesc: string;
      email: string;
      emailPlaceholder: string;
      linkedin: string;
      linkedinPlaceholder: string;
      name: string;
      namePlaceholder: string;
      expertise: string;
      expertisePlaceholder: string;
      submit: string;
      submitting: string;
    };
    validation: {
      typeRequired: string;
      urlRequired: string;
      urlInvalid: string;
      reasonRequired: string;
      contactRequired: string;
      submissionFailed: string;
    };
    success: {
      title: string;
      message: string;
      browseReports: string;
    };
  };
  analyser: {
    title: string;
    subtitle: string;
    tabs: {
      chat: string;
      repo: string;
    };
    chat: {
      title: string;
      subtitle: string;
      input: string;
      screenshots: string;
      chatText: string;
      chatTextPlaceholder: string;
      analyseButton: string;
      processingImages: string;
      analysing: string;
      errorNoText: string;
      ocrError: string;
    };
    repo: {
      title: string;
      subtitle: string;
      input: string;
      repoUrl: string;
      repoUrlPlaceholder: string;
      zipFile: string;
      analyseButton: string;
      analysing: string;
      errorNoZip: string;
    };
    results: {
      title: string;
      riskScore: string;
      summary: string;
      flags: string;
      guidance: string;
      entities: string;
      emails: string;
      urls: string;
      wallets: string;
      signals: string;
      suspiciousScripts: string;
      suspiciousFiles: string;
      findings: string;
      evidence: string;
      convertToReport: string;
    };
    reportForm: {
      title: string;
      submitButton: string;
    };
    common: {
      errorAnalysing: string;
      errorAnalysingRepo: string;
      reportSubmitted: string;
      errorSubmitting: string;
    };
    providerSelector: {
      title: string;
      heuristic: string;
      openrouter: string;
      cloudflare: string;
      deepseek: string;
      openai: string;
      tooltips: {
        heuristic: string;
        openrouter: string;
        cloudflare: string;
        deepseek: string;
        openai: string;
      };
      openRouterKey: string;
      openRouterKeyPlaceholder: string;
      cloudflareToken: string;
      cloudflareAccountId: string;
      cloudflareModel: string;
      deepseekKey: string;
      deepseekKeyPlaceholder: string;
      openaiKey: string;
      openaiKeyPlaceholder: string;
      info: {
        heuristic: string;
        serverKey: string;
        byoKey: string;
      };
    };
  };
  fileDropzone: {
    clickToUpload: string;
    dragAndDrop: string;
    anyFileType: string;
    upTo: string;
    filesSelected: string;
    fileSelected: string;
    removeFile: string;
  };
  about: {
    title: string;
    subtitle: string;
    mission: string;
    missionText: string;
    howItWorks: string;
    howItWorksText: string;
    submissionGuidelines: string;
    guidelines: {
      specific: string;
      specificDesc: string;
      evidence: string;
      evidenceDesc: string;
      factual: string;
      factualDesc: string;
      contact: string;
      contactDesc: string;
    };
    whatWeLookFor: string;
    lookFor: {
      codePatterns: string;
      encodedStrings: string;
      missingInfo: string;
      dramaticStories: string;
      sensitiveInfo: string;
    };
    privacyEthics: string;
    privacyEthicsText: string;
    disclaimer: string;
    disclaimerText: string;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      linkedin: string;
      linkedinPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      error: string;
    };
    validation: {
      messageRequired: string;
      messageTooLong: string;
      contactRequired: string;
      emailInvalid: string;
      linkedinInvalid: string;
    };
    success: {
      title: string;
      message: string;
      sendAnother: string;
    };
  };
  footer: {
    quickLinks: string;
    contact: string;
    brandDescription: string;
    location: string;
    whatsappMessage: string;
    emailSubject: string;
    emailBody: string;
    whatsappHelp: string;
    whatsappTitle: string;
    linkedinConnect: string;
    linkedinTitle: string;
    githubView: string;
    githubTitle: string;
    emailReport: string;
    emailTitle: string;
    copyright: string;
    rights: string;
    disclaimer: string;
    checkPortfolio: string;
  };
}

export interface Translations {
  en: TranslationDictionary;
  es: TranslationDictionary;
}
