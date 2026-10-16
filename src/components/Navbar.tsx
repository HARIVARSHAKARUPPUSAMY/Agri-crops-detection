import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  Settings, 
  Info, 
  HelpCircle, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Sprout
} from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuSelect = (action: string) => {
    setMenuOpen(false);
    if (action === 'logout') {
      logout();
    } else {
      setActivePage(action);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div 
          onClick={() => setActivePage('dashboard')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight tracking-tight whitespace-nowrap">
              AgriGrade AI
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap">
              Universal Produce Quality Grading
            </p>
          </div>
        </div>


        {/* Top-Right Corner: Dashboard Menu */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            aria-expanded={menuOpen}
            aria-label="Dashboard Menu"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold whitespace-nowrap">Dashboard</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Specified Dropdown Menu Items in EXACT required order:
              1. Profile
              2. User Email ID
              3. Settings
              4. About
              5. Help
              6. Logout
          */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* 1. Profile */}
              <button
                onClick={() => handleMenuSelect('profile')}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                <div className="flex flex-col">
                  <span className="font-medium">Profile</span>
                  <span className="text-xs text-slate-400">{user?.username} · {user?.accountType}</span>
                </div>
              </button>

              {/* 2. User Email ID */}
              <div 
                onClick={() => handleMenuSelect('profile')}
                className="px-4 py-2 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800/80 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                title="Authenticated User Email ID"
              >
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="text-[11px] block uppercase tracking-wider text-slate-400 font-semibold">User Email ID</span>
                  <span className="text-xs font-mono truncate block text-slate-800 dark:text-slate-200">
                    {user?.email || 'unregistered@guest.org'}
                  </span>
                </div>
              </div>

              {/* 3. Settings */}
              <button
                onClick={() => handleMenuSelect('settings')}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span className="font-medium">Settings</span>
              </button>

              {/* 4. About */}
              <button
                onClick={() => handleMenuSelect('about')}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Info className="w-4 h-4 text-slate-500" />
                <span className="font-medium">About</span>
              </button>

              {/* 5. Help */}
              <button
                onClick={() => handleMenuSelect('help')}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span className="font-medium">Help</span>
              </button>

              {/* 6. Logout */}
              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleMenuSelect('logout')}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
