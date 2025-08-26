'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/lib/translations/TranslationsProvider';
import { FormField } from '@/components/FormField';
import { userServices, suggestionServices } from '@/lib/firebase/services';
import {
  isValidEmail,
  isValidLinkedIn,
  validateRequired,
} from '@/lib/validation/validation';

interface FormData {
  name: string;
  email: string;
  linkedin: string;
  message: string;
  website?: string; // Honeypot field
}

interface FormErrors {
  name?: string;
  email?: string;
  linkedin?: string;
  message?: string;
  contact?: string;
}

export function ContactForm() {
  const t = useT();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    linkedin: '',
    message: '',
    website: '', // Honeypot field
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const disableSubmit = useMemo(() => {
    return !formData.message || (!formData.email && !formData.linkedin);
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Check honeypot field - if filled, likely a bot
    if (formData.website) {
      return false; // Silently reject bot submissions
    }

    // Message is required
    const messageError = validateRequired(formData.message, 'Message');
    if (messageError) {
      newErrors.message = t('contact.validation.messageRequired');
    }

    // Message length check (up to 1000 chars)
    if (formData.message.trim().length > 1000) {
      newErrors.message = t('contact.validation.messageTooLong');
    }

    // Either email or LinkedIn is required
    if (!formData.email.trim() && !formData.linkedin.trim()) {
      newErrors.contact = t('contact.validation.contactRequired');
    }

    // Validate email if provided
    if (formData.email.trim() && !isValidEmail(formData.email)) {
      newErrors.email = t('contact.validation.emailInvalid');
    }

    // Validate LinkedIn if provided
    if (formData.linkedin.trim() && !isValidLinkedIn(formData.linkedin)) {
      newErrors.linkedin = t('contact.validation.linkedinInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.contact) {
      setErrors((prev) => ({ ...prev, contact: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Determine contact method (email or LinkedIn)
      const contactMethod = formData.email.trim() ? 'email' : 'linkedin';
      const contactValue = formData.email.trim() || formData.linkedin.trim();

      // Upsert user (create if doesn't exist, update if does)
      const userData = {
        name: formData.name.trim() || undefined,
        [contactMethod]: contactValue,
      };

      const user = await userServices.upsertUser(userData);

      // Create suggestion
      await suggestionServices.createSuggestion({
        userId: user.id!,
        message: formData.message.trim(),
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        linkedin: '',
        message: '',
        website: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('contact.success.title')}
          </h3>
          <p className="text-gray-600 mb-6">{t('contact.success.message')}</p>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {t('contact.success.sendAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - hidden from users but visible to bots */}
        <div className="hidden">
          <label htmlFor="website" className="sr-only">
            Website
          </label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <FormField
          label={t('contact.form.name')}
          name="name"
          type="text"
          value={formData.name}
          onChange={(value) => handleInputChange('name', value)}
          placeholder={t('contact.form.namePlaceholder')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label={t('contact.form.email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            error={errors.email}
            placeholder={t('contact.form.emailPlaceholder')}
          />

          <FormField
            label={t('contact.form.linkedin')}
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={(value) => handleInputChange('linkedin', value)}
            error={errors.linkedin}
            placeholder={t('contact.form.linkedinPlaceholder')}
          />
        </div>

        <FormField
          label={t('contact.form.message')}
          name="message"
          type="textarea"
          value={formData.message}
          onChange={(value) => handleInputChange('message', value)}
          required
          error={errors.message}
          placeholder={t('contact.form.messagePlaceholder')}
          rows={5}
        />

        {errors.contact && (
          <div className="text-red-600 text-sm">{errors.contact}</div>
        )}

        {submitStatus === 'error' && (
          <div className="text-red-600 text-sm">{t('contact.form.error')}</div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || disableSubmit}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? t('contact.form.submitting')
              : t('contact.form.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
