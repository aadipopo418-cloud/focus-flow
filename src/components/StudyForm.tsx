import React from 'react';
import {
  AvailableTime,
  EnergyLevel,
  EnvironmentQuality,
  FocusLevel,
  NoiseLevel,
  NotificationLevel,
  UserStudyInputs,
} from '../types';
import {
  Clock,
  BellRing,
  Volume2,
  Zap,
  Target,
  Home,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface StudyFormProps {
  inputs: UserStudyInputs;
  onChange: (inputs: UserStudyInputs) => void;
  onSubmit: () => void;
  onApplyPreset: (presetKey: string) => void;
}

const COMMON_SUBJECTS = [
  'Mathematics Problem Set',
  'Biology Revision',
  'History Essay Outline',
  'Physics Lab Report',
  'Literature Analysis',
  'French / Spanish Practice',
  'Exam Past Paper',
];

export const StudyForm: React.FC<StudyFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  onApplyPreset,
}) => {
  const updateField = <K extends keyof UserStudyInputs>(
    key: K,
    value: UserStudyInputs[K]
  ) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  const timeOptions: AvailableTime[] = [15, 30, 45, 60, 90];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Header of Form */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            1. Configure Your Study Context
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Answer 7 quick questions about your task, device, energy, and surroundings.
          </p>
        </div>

        {/* Quick Scenario Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => onApplyPreset('tired_distracted')}
            className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            Tired & Distracted
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('quiet_deep_work')}
            className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            Quiet Deep Work
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('quick_rush')}
            className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 rounded-md transition-colors cursor-pointer"
          >
            15-Min Rush
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-7"
      >
        {/* Input 1: Subject Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            What are you studying?
          </label>
          <input
            type="text"
            value={inputs.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            placeholder="e.g., Mathematics Trigonometry, History Essay, Biology Cells..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all text-sm"
            required
          />
          {/* Quick Suggestions */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Quick pick:</span>
            {COMMON_SUBJECTS.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => updateField('subject', sub)}
                className="text-xs px-2 py-0.5 rounded border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 hover:text-purple-900 transition-colors cursor-pointer"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Input 2: Available Time */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            How much time do you have?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {timeOptions.map((time) => {
              const isSelected = inputs.availableTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => updateField('availableTime', time)}
                  className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-semibold shadow-xs ring-1 ring-purple-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="block text-lg font-bold tabular-nums">
                    {time}
                  </span>
                  <span className="block text-xs text-slate-500 font-normal">
                    minutes
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid for Environmental & Technology Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          {/* Input 3: Phone Notifications */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-1">
              <BellRing className="w-4 h-4 text-purple-600" />
              Phone notifications
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              Frequency of buzzes, alerts, and group chats
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as NotificationLevel[]).map((level) => {
                const isSelected = inputs.phoneNotifications === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField('phoneNotifications', level)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium capitalize transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-1 ring-purple-500/20 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {level === 'low' && 'Low (Silent)'}
                    {level === 'medium' && 'Medium (Some)'}
                    {level === 'high' && 'High (Buzzing)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input 4: Noise Level */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-1">
              <Volume2 className="w-4 h-4 text-purple-600" />
              Noise level
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              Sound in your study location right now
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['quiet', 'moderate', 'loud'] as NoiseLevel[]).map((level) => {
                const isSelected = inputs.noiseLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField('noiseLevel', level)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium capitalize transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-1 ring-purple-500/20 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {level === 'quiet' && 'Quiet'}
                    {level === 'moderate' && 'Moderate'}
                    {level === 'loud' && 'Loud'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input 5: Energy Level */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-1">
              <Zap className="w-4 h-4 text-purple-600" />
              Energy level
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              Physical and mental alertness
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => {
                const isSelected = inputs.energyLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField('energyLevel', level)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium capitalize transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-1 ring-purple-500/20 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {level === 'low' && 'Low (Tired)'}
                    {level === 'medium' && 'Medium (Okay)'}
                    {level === 'high' && 'High (Alert)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input 6: Current Focus */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-1">
              <Target className="w-4 h-4 text-purple-600" />
              Current focus
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              How easily your mind wanders right now
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: 'focused', label: 'Focused' },
                  { key: 'somewhat', label: 'Somewhat' },
                  { key: 'distracted', label: 'Very Distracted' },
                ] as { key: FocusLevel; label: string }[]
              ).map(({ key, label }) => {
                const isSelected = inputs.currentFocus === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateField('currentFocus', key)}
                    className={`py-2.5 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-1 ring-purple-500/20 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Input 7: Study Environment */}
        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-1">
            <Home className="w-4 h-4 text-purple-600" />
            Study environment
          </label>
          <p className="text-xs text-slate-500 mb-2.5">
            Physical comfort and visual distractions in the room
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(
              [
                {
                  key: 'comfortable',
                  label: 'Comfortable',
                  sub: 'Desk, tidy, calm space',
                },
                {
                  key: 'some_distractions',
                  label: 'Some Distractions',
                  sub: 'People passing by or clutter',
                },
                {
                  key: 'very_distracting',
                  label: 'Very Distracting',
                  sub: 'Chaotic, crowded, or noisy',
                },
              ] as {
                key: EnvironmentQuality;
                label: string;
                sub: string;
              }[]
            ).map(({ key, label, sub }) => {
              const isSelected = inputs.studyEnvironment === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => updateField('studyEnvironment', key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 text-purple-950 ring-1 ring-purple-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">{sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Create My Study Plan */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onApplyPreset('default')}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer order-2 sm:order-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all inputs to default
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
          >
            <span>Create My Study Plan</span>
            <ArrowRight className="w-4 h-4 text-purple-300" />
          </button>
        </div>
      </form>
    </div>
  );
};
