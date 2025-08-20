'use client';

import { useState, useEffect } from 'react';
import { FormField } from '@/components/FormField';
import { deriveTitleFromUrl, detectPlatform } from '@/lib/url';

interface FormData {
  type: string;
  url: string;
  title: string;
  platform: string;
  reason: string;
  email: string;
  linkedin: string;
  name: string;
  expertise: string;
}

export function SubmitForm() {
  const [formData, setFormData] = useState<FormData>({
    type: '',
    url: '',
    title: '',
    platform: '',
    reason: '',
    email: '',
    linkedin: '',
    name: '',
    expertise: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-detect title and platform when URL changes
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
    const newErrors: Partial<FormData> = {};

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (!formData.url) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }

    // Require either email or LinkedIn
    if (!formData.email && !formData.linkedin) {
      newErrors.email = 'Either email or LinkedIn URL is required';
      newErrors.linkedin = 'Either email or LinkedIn URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // For MVP, we'll just simulate the submission
      // In production, this would call your API to create the user and report
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ reason: 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          {`We'll review your report before publishing. You'll be notified once
          it's approved.`}
        </p>
        <a
          href="/reports"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Browse Reports
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Type"
            name="type"
            type="select"
            required
            options={[
              { value: '', label: 'Select type' },
              { value: 'project', label: 'Project' },
              { value: 'profile', label: 'Profile' },
              { value: 'company', label: 'Company' },
            ]}
            value={formData.type}
            onChange={(value) => handleInputChange('type', value)}
            error={errors.type}
          />

          <FormField
            label="URL"
            name="url"
            type="url"
            required
            placeholder="https://example.com"
            value={formData.url}
            onChange={(value) => handleInputChange('url', value)}
            error={errors.url}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Title (auto-detected from URL)"
            name="title"
            placeholder="Will be auto-detected from URL if left empty"
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
          />

          <FormField
            label="Platform (auto-detected from URL)"
            name="platform"
            placeholder="Will be auto-detected from URL"
            value={formData.platform}
            onChange={(value) => handleInputChange('platform', value)}
          />
        </div>

        <FormField
          label="Why is this suspicious?"
          name="reason"
          type="textarea"
          required
          placeholder="Describe the suspicious activity, red flags, or concerns..."
          value={formData.reason}
          onChange={(value) => handleInputChange('reason', value)}
          error={errors.reason}
        />

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Your Contact Information
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            We require contact information to verify reports. At least one of
            email or LinkedIn is required.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
            />

            <FormField
              label="LinkedIn URL"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={formData.linkedin}
              onChange={(value) => handleInputChange('linkedin', value)}
              error={errors.linkedin}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FormField
              label="Name (optional)"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
            />

            <FormField
              label="Expertise/Role (optional)"
              name="expertise"
              placeholder="e.g., Frontend dev, PM, Security researcher"
              value={formData.expertise}
              onChange={(value) => handleInputChange('expertise', value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
