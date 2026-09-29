import React from 'react';
import { StudyPlan } from '../types';
import {
  Clock,
  Coffee,
  Layers,
  Sparkles,
  Play,
  Lightbulb,
  CheckCircle2,
  Smartphone,
  MapPin,
  User,
} from 'lucide-react';

interface StudyPlanDisplayProps {
  plan: StudyPlan;
  onStartTimer: () => void;
}

export const StudyPlanDisplay: React.FC<StudyPlanDisplayProps> = ({
  plan,
  onStartTimer,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Plan Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalised Recommendation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Study Plan for {plan.subject}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>{plan.totalAvailableMinutes} min available</span>
            <span aria-hidden="true">·</span>
            <span>{plan.effectiveStudyMinutes} min focused work</span>
            <span aria-hidden="true">·</span>
            <span>{plan.totalBreakMinutes} min rest</span>
          </div>
        </div>

        <button
          onClick={onStartTimer}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Load Plan into Timer</span>
        </button>
      </div>

      {/* Recommended Session Cadence - 3 Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Metric 1: Focus Duration */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Focus Duration
            </span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {plan.focusMinutes}
            </span>
            <span className="text-sm font-medium text-slate-600">min / session</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calibrated to your energy & distraction baseline
          </p>
        </div>

        {/* Metric 2: Short Break */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Short Break
            </span>
            <Coffee className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {plan.breakMinutes}
            </span>
            <span className="text-sm font-medium text-slate-600">min rest</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sufficient mental reset between intervals
          </p>
        </div>

        {/* Metric 3: Number of Sessions */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Planned Cycles
            </span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {plan.sessionCount}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {plan.sessionCount === 1 ? 'focus block' : 'focus blocks'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured cleanly within your available time
          </p>
        </div>
      </div>

      {/* Why this plan suits your current situation */}
      <div className="bg-purple-50/50 border border-purple-200/80 rounded-xl p-4 sm:p-5 mb-7">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-purple-600/10 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Why this plan fits your current context:
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {plan.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Practical Recommendations (3 cards) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            3 Practical Actions for This Session
          </h3>
          <span className="text-xs text-slate-500">
            Based on your environment & digital friction
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {plan.recommendations.map((rec, index) => {
            const isTech = rec.category === 'technology';
            const isEnv = rec.category === 'environment';

            return (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-purple-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-600 flex items-center gap-1.5">
                      {isTech ? (
                        <Smartphone className="w-3.5 h-3.5" />
                      ) : isEnv ? (
                        <MapPin className="w-3.5 h-3.5" />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                      <span className="capitalize">{rec.category} Focus</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      #{index + 1}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rec.action}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Actionable step</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
