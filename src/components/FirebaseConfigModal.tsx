import React, { useState, useEffect } from 'react';
import { X, Flame, Key, ShieldCheck, Check, Copy, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { getFirebaseConfig, saveFirebaseConfig, FirebaseAuthConfig, isFirebaseReady } from '../services/firebase';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
  theme: 'light' | 'dark';
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
  theme
}) => {
  const isDark = theme === 'dark';
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [appId, setAppId] = useState('');
  const [rawSnippet, setRawSnippet] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const existing = getFirebaseConfig();
      if (existing) {
        setApiKey(existing.apiKey || '');
        setProjectId(existing.projectId || '');
        setAuthDomain(existing.authDomain || '');
        setAppId(existing.appId || '');
      }
      setSavedSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Auto-parse pasted Firebase config object snippet
  const handleParseSnippet = (text: string) => {
    setRawSnippet(text);
    setErrorMsg(null);
    try {
      // Look for apiKey, projectId, authDomain, appId in text
      const apiKeyMatch = text.match(/apiKey\s*:\s*["']([^"']+)["']/i);
      const projectIdMatch = text.match(/projectId\s*:\s*["']([^"']+)["']/i);
      const authDomainMatch = text.match(/authDomain\s*:\s*["']([^"']+)["']/i);
      const appIdMatch = text.match(/appId\s*:\s*["']([^"']+)["']/i);

      if (apiKeyMatch) setApiKey(apiKeyMatch[1]);
      if (projectIdMatch) setProjectId(projectIdMatch[1]);
      if (authDomainMatch) setAuthDomain(authDomainMatch[1]);
      if (appIdMatch) setAppId(appIdMatch[1]);
    } catch (e) {
      // Continue without breaking
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!apiKey.trim() || !projectId.trim()) {
      setErrorMsg('Please enter both the Firebase API Key and Project ID');
      return;
    }

    const config: FirebaseAuthConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      appId: appId.trim()
    };

    saveFirebaseConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    localStorage.removeItem('fykzi_firebase_config');
    setApiKey('');
    setProjectId('');
    setAuthDomain('');
    setAppId('');
    setRawSnippet('');
    onConfigSaved();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 overflow-hidden transition-all max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black flex items-center space-x-1.5">
                <span>Firebase Real Phone SMS Setup</span>
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                10,000 Free Physical SMS OTPs per month worldwide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Firebase Setup Instructions */}
        <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-300 space-y-2">
          <span className="font-black text-xs block uppercase tracking-wider text-blue-500">
            How to get your free Firebase SMS credentials (3 Minutes):
          </span>
          <ol className="list-decimal list-inside space-y-1.5 text-[11px] font-semibold">
            <li>
              Open the{' '}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
                className="underline font-black text-blue-400 hover:text-blue-300 inline-flex items-center space-x-0.5"
              >
                <span>Firebase Console</span>
                <ExternalLink className="w-3 h-3 ml-0.5 inline" />
              </a>{' '}
              and create/select a project.
            </li>
            <li>
              Go to <b>Build &gt; Authentication &gt; Sign-in method</b> and enable <b>Phone</b>.
            </li>
            <li>
              Go to <b>Project Settings (Gear icon) &gt; General &gt; Your apps &gt; Web app (&lt;/&gt;)</b>, copy the <code className="bg-blue-900/30 px-1 py-0.5 rounded">firebaseConfig</code>, and paste it below!
            </li>
          </ol>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Firebase Phone Authentication successfully configured!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-4 space-y-3.5">
          {/* Quick Paste Snippet */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              ⚡ Quick Paste <span className="font-mono text-[10px] lowercase text-slate-500">(Paste your firebaseConfig JS object here)</span>
            </label>
            <textarea
              rows={3}
              value={rawSnippet}
              onChange={(e) => handleParseSnippet(e.target.value)}
              placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "fykzi-app",\n  ...\n};`}
              className={`w-full p-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                API Key *
              </label>
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Project ID *
              </label>
              <input
                type="text"
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="fykzi-service-app"
                className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="project-id.firebaseapp.com"
                className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                App ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:123456789:web:abcdef"
                className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between space-x-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              >
                Clear Config
              </button>
            )}

            <div className="flex-1 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center space-x-1.5"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Save &amp; Enable Real SMS</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
