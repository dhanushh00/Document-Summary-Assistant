import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertCircle, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { getStoredApiKey, saveApiKey, removeApiKey } from '../services/summarizer';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
      removeApiKey();
      onKeyUpdated('');
      setStatus('idle');
      onClose();
      return;
    }

    setStatus('testing');
    setErrorMessage('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const testResult = await model.generateContent('ping');
      
      if (testResult.response.text()) {
        saveApiKey(apiKey.trim());
        onKeyUpdated(apiKey.trim());
        setStatus('valid');
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err: any) {
      console.error('API Key verification failed:', err);
      setStatus('invalid');
      setErrorMessage(
        err?.message || 'Invalid API Key. Please check permissions or quota on Google AI Studio.'
      );
    }
  };

  const handleClear = () => {
    removeApiKey();
    setApiKey('');
    onKeyUpdated('');
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Google Gemini API Key</h3>
            <p className="text-xs text-slate-400">
              Provide your API key for enhanced Gemini 1.5/2.0 summarization
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Your key is stored securely in your browser's <span className="text-brand-300 font-mono">localStorage</span> and never transmitted to any third-party servers.
            </p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
            <span className="text-slate-400">Need a free API key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2"
            >
              Get Free Key on Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent pr-20 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          {status === 'invalid' && (
            <div className="flex items-start gap-1.5 text-xs text-rose-400 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {status === 'valid' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
              <Check className="w-3.5 h-3.5" />
              <span>API Key validated successfully!</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Key
            </button>
          ) : (
            <div className="text-[11px] text-slate-400">
              *App runs in built-in offline intelligence mode without key.
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTestAndSave}
              disabled={status === 'testing'}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 rounded-xl shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              {status === 'testing' ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save & Validate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
