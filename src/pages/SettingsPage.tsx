import React, { useState, useRef } from 'react';
import {
  User,
  Clock,
  Volume2,
  VolumeX,
  Bell,
  Palette,
  RotateCcw,
  Download,
  Upload,
  Check,
  ShieldCheck,
  Briefcase,
  Play,
  Flame,
  Pipette,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  playNotificationSound,
  playPomodoroSound,
  stopAudioPlayback,
} from '../utils/audio';
import { NotificationSoundType, PomodoroSoundType } from '../types';

interface HueFamily {
  name: string;
  shades: { label: string; hex: string }[];
}

const HUE_FAMILIES: HueFamily[] = [
  {
    name: 'Sage (Brand)',
    shades: [
      { label: 'Mint Sage', hex: '#A3C9AE' },
      { label: 'DayGrid Sage (Default)', hex: '#4A7C59' },
      { label: 'Deep Forest', hex: '#1E5031' },
    ],
  },
  {
    name: 'Emerald',
    shades: [
      { label: 'Light Emerald', hex: '#6EE7B7' },
      { label: 'Vibrant Emerald', hex: '#10B981' },
      { label: 'Dark Emerald', hex: '#047857' },
    ],
  },
  {
    name: 'Teal',
    shades: [
      { label: 'Soft Teal', hex: '#5EEAD4' },
      { label: 'Ocean Teal', hex: '#14B8A6' },
      { label: 'Deep Teal', hex: '#0F766E' },
    ],
  },
  {
    name: 'Cyan & Sky',
    shades: [
      { label: 'Sky Blue', hex: '#7DD3FC' },
      { label: 'Cerulean', hex: '#0284C7' },
      { label: 'Deep Navy', hex: '#0369A1' },
    ],
  },
  {
    name: 'Blue',
    shades: [
      { label: 'Ice Blue', hex: '#93C5FD' },
      { label: 'Cobalt Blue', hex: '#2563EB' },
      { label: 'Midnight Blue', hex: '#1E3A8A' },
    ],
  },
  {
    name: 'Indigo',
    shades: [
      { label: 'Soft Indigo', hex: '#A5B4FC' },
      { label: 'Royal Indigo', hex: '#6366F1' },
      { label: 'Deep Indigo', hex: '#4338CA' },
    ],
  },
  {
    name: 'Purple & Violet',
    shades: [
      { label: 'Lavender', hex: '#D8B4FE' },
      { label: 'Amethyst', hex: '#9333EA' },
      { label: 'Dark Purple', hex: '#581C87' },
    ],
  },
  {
    name: 'Fuchsia & Pink',
    shades: [
      { label: 'Petal Pink', hex: '#F9A8D4' },
      { label: 'Vivid Fuchsia', hex: '#D946EF' },
      { label: 'Berry Wine', hex: '#831843' },
    ],
  },
  {
    name: 'Rose & Red',
    shades: [
      { label: 'Coral Rose', hex: '#FDA4AF' },
      { label: 'Crimson Red', hex: '#E11D48' },
      { label: 'Dark Garnet', hex: '#881337' },
    ],
  },
  {
    name: 'Orange',
    shades: [
      { label: 'Peach Orange', hex: '#FDBA74' },
      { label: 'Tangerine', hex: '#EA580C' },
      { label: 'Burnt Orange', hex: '#9A3412' },
    ],
  },
  {
    name: 'Amber & Gold',
    shades: [
      { label: 'Warm Amber', hex: '#FCD34D' },
      { label: 'Golden Honey', hex: '#D97706' },
      { label: 'Deep Ochre', hex: '#78350F' },
    ],
  },
  {
    name: 'Lime',
    shades: [
      { label: 'Bright Lime', hex: '#BEF264' },
      { label: 'Olive Lime', hex: '#65A30D' },
      { label: 'Dark Olive', hex: '#365314' },
    ],
  },
  {
    name: 'Slate & Charcoal',
    shades: [
      { label: 'Silver Mist', hex: '#94A3B8' },
      { label: 'Slate Blue-Grey', hex: '#475569' },
      { label: 'Charcoal Black', hex: '#0F172A' },
    ],
  },
];

const NOTIFICATION_SOUND_OPTIONS: { id: NotificationSoundType; label: string; desc: string }[] = [
  { id: 'Default', label: 'Default Ping', desc: 'Crisp 2-tone crystal ping' },
  { id: 'Soft Chime', label: 'Soft Chime', desc: 'Mindful relaxing triad chime' },
  { id: 'Bell', label: 'Temple Bell', desc: 'Resonant brass bell with rich overtones' },
  { id: 'Digital Ping', label: 'Digital Ping', desc: 'Crisp modern electronic ping' },
  { id: 'Gentle Pop', label: 'Gentle Pop', desc: 'Acoustic bubble droplet pop' },
  { id: 'Water Drop', label: 'Water Drop', desc: 'Resonant upward glide water droplet' },
  { id: 'Marimba', label: 'Marimba Arpeggio', desc: 'Warm wooden percussion mallets' },
  { id: 'Classic Notification', label: 'Classic Notification', desc: 'Polished ascending chime' },
];

const POMODORO_SOUND_OPTIONS: { id: PomodoroSoundType; label: string; desc: string }[] = [
  { id: 'Default Alarm', label: 'Default Alarm', desc: 'Double ascending major chords' },
  { id: 'Gentle Bell', label: 'Gentle Bell', desc: 'Deep 432Hz meditation singing bowl' },
  { id: 'Digital Alarm', label: 'Digital Alarm', desc: 'Modern electronic 3-pulse cadence' },
  { id: 'Classic Clock', label: 'Classic Clock', desc: 'Dual brass mechanical desk bell strike' },
  { id: 'Soft Chime', label: 'Soft Chime', desc: '4-chord progression chime in D Major' },
  { id: 'Nature Alert', label: 'Nature Alert', desc: 'Forest dawn melodic acoustic whistle' },
  { id: 'Double Beep', label: 'Double Beep', desc: 'Professional double wrist timer beep' },
  { id: 'Success Tone', label: 'Success Tone', desc: 'Triumphant major-seventh fanfare' },
];

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    updateProfile,
    resetAllData,
    clearAllWorkspaceData,
    loadDemoData,
    importAllData,
    scheduleTasks,
    matrixTasks,
    dailyWins,
    energyLogs,
    focusLogs,
    activityRecords,
    openConfirmModal,
  } = useApp();

  const [name, setName] = useState(settings.profile.name);
  const [title, setTitle] = useState(settings.profile.title);
  const [workStart, setWorkStart] = useState(settings.profile.workStartHour);
  const [workEnd, setWorkEnd] = useState(settings.profile.workEndHour);
  const [avatarColor, setAvatarColor] = useState(settings.profile.avatarColor);
  const [customColors, setCustomColors] = useState<string[]>(() => {
    return settings.profile.customAvatarColor ? [settings.profile.customAvatarColor] : [];
  });
  const [selectedFamilyIdx, setSelectedFamilyIdx] = useState(0);
  const [isPaletteExpanded, setIsPaletteExpanded] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeColorPickerRef = useRef<HTMLInputElement | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'DayGrid User',
      title: title.trim() || 'Knowledge Worker',
      workStartHour: workStart,
      workEndHour: workEnd,
      avatarColor,
      customAvatarColor: customColors[0],
    });
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  const handleCustomColorPicked = (hex: string) => {
    setAvatarColor(hex);
    if (!customColors.includes(hex)) {
      setCustomColors((prev) => [hex, ...prev.slice(0, 4)]);
    }
    updateProfile({ avatarColor: hex, customAvatarColor: hex });
  };

  const handleResetAvatarColor = () => {
    const defaultColor = '#4A7C59';
    setAvatarColor(defaultColor);
    updateProfile({ avatarColor: defaultColor });
  };

  const handlePreviewNotificationSound = (sound: NotificationSoundType) => {
    stopAudioPlayback();
    playNotificationSound(sound, settings.soundVolume, settings.isMuted);
  };

  const handlePreviewPomodoroSound = (sound: PomodoroSoundType) => {
    stopAudioPlayback();
    playPomodoroSound(sound, settings.soundVolume, settings.isMuted);
  };

  const handleResetAudioDefaults = () => {
    updateSettings({
      soundEnabled: true,
      soundVolume: 80,
      isMuted: false,
      notificationSound: 'Default',
      pomodoroSound: 'Default Alarm',
    });
    setStatusMessage({ text: 'Audio settings reset to defaults.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportData = () => {
    const backup = {
      version: '1.0',
      scheduleTasks,
      matrixTasks,
      dailyWins,
      energyLogs,
      focusLogs,
      activityRecords,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daygrid-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ text: 'Backup downloaded successfully.' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawJson = event.target?.result as string;
        const parsed = JSON.parse(rawJson);
        const result = importAllData(parsed);
        if (result.success) {
          if (parsed.settings?.profile) {
            setName(parsed.settings.profile.name || name);
            setTitle(parsed.settings.profile.title || title);
            setWorkStart(parsed.settings.profile.workStartHour || workStart);
            setWorkEnd(parsed.settings.profile.workEndHour || workEnd);
            setAvatarColor(parsed.settings.profile.avatarColor || avatarColor);
          }
          setStatusMessage({ text: result.message });
        } else {
          setStatusMessage({ text: result.message, isError: true });
        }
      } catch {
        setStatusMessage({ text: 'Invalid JSON file. Please provide a valid DayGrid backup file.', isError: true });
      }
      setTimeout(() => setStatusMessage(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    openConfirmModal({
      title: 'Reset to Clean Factory State?',
      message:
        'This will clear all tasks, history, and restore standard factory settings. This action cannot be undone unless you export a JSON backup first.',
      confirmText: 'Reset to Defaults',
      isDestructive: true,
      onConfirm: () => {
        resetAllData();
        setName('DayGrid User');
        setTitle('Daily Productivity Focus');
        setWorkStart('08:00');
        setWorkEnd('17:00');
        setAvatarColor('#4A7C59');
        setStatusMessage({ text: 'Application reset to clean factory defaults.' });
        setTimeout(() => setStatusMessage(null), 3000);
      },
    });
  };

  const handleClearWorkspace = () => {
    openConfirmModal({
      title: 'Clear All Tasks & Start Blank?',
      message:
        'This will remove all schedule blocks, priority items, daily wins, and focus logs so you can build your own routine from a clean slate. Your profile name and sound settings will be kept.',
      confirmText: 'Clear Workspace',
      isDestructive: true,
      onConfirm: () => {
        clearAllWorkspaceData();
        setStatusMessage({ text: 'Workspace cleared. You have a fresh blank canvas!' });
        setTimeout(() => setStatusMessage(null), 3500);
      },
    });
  };

  const handleLoadDemoData = () => {
    openConfirmModal({
      title: 'Load Demonstration Data?',
      message:
        'This will populate your workspace with sample routines, priority matrix items, and habit goals so you can explore DayGrid with example data.',
      confirmText: 'Load Demo Data',
      isDestructive: false,
      onConfirm: () => {
        loadDemoData();
        setStatusMessage({ text: 'Sample demonstration data loaded!' });
        setTimeout(() => setStatusMessage(null), 3500);
      },
    });
  };

  const initials = (name || 'DG')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1C30]">
            Settings & Personalization
          </h2>
          <p className="font-body text-xs text-[#515F74] mt-0.5">
            Configure your workspace identity, avatar colors, Web Audio synthesizers, and data backups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveBanner && (
            <div className="p-2 px-3 bg-[#E8F3EB] border border-[#A3C9AE] rounded-lg text-xs font-semibold text-[#1E5031] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-[#4A7C59]" />
              <span>Profile saved</span>
            </div>
          )}

          {statusMessage && (
            <div
              className={`p-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-in fade-in ${
                statusMessage.isError
                  ? 'bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C]'
                  : 'bg-[#E8F3EB] border border-[#A3C9AE] text-[#1E5031]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* 1. Profile Preferences Form & Custom Avatar Color Selection */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#4A7C59]" />
            <h3 className="font-display text-base font-bold text-[#0B1C30]">
              Personal Profile & Workspace Identity
            </h3>
          </div>
          <span className="text-xs text-[#64748B] font-tabular">Synced across app</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Live Avatar Preview Card */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0]">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold font-tabular shadow-sm ring-4 ring-white"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-display text-base font-bold text-[#0B1C30]">{name || 'Alex Morgan'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F3EB] text-[#1E5031] border border-[#A3C9AE]">
                  Active Avatar
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{title || 'Full-Stack Developer & Maker'}</p>
              <p className="text-[11px] text-[#4A7C59] mt-1 font-medium">
                Color applies to Header, Dashboard, Profile cards & Applet views.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAvatarColor}
              className="text-xs text-[#515F74] hover:text-[#0B1C30] px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAF9] transition-colors cursor-pointer shrink-0"
            >
              Reset to Sage Default
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] focus:outline-none focus:border-[#4A7C59]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
                Role / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer / Student"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] focus:outline-none focus:border-[#4A7C59]"
              />
            </div>
          </div>

          {/* Avatar Swatches (Compressed with Hue Family Dropdown & Expandable Full Palette) */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] font-tabular">
                  Avatar Swatches (13 Hue Families)
                </label>
                <p className="text-[11px] text-[#64748B]">
                  Select a family to pick Light, Medium, or Dark tones, or open the full palette.
                </p>
              </div>

              {/* Dropdown toggle to expand/collapse full grid */}
              <button
                type="button"
                onClick={() => setIsPaletteExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A7C59] bg-[#E8F3EB] hover:bg-[#D1E7D7] border border-[#A3C9AE] rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <span>{isPaletteExpanded ? 'Collapse Palette' : 'Browse All 13 Families'}</span>
                {isPaletteExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Compressed Dropdown Selector Card */}
            <div className="p-3.5 bg-[#FBFBFA] border border-[#E2E8F0] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Family Selector + Swatches */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase text-[#515F74] font-tabular">
                    Hue Family:
                  </span>
                  <select
                    value={selectedFamilyIdx}
                    onChange={(e) => setSelectedFamilyIdx(Number(e.target.value))}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] focus:outline-none focus:border-[#4A7C59] cursor-pointer"
                  >
                    {HUE_FAMILIES.map((family, idx) => (
                      <option key={family.name} value={idx}>
                        {family.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3 Circular Swatches for chosen family */}
                <div className="flex items-center gap-2 pl-1 border-l border-[#E2E8F0] sm:border-l sm:pl-3">
                  {HUE_FAMILIES[selectedFamilyIdx].shades.map((shade) => {
                    const isSelected = avatarColor.toLowerCase() === shade.hex.toLowerCase();
                    return (
                      <button
                        key={shade.hex}
                        type="button"
                        onClick={() => {
                          setAvatarColor(shade.hex);
                          updateProfile({ avatarColor: shade.hex });
                        }}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                          isSelected
                            ? 'scale-115 ring-2 ring-offset-2 ring-[#0B1C30] shadow-sm'
                            : 'hover:scale-110 shadow-2xs'
                        }`}
                        style={{ backgroundColor: shade.hex }}
                        title={`${shade.label} (${shade.hex})`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />}
                      </button>
                    );
                  })}
                  <span className="text-[11px] text-[#64748B] hidden sm:inline font-tabular">
                    (Light, Medium, Dark)
                  </span>
                </div>
              </div>

              {/* Custom Color Native Picker */}
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="color"
                  ref={nativeColorPickerRef}
                  value={avatarColor}
                  onChange={(e) => handleCustomColorPicked(e.target.value)}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => nativeColorPickerRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#334155] bg-white border border-[#CBD5E1] hover:border-[#4A7C59] rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  <Pipette className="w-3.5 h-3.5 text-[#4A7C59]" />
                  <span>Custom Color</span>
                </button>

                {customColors.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {customColors.map((hex) => {
                      const isSelected = avatarColor.toLowerCase() === hex.toLowerCase();
                      return (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => {
                            setAvatarColor(hex);
                            updateProfile({ avatarColor: hex });
                          }}
                          className={`w-6 h-6 rounded-full cursor-pointer transition-transform flex items-center justify-center ${
                            isSelected ? 'scale-115 ring-2 ring-offset-2 ring-[#0B1C30]' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: hex }}
                          title={`Custom: ${hex}`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white drop-shadow-sm" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Full 13-Family Grid (Visible only when expanded) */}
            {isPaletteExpanded && (
              <div className="p-4 bg-[#F8FAF9] border border-[#CBD5E1] rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between text-xs text-[#515F74] pb-2 border-b border-[#E2E8F0]">
                  <span className="font-semibold">Complete 13 Hue Families Grid</span>
                  <span className="text-[11px] text-[#64748B]">Click any tone to apply instantly</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {HUE_FAMILIES.map((family) => (
                    <div
                      key={family.name}
                      className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg space-y-1.5 shadow-2xs"
                    >
                      <span className="text-[10px] font-semibold text-[#515F74] uppercase tracking-wider font-tabular block truncate">
                        {family.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {family.shades.map((shade) => {
                          const isSelected = avatarColor.toLowerCase() === shade.hex.toLowerCase();
                          return (
                            <button
                              key={shade.hex}
                              type="button"
                              onClick={() => {
                                setAvatarColor(shade.hex);
                                updateProfile({ avatarColor: shade.hex });
                              }}
                              className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                                isSelected
                                  ? 'scale-115 ring-2 ring-offset-2 ring-[#0B1C30] shadow-sm'
                                  : 'hover:scale-110'
                              }`}
                              style={{ backgroundColor: shade.hex }}
                              title={`${shade.label} (${shade.hex})`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white drop-shadow-sm" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* 2. Expanded Sound Customization */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2 min-w-0">
            <Volume2 className="w-4 h-4 text-[#4A7C59] shrink-0" />
            <h3 className="font-display text-base font-bold text-[#0B1C30] truncate">
              Expanded Web Audio Sound Suite (Synthesized)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleResetAudioDefaults}
            className="text-xs text-[#515F74] hover:text-[#0B1C30] underline cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Reset Audio Defaults
          </button>
        </div>

        <p className="text-xs text-[#515F74] leading-relaxed">
          Zero external audio files. All alerts and chimes are dynamically synthesized via browser Web Audio API oscillated sine waves and harmonic envelopes.
        </p>

        {/* Master Controls: Mute Toggle & Volume Slider */}
        <div className="p-4 bg-[#FBFBFA] border border-[#E2E8F0] rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Master Mute Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateSettings({ isMuted: !settings.isMuted })}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer shrink-0 ${
                settings.isMuted
                  ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#B91C1C]'
                  : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAF9]'
              }`}
            >
              {settings.isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#B91C1C]" />
                  <span>Audio Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#4A7C59]" />
                  <span>Audio Active</span>
                </>
              )}
            </button>

            <span className="text-xs text-[#64748B]">
              {settings.isMuted ? 'All sounds silenced' : 'Sounds will play on events'}
            </span>
          </div>

          {/* Master Volume Slider */}
          <div className="flex items-center gap-3 w-full md:w-64 min-w-0">
            <div className="w-full space-y-1">
              <div className="flex items-center justify-between text-xs text-[#334155]">
                <span className="font-semibold uppercase tracking-wider font-tabular text-[11px]">Master Volume</span>
                <span className="font-tabular font-bold text-[#0B1C30]">{settings.soundVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.soundVolume}
                onChange={(e) => updateSettings({ soundVolume: Number(e.target.value) })}
                disabled={settings.isMuted}
                className="w-full accent-[#4A7C59] h-2 bg-[#E2E8F0] rounded-lg cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Two Sound Cards: Notification & Pomodoro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Notification Sound Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#E2E8F0] bg-white space-y-3.5 flex flex-col justify-between shadow-2xs min-w-0 overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F3EB] border border-[#A3C9AE] flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-[#4A7C59]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0B1C30] truncate">Notification Tone</h4>
                    <p className="text-[11px] text-[#64748B] truncate">8 Synthesized Options</p>
                  </div>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer shrink-0 text-xs text-[#515F74] font-medium font-tabular">
                  <span>{settings.soundEnabled ? 'Enabled' : 'Disabled'}</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#4A7C59] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Selector */}
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] font-tabular">
                  Selected Tone
                </label>
                <select
                  value={settings.notificationSound}
                  onChange={(e) => updateSettings({ notificationSound: e.target.value as NotificationSoundType })}
                  disabled={!settings.soundEnabled || settings.isMuted}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-medium focus:outline-none focus:border-[#4A7C59] disabled:opacity-50 cursor-pointer"
                >
                  {NOTIFICATION_SOUND_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current sound description */}
              <div className="p-2.5 rounded-lg bg-[#FBFBFA] border border-[#E2E8F0] text-[11px] text-[#515F74] min-h-[38px] flex items-center">
                <span>{NOTIFICATION_SOUND_OPTIONS.find((o) => o.id === settings.notificationSound)?.desc || 'Synthesized sound'}</span>
              </div>
            </div>

            {/* Test button toolbar */}
            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#94A3B8] font-tabular truncate">
                Reminders & victories
              </span>
              <button
                type="button"
                onClick={() => handlePreviewNotificationSound(settings.notificationSound)}
                disabled={!settings.soundEnabled || settings.isMuted}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#4A7C59] bg-[#E8F3EB] hover:bg-[#D1E7D7] border border-[#A3C9AE] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {/* 2. Pomodoro Sound Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#E2E8F0] bg-white space-y-3.5 flex flex-col justify-between shadow-2xs min-w-0 overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0B1C30] truncate">Pomodoro Chime</h4>
                    <p className="text-[11px] text-[#64748B] truncate">8 Focus Alarms</p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F3EB] text-[#1E5031] border border-[#A3C9AE] shrink-0 font-tabular">
                  Focus Room
                </span>
              </div>

              {/* Selector */}
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] font-tabular">
                  Completion Chime
                </label>
                <select
                  value={settings.pomodoroSound}
                  onChange={(e) => updateSettings({ pomodoroSound: e.target.value as PomodoroSoundType })}
                  disabled={settings.isMuted}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-medium focus:outline-none focus:border-[#4A7C59] disabled:opacity-50 cursor-pointer"
                >
                  {POMODORO_SOUND_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current sound description */}
              <div className="p-2.5 rounded-lg bg-[#FBFBFA] border border-[#E2E8F0] text-[11px] text-[#515F74] min-h-[38px] flex items-center">
                <span>{POMODORO_SOUND_OPTIONS.find((o) => o.id === settings.pomodoroSound)?.desc || 'Synthesized focus interval chime'}</span>
              </div>
            </div>

            {/* Test button toolbar */}
            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#94A3B8] font-tabular truncate">
                Sprint & break end
              </span>
              <button
                type="button"
                onClick={() => handlePreviewPomodoroSound(settings.pomodoroSound)}
                disabled={settings.isMuted}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#4A7C59] bg-[#E8F3EB] hover:bg-[#D1E7D7] border border-[#A3C9AE] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Working Hours & Interval Cadence */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
          <Briefcase className="w-4 h-4 text-[#4A7C59]" />
          <h3 className="font-display text-base font-bold text-[#0B1C30]">
            Working Hours & Cadence
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
              Work Start Hour
            </label>
            <select
              value={workStart}
              onChange={(e) => {
                setWorkStart(e.target.value);
                updateProfile({ workStartHour: e.target.value });
              }}
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-tabular focus:outline-none focus:border-[#4A7C59]"
            >
              {['06:00', '07:00', '08:00', '09:00', '10:00'].map((h) => (
                <option key={h} value={h}>
                  {h} AM
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
              Work End Hour
            </label>
            <select
              value={workEnd}
              onChange={(e) => {
                setWorkEnd(e.target.value);
                updateProfile({ workEndHour: e.target.value });
              }}
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-tabular focus:outline-none focus:border-[#4A7C59]"
            >
              {['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Focus Timer Durations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#F1F5F9]">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
              Focus Duration
            </label>
            <select
              value={settings.defaultFocusDuration}
              onChange={(e) => updateSettings({ defaultFocusDuration: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-tabular focus:outline-none focus:border-[#4A7C59]"
            >
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes</option>
              <option value={25}>25 Minutes (Standard)</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={50}>50 Minutes (Ultradian)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
              Short Break
            </label>
            <select
              value={settings.defaultBreakDuration}
              onChange={(e) => updateSettings({ defaultBreakDuration: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-tabular focus:outline-none focus:border-[#4A7C59]"
            >
              <option value={3}>3 Minutes</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
              Long Break
            </label>
            <select
              value={settings.defaultLongBreakDuration}
              onChange={(e) => updateSettings({ defaultLongBreakDuration: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-tabular focus:outline-none focus:border-[#4A7C59]"
            >
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>
        </div>

        {/* Auto start breaks */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#0B1C30]">Auto-Start Breaks</span>
            <p className="text-[11px] text-[#64748B]">Transition into break timers automatically.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoStartBreaks}
            onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
            className="w-4 h-4 accent-[#4A7C59] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Local Data & Storage Management */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
          <ShieldCheck className="w-4 h-4 text-[#4A7C59]" />
          <h3 className="font-display text-base font-bold text-[#0B1C30]">
            Privacy, Backups & System Resets
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-[#515F74] leading-relaxed">
            All DayGrid tasks, matrix mappings, and focus logs are stored exclusively in your browser's local storage.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F8FAF9] rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Local JSON Backup</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F8FAF9] rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#4A7C59]" />
              <span>Import Local JSON Backup</span>
            </button>

            <button
              onClick={handleClearWorkspace}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#DC2626] bg-white border border-[#FCA5A5] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Tasks (Start Blank)</span>
            </button>

            <button
              onClick={handleLoadDemoData}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#4A7C59] bg-[#E8F3EB] border border-[#A3C9AE] hover:bg-[#D1E7D7] rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Demo Sample Data</span>
            </button>

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#64748B] bg-[#F8FAF9] border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
            >
              <span>Reset to Clean Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
