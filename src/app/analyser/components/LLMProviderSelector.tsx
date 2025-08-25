'use client';
import { useEffect, useState } from 'react';
import { FormField } from '../../../components/FormField';
import { useT } from '../../../lib/translations/TranslationsProvider';
import {
  Provider,
  ProviderConfig,
  LLMProviderSelectorProps,
} from '@/types';

export function LLMProviderSelector({
  onChange,
  defaultProvider = 'openrouter',
  allowBYOForFree = false,
}: LLMProviderSelectorProps) {
  const t = useT();
  const [provider, setProvider] = useState<Provider>(defaultProvider);
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [cfToken, setCfToken] = useState('');
  const [cfAccountId, setCfAccountId] = useState('');
  const [cfModel, setCfModel] = useState('@cf/meta/llama-3.1-8b-instruct');

  useEffect(() => {
    const cfg: ProviderConfig = { provider };
    if (provider === 'deepseek') cfg.deepseekKey = deepseekKey || undefined;
    if (provider === 'openai') cfg.openaiKey = openaiKey || undefined;
    if (provider === 'openrouter' && allowBYOForFree)
      cfg.openRouterKey = openRouterKey || undefined;
    if (provider === 'cloudflare') {
      if (allowBYOForFree) {
        cfg.cloudflare = {
          token: cfToken || undefined,
          accountId: cfAccountId || undefined,
          model: cfModel || undefined,
        };
      } else {
        cfg.cloudflare = { model: cfModel || undefined };
      }
    }
    onChange(cfg);
  }, [
    provider,
    openRouterKey,
    deepseekKey,
    openaiKey,
    cfToken,
    cfAccountId,
    cfModel,
    allowBYOForFree,
    onChange,
  ]);

  const getInfoText = () => {
    if (provider === 'heuristic')
      return t('analyser.providerSelector.info.heuristic');
    if (provider === 'openrouter' || provider === 'cloudflare')
      return t('analyser.providerSelector.info.serverKey');
    return t('analyser.providerSelector.info.byoKey');
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">
        {t('analyser.providerSelector.title')}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(
          [
            'heuristic',
            'openrouter',
            'cloudflare',
            'deepseek',
            'openai',
          ] as Provider[]
        ).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setProvider(p)}
            className={`px-4 py-3 rounded-md border text-sm font-medium transition-all duration-200 ${
              provider === p
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            title={t(`analyser.providerSelector.tooltips.${p}`)}
          >
            {t(`analyser.providerSelector.${p}`)}
          </button>
        ))}
      </div>

      {provider === 'openrouter' && allowBYOForFree && (
        <FormField
          label={t('analyser.providerSelector.openRouterKey')}
          type="text"
          placeholder={t('analyser.providerSelector.openRouterKeyPlaceholder')}
          value={openRouterKey}
          onChange={setOpenRouterKey}
          optional
        />
      )}

      {provider === 'cloudflare' && (
        <div className="space-y-4">
          {allowBYOForFree && (
            <>
              <FormField
                label={t('analyser.providerSelector.cloudflareToken')}
                type="text"
                value={cfToken}
                onChange={setCfToken}
                optional
              />
              <FormField
                label={t('analyser.providerSelector.cloudflareAccountId')}
                type="text"
                value={cfAccountId}
                onChange={setCfAccountId}
                optional
              />
            </>
          )}
          <FormField
            label={t('analyser.providerSelector.cloudflareModel')}
            type="text"
            value={cfModel}
            onChange={setCfModel}
            optional
          />
        </div>
      )}

      {provider === 'deepseek' && (
        <FormField
          label={t('analyser.providerSelector.deepseekKey')}
          type="text"
          placeholder={t('analyser.providerSelector.deepseekKeyPlaceholder')}
          value={deepseekKey}
          onChange={setDeepseekKey}
          optional
        />
      )}

      {provider === 'openai' && (
        <FormField
          label={t('analyser.providerSelector.openaiKey')}
          type="text"
          placeholder={t('analyser.providerSelector.openaiKeyPlaceholder')}
          value={openaiKey}
          onChange={setOpenaiKey}
          optional
        />
      )}

      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
        {getInfoText()}
      </p>
    </div>
  );
}
