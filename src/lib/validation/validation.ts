/**
 * Centralized validation functions for forms
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidLinkedIn = (linkedin: string): boolean => {
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return linkedinRegex.test(linkedin.trim());
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (email.trim() && !isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validateLinkedIn = (linkedin: string): string | null => {
  if (linkedin.trim() && !isValidLinkedIn(linkedin)) {
    return 'Please enter a valid LinkedIn profile URL';
  }
  return null;
};

export const validateUrl = (url: string): string | null => {
  if (url.trim() && !isValidUrl(url)) {
    return 'Please enter a valid URL';
  }
  return null;
};
