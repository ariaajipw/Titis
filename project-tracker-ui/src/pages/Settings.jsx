// src/pages/Settings.jsx
import { Sun, Moon, Monitor, User, Bell, Shield, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const THEME_OPTIONS = [
  { value: 'light',  icon: Sun,     label: 'Light',  description: 'Always use light mode' },
  { value: 'system', icon: Monitor, label: 'System', description: 'Follow your OS setting' },
  { value: 'dark',   icon: Moon,    label: 'Dark',   description: 'Always use dark mode' },
];

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center">
      <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
    </div>
    <div>
      <h2 className="text-m font-semibold text-slate-800 dark:text-zinc-100">{title}</h2>
      {description && <p className="text-s text-slate-400 dark:text-zinc-500 mt-0.5">{description}</p>}
    </div>
  </div>
);

const SettingsCard = ({ children }) => (
  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 mb-5 transition-colors duration-200">
    {children}
  </div>
);

const InputField = ({ label, type = 'text', defaultValue, disabled }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-600 dark:text-zinc-300">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      disabled={disabled}
      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    />
  </div>
);

const Toggle = ({ label, description, defaultChecked }) => (
  <label className="flex items-center justify-between gap-4 cursor-pointer py-1">
    <div>
      <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">{label}</p>
      {description && <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{description}</p>}
    </div>
    <div className="relative flex-shrink-0">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-10 h-5.5 bg-slate-200 dark:bg-zinc-700 rounded-full peer peer-checked:bg-violet-500 dark:peer-checked:bg-violet-700 transition-colors" />
      <div className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-[18px]" />
    </div>
  </label>
);

export const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-full">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-slate-900 dark:text-zinc-100 text-2xl font-bold">Settings</h1>
        <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
          Manage your account preferences and app settings.
        </p>
      </div>

      {/* ── Profile ── */}
      <SettingsCard>
        <SectionHeader icon={User} title="Profile" description="Your personal information" />
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
            AA
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">Aria Aji Perkasa</p>
            <p className="text-xs text-slate-400 dark:text-zinc-500">aria@titis.app</p>
            <button className="mt-1.5 text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">
              Change avatar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Full Name"     defaultValue="Aria Aji Perkasa" />
          <InputField label="Email"         defaultValue="aria@titis.app" disabled />
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-all active:scale-95">
            Save Changes
          </button>
        </div>
      </SettingsCard>

      {/* ── Appearance ──
      <SettingsCard>
        <SectionHeader icon={Sun} title="Appearance" description="Customize how Titis looks" />
        <p className="text-xs text-slate-400 dark:text-zinc-500 mb-3">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map(({ value, icon: Icon, label, description }) => {
            const isActive = theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                  isActive
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                    : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 bg-slate-50 dark:bg-zinc-800/50'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? 'bg-violet-100 dark:bg-violet-500/20' : 'bg-slate-100 dark:bg-zinc-700'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-zinc-400'}`} />
                </div>
                <div>
                  <p className={`text-xs font-semibold ${isActive ? 'text-violet-700 dark:text-violet-300' : 'text-slate-600 dark:text-zinc-300'}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 leading-snug hidden sm:block">
                    {description}
                  </p>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                )}
              </button>
            );
          })}
        </div>
      </SettingsCard> */}

      {/* ── Notifications ── */}
      <SettingsCard>
        <SectionHeader icon={Bell} title="Notifications" description="Control what you get notified about" />
        <div className="space-y-4">
          <Toggle label="Task assigned to me"    description="When someone assigns you a task"  defaultChecked={true} />
          <div className="border-t border-slate-100 dark:border-zinc-800" />
          <Toggle label="Task overdue reminders" description="24h before a task due date"        defaultChecked={true} />
          <div className="border-t border-slate-100 dark:border-zinc-800" />
          <Toggle label="Team member joined"     description="When someone joins your project"   defaultChecked={false} />
          <div className="border-t border-slate-100 dark:border-zinc-800" />
          <Toggle label="Weekly summary"         description="A weekly digest of project activity" defaultChecked={true} />
        </div>
      </SettingsCard>

      {/* ── Security ── */}
      <SettingsCard>
        <SectionHeader icon={Shield} title="Security" description="Manage your account security" />
        <div className="space-y-2">
          {[
            { label: 'Change Password', sub: 'Update your password' },
            { label: 'Two-Factor Auth', sub: 'Add an extra layer of security' },
            { label: 'Active Sessions', sub: 'Manage logged-in devices' },
          ].map(({ label, sub }) => (
            <button
              key={label}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left group"
            >
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">{label}</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-slate-500 dark:group-hover:text-zinc-400 transition-colors" />
            </button>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
};
