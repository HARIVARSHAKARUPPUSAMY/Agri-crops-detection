import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AccountType } from '../types';
import { Building2, User, Sprout, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [accountType, setAccountType] = useState<AccountType>('Organisation');

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client validation
    if (!email.trim() || !password.trim()) {
      setError('Please provide your Email ID and Password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid Email ID (e.g., name@organization.org).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'signup') {
      if (!username.trim()) {
        setError('Please enter a username.');
        setIsSubmitting(false);
        return;
      }

      const res = await register(
        username.trim(),
        email.trim(),
        password,
        accountType,
        accountType === 'Organisation' ? organizationName.trim() : undefined,
        contactNumber.trim()
      );

      if (!res.success) {
        setError(res.error || 'Registration failed.');
      }
    } else {
      const res = await login(email.trim(), password, accountType);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    }
    setIsSubmitting(false);
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    await login('demo@agrigrade.org', 'demo123', 'Organisation');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Left Visual Column: Agriculture + AI Computer Vision Inspection */}
      <div className="lg:w-1/2 relative bg-slate-900 text-white flex flex-col justify-between p-8 sm:p-12 overflow-hidden min-h-[420px] lg:min-h-screen">
        {/* Background Hero Image with measured contrast scrim */}
        <img
          src="/src/assets/images/hero_agri_inspection_1792161960913.jpg"
          alt="Agricultural Produce Inspection Line"
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        {/* Brand Kicker */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AgriGrade Systems</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-lg leading-tight mb-4 text-balance">
            AI-Based Universal Fruit and Vegetable Quality Grading System
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed">
            Multi-stage computer vision grading pipeline integrating YOLO produce segmentation, EfficientNet-B0 defect classification, and crop-specific quality rules.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="relative z-10 my-8 space-y-3 max-w-md">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-300">
              <strong className="text-white">Precision Defect Localization:</strong> Detection of bruises, fungal rot, scabs, and cuts with surface area calculation.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-300">
              <strong className="text-white">Crop-Specific Grading Engine:</strong> Deterministic compliance for Grade A, Grade B, Grade C, and Rejected produce.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-300">
              <strong className="text-white">Audit-Ready Reports:</strong> Instant PDF inspection certificates with visual evidence and reason breakdown.
            </p>
          </div>
        </div>

        {/* Bottom Proof Note */}
        <div className="relative z-10 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Enterprise & Individual Grower Portal</span>
          <span className="font-mono text-emerald-400">v2.4 Production</span>
        </div>
      </div>

      {/* Right Form Column: Authentication Flow */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your account type to access the grading inspection platform.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step A: Mandatory Account Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                1. Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('Organisation')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    accountType === 'Organisation'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className={`w-5 h-5 ${accountType === 'Organisation' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {accountType === 'Organisation' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">Organisation</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Farms, Packhouses, Logistics</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('Individual Person')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    accountType === 'Individual Person'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <User className={`w-5 h-5 ${accountType === 'Individual Person' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {accountType === 'Individual Person' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">Individual Person</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Growers, Researchers, Buyers</span>
                </button>
              </div>
            </div>

            {/* Input 1: Username */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g., Alex_Green"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  required
                />
              </div>
            )}

            {/* If organisation and sign up, ask for organisation name */}
            {mode === 'signup' && accountType === 'Organisation' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Organisation Name
                </label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={e => setOrganizationName(e.target.value)}
                  placeholder="e.g., Valley Fresh Orchards Ltd"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            )}

            {/* Input 2: Email ID */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
            </div>

            {/* Input 3: Password */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Complete Sign Up' : 'Log In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch: Sign Up or Login */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3 text-center">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Login here
                  </button>
                </span>
              ) : (
                <span>
                  New to the grading system?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Sign Up for an account
                  </button>
                </span>
              )}
            </div>

            {/* Quick Demo Pre-filled Inspector Login */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline mt-1"
            >
              Quick Test: Log in with pre-configured Demo Quality Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
