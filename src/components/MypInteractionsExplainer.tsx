import React, { useState } from 'react';
import { StudyPlan } from '../types';
import {
  GitCommit,
  Smartphone,
  User,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface MypInteractionsExplainerProps {
  currentPlan?: StudyPlan;
}

export const MypInteractionsExplainer: React.FC<MypInteractionsExplainerProps> = ({
  currentPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'model' | 'interactive_shift'>('model');

  // Interactive toggle demonstration state
  const [simPhone, setSimPhone] = useState<'high' | 'low'>('high');
  const [simNoise, setSimNoise] = useState<'loud' | 'quiet'>('loud');
  const [simEnergy, setSimEnergy] = useState<'low' | 'high'>('low');

  // Calculate dynamic simulation outcome
  const calculateSimOutcome = () => {
    let focusMins = 25;
    let cognitiveLoad = 'High';
    let likelihood = 'Low (Frequent interruptions)';

    if (simPhone === 'high' && simNoise === 'loud') {
      focusMins = simEnergy === 'low' ? 12 : 15;
      cognitiveLoad = 'Severe Overload';
      likelihood = 'High distraction rate (frequent restarts)';
    } else if (simPhone === 'low' && simNoise === 'quiet') {
      focusMins = simEnergy === 'low' ? 20 : 35;
      cognitiveLoad = 'Optimized & Low';
      likelihood = 'Deep flow state sustainable';
    } else {
      focusMins = simEnergy === 'low' ? 15 : 25;
      cognitiveLoad = 'Moderate';
      likelihood = 'Steady progress with scheduled breaks';
    }

    return { focusMins, cognitiveLoad, likelihood };
  };

  const simResult = calculateSimOutcome();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Concept Header */}
      <div className="pb-6 mb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 tracking-wider uppercase mb-1">
            <GitCommit className="w-3.5 h-3.5" />
            <span>MYP Key Concept: Interactions · Lens: Technology</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How Conditions Interact to Shape Focus
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Study behaviour does not occur in isolation. It emerges from dynamic interactions between student readiness, digital technology, and physical surroundings.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('model')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'model'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            The Triad Model
          </button>
          <button
            onClick={() => setActiveTab('interactive_shift')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'interactive_shift'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive "What-If"
          </button>
        </div>
      </div>

      {activeTab === 'model' ? (
        /* The Triad Model view */
        <div className="space-y-6">
          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Student */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                1. The Student
              </h3>
              <p className="text-xs font-medium text-blue-700 mb-2">
                Internal Biological Baseline
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Energy levels, mental alertness, and emotional stamina dictate available working memory. When internal energy is depleted, the brain has less capacity to resist external temptations.
              </p>
            </div>

            {/* Pillar 2: Technology */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                2. Technology
              </h3>
              <p className="text-xs font-medium text-purple-700 mb-2">
                Digital Interruption Lens
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notifications, open messaging tabs, and algorithmically optimized apps compete for visual attention. Each notification causes an attention residue penalty that takes minutes to recover from.
              </p>
            </div>

            {/* Pillar 3: Environment */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                3. Surrounding Environment
              </h3>
              <p className="text-xs font-medium text-emerald-700 mb-2">
                Physical Sensory Context
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conversational noise, physical desk clutter, and room traffic create background cognitive friction. A structured space signals safety and focused task orientation to the nervous system.
              </p>
            </div>
          </div>

          {/* Current Session Interaction Analysis */}
          {currentPlan && (
            <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-5">
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Interaction Analysis for Your Current Plan</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {currentPlan.mypAnalysis.interactionSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-purple-200/60 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block mb-0.5">
                    Internal Factor:
                  </span>
                  <span className="text-slate-600">
                    {currentPlan.mypAnalysis.studentFactor}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block mb-0.5">
                    Technology Factor:
                  </span>
                  <span className="text-slate-600">
                    {currentPlan.mypAnalysis.techFactor}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block mb-0.5">
                    Environment Factor:
                  </span>
                  <span className="text-slate-600">
                    {currentPlan.mypAnalysis.envFactor}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Interactive "What-If" simulator */
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Experiment with the controls below to observe how modifying a single variable—such as toggling phone notifications or quietness—directly alters the recommended focus block and cognitive load.
          </p>

          {/* Interactive controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Control 1: Phone Notifications */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Technology: Phone State
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSimPhone('high')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    simPhone === 'high'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  High Alerts
                </button>
                <button
                  onClick={() => setSimPhone('low')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    simPhone === 'low'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Do Not Disturb
                </button>
              </div>
            </div>

            {/* Control 2: Environment Noise */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Environment: Noise Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSimNoise('loud')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    simNoise === 'loud'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Loud / Busy
                </button>
                <button
                  onClick={() => setSimNoise('quiet')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    simNoise === 'quiet'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Quiet Room
                </button>
              </div>
            </div>

            {/* Control 3: Student Energy */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Student: Energy Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSimEnergy('low')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    simEnergy === 'low'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Tired / Low
                </button>
                <button
                  onClick={() => setSimEnergy('high')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    simEnergy === 'high'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Alert / High
                </button>
              </div>
            </div>
          </div>

          {/* Outcome comparison card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 block mb-1">
                Interacting Result
              </span>
              <h4 className="text-lg font-bold text-white">
                Recommended Focus Interval: {simResult.focusMins} Minutes
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Cognitive State: <strong className="text-purple-300">{simResult.cognitiveLoad}</strong> · {simResult.likelihood}
              </p>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 max-w-xs">
              <span className="font-semibold text-white block mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Interactions Insight:
              </span>
              {simPhone === 'high' ? (
                <span>
                  Allowing digital alerts while already in a loud room fragments working memory, forcing shorter 12-15m survival sprints.
                </span>
              ) : (
                <span>
                  By taking control of technology (Do Not Disturb), you buffer against other environmental noises and boost sustainable study time.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
