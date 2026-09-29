import React, { useState, useRef } from 'react';
import { UserStudyInputs, StudyPlan } from './types';
import { calculateStudyPlan } from './utils/studyPlanner';
import { Navbar } from './components/Navbar';
import { StudyForm } from './components/StudyForm';
import { StudyPlanDisplay } from './components/StudyPlanDisplay';
import { StudyTimer } from './components/StudyTimer';
import { MypInteractionsExplainer } from './components/MypInteractionsExplainer';
import {
  Sparkles,
  Timer,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const DEFAULT_INPUTS: UserStudyInputs = {
  subject: 'Mathematics Revision',
  availableTime: 45,
  phoneNotifications: 'medium',
  noiseLevel: 'moderate',
  energyLevel: 'medium',
  currentFocus: 'somewhat',
  studyEnvironment: 'comfortable',
};

export default function App() {
  const [inputs, setInputs] = useState<UserStudyInputs>(DEFAULT_INPUTS);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() =>
    calculateStudyPlan(DEFAULT_INPUTS)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Section references for smooth scrolling
  const plannerRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const mypRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleScrollToSection = (sectionId: string) => {
    let targetRef: React.RefObject<HTMLDivElement | null> | null = null;
    if (sectionId === 'planner-section') targetRef = plannerRef;
    if (sectionId === 'plan-section') targetRef = planRef;
    if (sectionId === 'timer-section') targetRef = timerRef;
    if (sectionId === 'myp-section') targetRef = mypRef;

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCreatePlan = () => {
    const newPlan = calculateStudyPlan(inputs);
    setStudyPlan(newPlan);
    showToast('Personalised study plan created!');

    // Smoothly scroll down to the plan card
    setTimeout(() => {
      planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleStartTimer = () => {
    showToast('Plan loaded into timer! Press Start when ready.');
    setTimeout(() => {
      timerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleApplyPreset = (presetKey: string) => {
    let preset: UserStudyInputs;
    if (presetKey === 'tired_distracted') {
      preset = {
        subject: 'Physics Problem Set',
        availableTime: 30,
        phoneNotifications: 'high',
        noiseLevel: 'moderate',
        energyLevel: 'low',
        currentFocus: 'distracted',
        studyEnvironment: 'some_distractions',
      };
    } else if (presetKey === 'quiet_deep_work') {
      preset = {
        subject: 'History Research Essay',
        availableTime: 60,
        phoneNotifications: 'low',
        noiseLevel: 'quiet',
        energyLevel: 'high',
        currentFocus: 'focused',
        studyEnvironment: 'comfortable',
      };
    } else if (presetKey === 'quick_rush') {
      preset = {
        subject: 'Biology Vocab Flashcards',
        availableTime: 15,
        phoneNotifications: 'low',
        noiseLevel: 'quiet',
        energyLevel: 'medium',
        currentFocus: 'focused',
        studyEnvironment: 'comfortable',
      };
    } else {
      preset = DEFAULT_INPUTS;
    }

    setInputs(preset);
    const newPlan = calculateStudyPlan(preset);
    setStudyPlan(newPlan);
    showToast(`Applied preset: ${presetKey.replace('_', ' ')}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Top Bar Navigation */}
      <Navbar
        onScrollToSection={handleScrollToSection}
        hasActivePlan={Boolean(studyPlan)}
        timerActive={false}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 text-purple-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Smart Environmental Study Calibration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            FocusFlow
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Calibrate your study blocks based on your real energy, noise levels, phone alerts, and available time.
          </p>

          {/* Quick Stats or Metadata */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
            <span>Adaptive Timer Cadence</span>
            <span aria-hidden="true">·</span>
            <span>Transparent Rules</span>
            <span aria-hidden="true">·</span>
            <span>Zero Sign-In Required</span>
          </div>
        </section>

        {/* Section 1: User Inputs Form */}
        <section id="planner" ref={plannerRef} className="scroll-mt-20">
          <StudyForm
            inputs={inputs}
            onChange={(newInputs) => {
              setInputs(newInputs);
            }}
            onSubmit={handleCreatePlan}
            onApplyPreset={handleApplyPreset}
          />
        </section>

        {/* Section 2: Personalised Study Plan */}
        <section id="plan" ref={planRef} className="scroll-mt-20">
          <StudyPlanDisplay plan={studyPlan} onStartTimer={handleStartTimer} />
        </section>

        {/* Section 3: Functional Study Timer */}
        <section id="timer" ref={timerRef} className="scroll-mt-20">
          <StudyTimer plan={studyPlan} />
        </section>

        {/* Section 4: MYP Interactions Concept Lens */}
        <section id="interactions" ref={mypRef} className="scroll-mt-20">
          <MypInteractionsExplainer currentPlan={studyPlan} />
        </section>

        {/* Practical Study Guidelines & Methodology */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <span>Principles of Adaptive Study Planning</span>
          </h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Standard study advice often repeats a fixed 25-minute Pomodoro regardless of whether you are exhausted or bursting with energy. FocusFlow operates on cognitive reality:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-1">
                The Low-Hurdle Rule
              </span>
              <p className="text-slate-600 leading-relaxed">
                When distractions or fatigue are high, a 25-minute timer feels intimidating, prompting procrastination. A 12–15 minute sprint lowers the resistance to start. Once in motion, focus sustains itself.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-1">
                Attention Residue & Technology
              </span>
              <p className="text-slate-600 leading-relaxed">
                Glancing at a phone notification leaves an "attention residue" in working memory for up to 10 minutes. Placing your device out of sight is 3x more effective than merely keeping it on silent.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">FocusFlow</span>
            <span>— Your Personal Study Planner</span>
          </div>

          <div className="flex items-center gap-4">
            <span>MYP Key Concept: Interactions</span>
            <span aria-hidden="true">·</span>
            <span>Lens: Technology</span>
          </div>

          <p className="text-slate-400">
            All calculations run locally in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
