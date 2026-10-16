import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Mail, Phone, Calendar, ShieldCheck, Check, Edit2, Save, X, ArrowLeft } from 'lucide-react';

interface ProfilePageProps {
  onBackToDashboard?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBackToDashboard }) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [organizationName, setOrganizationName] = useState(user?.organizationName || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await updateProfile({
      username: username.trim(),
      organizationName: user?.accountType === 'Organisation' ? organizationName.trim() : undefined,
      department: department.trim(),
      contactNumber: contactNumber.trim()
    });

    setIsSubmitting(false);
    if (res.success) {
      setStatusMessage('Profile updated successfully.');
      setIsEditing(false);
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage(res.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back to dashboard */}
      {onBackToDashboard && (
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      )}

      {/* Title */}
      <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your account credentials, organization identifiers, and access role.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {statusMessage && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {/* User Identity Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {user?.username}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {user?.accountType}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Account ID: {user?.id}
            </p>
          </div>
        </div>

        {/* View / Edit Form */}
        {!isEditing ? (
          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold mb-1">
                Username
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.username}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold mb-1">
                Email ID (Immutable)
              </span>
              <span className="text-sm font-mono text-slate-800 dark:text-slate-200">
                {user?.email}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold mb-1">
                Account Type
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.accountType}
              </span>
            </div>

            {user?.accountType === 'Organisation' && (
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Organisation Name
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user?.organizationName || 'Not specified'}
                </span>
              </div>
            )}

            <div>
              <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold mb-1">
                Department / Role
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.department || 'Quality Control & Produce Verification'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold mb-1">
                Contact Number
              </span>
              <span className="text-sm font-mono text-slate-800 dark:text-slate-200">
                {user?.contactNumber || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold mb-1">
                Member Since
              </span>
              <span className="text-sm font-mono text-slate-800 dark:text-slate-200">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block uppercase tracking-wider text-[10px] font-semibold mb-1">
                Access Security
              </span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Isolated Workspace Active</span>
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="py-6 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            {user?.accountType === 'Organisation' && (
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Organisation Name
                </label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={e => setOrganizationName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Department / Function
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g., Post-Harvest Operations"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          User profiles are isolated per account. You cannot access or modify inspection records belonging to other users.
        </div>
      </div>
    </div>
  );
};
