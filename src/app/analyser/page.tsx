'use client';

import { useT } from '@/lib/translations/TranslationsProvider';
import { useState } from 'react';
import ChatAnalyser from './components/ChatAnalyser';
import { LLMProviderSelector } from './components/LLMProviderSelector';
import RepoAnalyser from './components/RepoAnalyser';
import { ProviderConfig } from '@/types';

export default function AnalyserPage() {
  const t = useT();
  const [tab, setTab] = useState<'chat' | 'repo'>('chat');
  const [providerConfig, setProviderConfig] = useState<ProviderConfig>({
    provider: 'openrouter',
  });

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('analyser.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t('analyser.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* AI Provider Selection - Shared across both tabs */}
          <div className="mb-8">
            <LLMProviderSelector
              onChange={setProviderConfig}
              defaultProvider="openrouter"
              allowBYOForFree={false}
            />
          </div>

          {/* Tab Navigation */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden mb-8 shadow-sm">
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                tab === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setTab('chat')}
            >
              {t('analyser.tabs.chat')}
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium border-l border-gray-200 transition-colors ${
                tab === 'repo'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setTab('repo')}
            >
              {t('analyser.tabs.repo')}
            </button>
          </div>

          {/* Tab Content */}
          {tab === 'chat' ? (
            <ChatAnalyser providerConfig={providerConfig} />
          ) : (
            <RepoAnalyser providerConfig={providerConfig} />
          )}
        </div>
      </div>
    </div>
  );
}
