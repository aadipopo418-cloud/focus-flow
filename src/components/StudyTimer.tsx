import React, { useState, useEffect, useRef } from 'react';
import { StudyPlan, TimerPhase } from '../types';
import { playTimerChime } from '../utils/sound';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Coffee,
  CheckCircle,
} from 'lucide-react';

interface StudyTimerProps {
  plan: StudyPlan;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ plan }) => {
  const [phase, setPhase] = useState<TimerPhase>('focus');
  const [currentSession, setCurrentSession] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCompletedAll, setIsCompletedAll] = useState<boolean>(false);

  // Time in seconds
  const focusTotalSecs = plan.focusMinutes * 60;
  const breakTotalSecs = plan.breakMinutes * 60;

  const [remainingSeconds, setRemainingSeconds] = useState<number>(focusTotalSecs);
  const [totalSecondsForPhase, setTotalSecondsForPhase] = useState<number>(focusTotalSecs);

  // When plan changes, re-initialize timer
  useEffect(() => {
    setPhase('focus');
    setCurrentSession(1);
    setIsRunning(false);
    setIsCompletedAll(false);
    const initialSecs = plan.focusMinutes * 60;
    setRemainingSeconds(initialSecs);
    setTotalSecondsForPhase(initialSecs);
  }, [plan.focusMinutes, plan.breakMinutes, plan.sessionCount, plan.subject]);

  // Audio / tick handler
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handlePhaseCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phase, currentSession, plan.sessionCount, soundEnabled]);

  const handlePhaseCompletion = () => {
    if (soundEnabled) {
      playTimerChime(phase === 'focus' ? 'focus_completed' : 'break_completed');
    }

    if (phase === 'focus') {
      if (currentSession < plan.sessionCount) {
        // Transition to break
        setPhase('break');
        const bSecs = plan.breakMinutes * 60;
        setRemainingSeconds(bSecs);
        setTotalSecondsForPhase(bSecs);
      } else {
        // All sessions finished!
        setIsRunning(false);
        setIsCompletedAll(true);
      }
    } else {
      // Transition from break to next focus session
      const nextSession = currentSession + 1;
      setCurrentSession(nextSession);
      setPhase('focus');
      const fSecs = plan.focusMinutes * 60;
      setRemainingSeconds(fSecs);
      setTotalSecondsForPhase(fSecs);
    }
  };

  // Timer controls
  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const resetSecs = phase === 'focus' ? plan.focusMinutes * 60 : plan.breakMinutes * 60;
    setRemainingSeconds(resetSecs);
    setTotalSecondsForPhase(resetSecs);
  };

  const handleSkip = () => {
    setIsRunning(false);
    handlePhaseCompletion();
  };

  const handleAdjustTime = (deltaMinutes: number) => {
    setRemainingSeconds((prev) => {
      const next = prev + deltaMinutes * 60;
      return next > 0 ? next : 30; // minimum 30 seconds
    });
    setTotalSecondsForPhase((prev) => {
      const next = prev + deltaMinutes * 60;
      return next > 0 ? next : 30;
    });
  };

  const handleRestartFullPlan = () => {
    setPhase('focus');
    setCurrentSession(1);
    setIsRunning(false);
    setIsCompletedAll(false);
    const initialSecs = plan.focusMinutes * 60;
    setRemainingSeconds(initialSecs);
    setTotalSecondsForPhase(initialSecs);
  };

  // Format time MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage
  const progressRatio = totalSecondsForPhase > 0 ? (totalSecondsForPhase - remainingSeconds) / totalSecondsForPhase : 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Timer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 tracking-wider uppercase mb-1">
            <span>Functional Study Timer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{plan.subject}</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Session {currentSession} of {plan.sessionCount}</span>
            <span aria-hidden="true">·</span>
            <span>Target: {phase === 'focus' ? `${plan.focusMinutes}m focus` : `${plan.breakMinutes}m break`}</span>
          </div>
        </div>

        {/* Sound toggle & test */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playTimerChime('break_completed');
            }}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'border-slate-200 text-slate-400 bg-slate-50'
            }`}
            title={soundEnabled ? 'Sound alerts active' : 'Sound alerts muted'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">Chime On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Chime Muted</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isCompletedAll ? (
        /* Completion View */
        <div className="py-12 px-4 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Study Plan Completed!
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            You completed {plan.sessionCount} focus session{plan.sessionCount > 1 ? 's' : ''} for{' '}
            <strong className="text-slate-800">{plan.subject}</strong> ({plan.effectiveStudyMinutes} minutes of focused study).
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestartFullPlan}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Repeat This Plan
            </button>
          </div>
        </div>
      ) : (
        /* Active Timer View */
        <div className="flex flex-col items-center">
          {/* Phase Badge */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                phase === 'focus'
                  ? 'bg-purple-100 text-purple-900'
                  : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {phase === 'focus' ? (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-purple-700" />
                  FOCUS SESSION ({currentSession}/{plan.sessionCount})
                </>
              ) : (
                <>
                  <Coffee className="w-3.5 h-3.5 text-emerald-700" />
                  REST BREAK ({currentSession}/{plan.sessionCount})
                </>
              )}
            </span>
          </div>

          {/* Big Digital Countdown */}
          <div className="relative my-4 flex flex-col items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-slate-100"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className={`transition-all duration-500 ease-linear ${
                    phase === 'focus' ? 'stroke-purple-600' : 'stroke-emerald-600'
                  }`}
                  strokeWidth="5"
                  strokeDasharray={276.46}
                  strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Centered digits */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                  {formattedTime}
                </span>
                <span className="text-xs font-medium text-slate-500 mt-2">
                  {phase === 'focus' ? 'Stay locked in' : 'Step away & breathe'}
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums mt-0.5">
                  {progressPercent}% elapsed
                </span>
              </div>
            </div>
          </div>

          {/* Quick Adjustment Controls (+1m / -1m) */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => handleAdjustTime(-1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              title="Decrease by 1 minute"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-400 font-medium">Fine-tune time</span>
            <button
              onClick={() => handleAdjustTime(1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              title="Increase by 1 minute"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Timer Controls */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            {/* Start / Pause / Resume */}
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{remainingSeconds < totalSecondsForPhase ? 'Resume Timer' : 'Start Timer'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Timer</span>
              </button>
            )}

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              title="Reset current interval"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset</span>
            </button>

            {/* Skip phase */}
            <button
              onClick={handleSkip}
              className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              title={phase === 'focus' ? 'Skip to break' : 'Skip to next focus session'}
            >
              <SkipForward className="w-4 h-4 text-slate-500" />
              <span>{phase === 'focus' ? 'Skip to Break' : 'Skip to Next'}</span>
            </button>
          </div>

          {/* Session Progress Indicators */}
          <div className="w-full max-w-md mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-medium">Session Progression</span>
              <span>
                {currentSession} of {plan.sessionCount} Completed
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Array.from({ length: plan.sessionCount }).map((_, idx) => {
                const sessionNum = idx + 1;
                const isPast = sessionNum < currentSession || isCompletedAll;
                const isCurrent = sessionNum === currentSession && !isCompletedAll;

                return (
                  <div
                    key={sessionNum}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isPast
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : isCurrent
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-1 ring-purple-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wider font-semibold">
                      Block {sessionNum}
                    </span>
                    <span className="block text-[11px] font-normal mt-0.5">
                      {isPast ? 'Done' : isCurrent ? (phase === 'focus' ? 'In Focus' : 'In Break') : 'Upcoming'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
