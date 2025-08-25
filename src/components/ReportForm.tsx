'use client';

import { FormField } from '@/components/FormField';
import { reportServices, userServices } from '@/lib/firebase/services';
import { useT } from '@/lib/translations/TranslationsProvider';
import { ReportFormData, ReportFormProps, ReportType } from '@/types';
import { deriveTitleFromUrl, detectPlatform } from '@/lib/url';
import { isValidEmail, isValidLinkedIn, validateUrl } from '@/lib/validation';
import { useEffect, useMemo, useState } from 'react';

export function ReportForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitButtonText,
  showHoneypot = true,
  className = '',
}: ReportFormProps) {
  const t = useT();
  const [formData, setFormData] = useState<ReportFormData>({
    type: '' as ReportType,
    url: '',
    title: '',
    platform: '',
    reason: '',
    email: '',
    linkedin: '',
    name: '',
    expertise: '',
    website: '', // Honeypot field
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<ReportFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.url) {
      try {
        new URL(formData.url); // Validate URL format

        if (!formData.title) {
          setFormData((prev) => ({
            ...prev,
            title: deriveTitleFromUrl(formData.url),
          }));
        }

        if (!formData.platform) {
          setFormData((prev) => ({
            ...prev,
            platform: detectPlatform(formData.url),
          }));
        }
      } catch {
        // Invalid URL, don't auto-fill
      }
    }
  }, [formData.url, formData.platform, formData.title]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ReportFormData> = {};

    // Check honeypot field - if filled, likely a bot
    if (showHoneypot && formData.website) {
      return false; // Silently reject bot submissions
    }

    if (!formData.type) {
      newErrors.type = t('submit.validation.typeRequired') as ReportType;
    }

    if (!formData.url) {
      newErrors.url = t('submit.validation.urlRequired');
    } else {
      const urlError = validateUrl(formData.url);
      if (urlError) {
        newErrors.url = t('submit.validation.urlInvalid');
      }
    }

    if (!formData.reason) {
      newErrors.reason = t('submit.validation.reasonRequired');
    }

    // Require either email or LinkedIn
    if (!formData.email && !formData.linkedin) {
      newErrors.email = t('submit.validation.contactRequired');
      newErrors.linkedin = t('submit.validation.contactRequired');
    }

    // Validate email if provided
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = t('submit.validation.emailInvalid');
    }

    // Validate LinkedIn if provided
    if (formData.linkedin && !isValidLinkedIn(formData.linkedin)) {
      newErrors.linkedin = t('submit.validation.linkedinInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const disableSubmit = useMemo(() => {
    return (
      !formData.url ||
      !formData.reason ||
      (!formData.email && !formData.linkedin)
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await userServices.upsertUser({
        email: formData.email,
        name: formData.name,
        expertise: formData.expertise,
        linkedin: formData.linkedin,
      });

      const report = await reportServices.createReport({
        url: formData.url,
        title: formData.title,
        type: formData.type,
        reason: formData.reason,
        reporterId: user.id,
        status: 'pending',
      });

      if (onSubmit) {
        onSubmit(report.id ?? '');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ reason: t('submit.validation.submissionFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - hidden from users but visible to bots */}
        {showHoneypot && (
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label={t('submit.form.type')}
            name="type"
            type="select"
            required
            options={[
              { value: '', label: t('submit.form.selectType') },
              { value: 'project', label: t('reports.types.project') },
              { value: 'profile', label: t('reports.types.profile') },
              { value: 'company', label: t('reports.types.company') },
            ]}
            value={formData.type}
            onChange={(value) => handleInputChange('type', value)}
            error={errors.type}
          />

          <FormField
            label={t('submit.form.url')}
            name="url"
            type="url"
            required
            placeholder={t('submit.form.urlPlaceholder')}
            value={formData.url}
            onChange={(value) => handleInputChange('url', value)}
            error={errors.url}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label={t('submit.form.title')}
            name="title"
            placeholder={t('submit.form.titlePlaceholder')}
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
          />

          <FormField
            label={t('submit.form.platform')}
            name="platform"
            placeholder={t('submit.form.platformPlaceholder')}
            value={formData.platform}
            onChange={(value) => handleInputChange('platform', value)}
          />
        </div>

        <FormField
          label={t('submit.form.reason')}
          name="reason"
          type="textarea"
          required
          placeholder={t('submit.form.reasonPlaceholder')}
          value={formData.reason}
          onChange={(value) => handleInputChange('reason', value)}
          error={errors.reason}
        />

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('submit.form.contactInfo')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('submit.form.contactInfoDesc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label={t('submit.form.email')}
              name="email"
              type="email"
              placeholder={t('submit.form.emailPlaceholder')}
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
            />

            <FormField
              label={t('submit.form.linkedin')}
              name="linkedin"
              type="url"
              placeholder={t('submit.form.linkedinPlaceholder')}
              value={formData.linkedin}
              onChange={(value) => handleInputChange('linkedin', value)}
              error={errors.linkedin}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FormField
              label={t('submit.form.name')}
              name="name"
              placeholder={t('submit.form.namePlaceholder')}
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
            />

            <FormField
              label={t('submit.form.expertise')}
              name="expertise"
              placeholder={t('submit.form.expertisePlaceholder')}
              value={formData.expertise}
              onChange={(value) => handleInputChange('expertise', value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-6 space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || disableSubmit}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t('submit.form.submitting')}
              </>
            ) : (
              submitButtonText || t('submit.form.submit')
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
