import {
  AvailableTime,
  EnergyLevel,
  EnvironmentQuality,
  FocusLevel,
  NoiseLevel,
  NotificationLevel,
  RecommendationItem,
  StudyPlan,
  UserStudyInputs,
} from '../types';

export function calculateStudyPlan(inputs: UserStudyInputs): StudyPlan {
  const {
    subject,
    availableTime,
    phoneNotifications,
    noiseLevel,
    energyLevel,
    currentFocus,
    studyEnvironment,
  } = inputs;

  const cleanSubject = subject.trim() || 'General Study';

  // 1. Calculate Friction and Focus Readiness Scores
  // Cognitive friction from environment & technology (0 to 6)
  let frictionScore = 0;
  if (phoneNotifications === 'high') frictionScore += 2;
  else if (phoneNotifications === 'medium') frictionScore += 1;

  if (noiseLevel === 'loud') frictionScore += 2;
  else if (noiseLevel === 'moderate') frictionScore += 1;

  if (studyEnvironment === 'very_distracting') frictionScore += 2;
  else if (studyEnvironment === 'some_distractions') frictionScore += 1;

  // Student readiness score (0 to 4)
  let readinessScore = 0;
  if (energyLevel === 'high') readinessScore += 2;
  else if (energyLevel === 'medium') readinessScore += 1;

  if (currentFocus === 'focused') readinessScore += 2;
  else if (currentFocus === 'somewhat') readinessScore += 1;

  // 2. Determine Optimal Focus Interval & Session Distribution
  // Rules tailored sensibly based on availableTime, friction, and readiness
  let focusMinutes = 25;
  let breakMinutes = 5;
  let sessionCount = 1;

  switch (availableTime) {
    case 15:
      // Single compact sprint
      focusMinutes = 12;
      breakMinutes = 3;
      sessionCount = 1;
      break;

    case 30:
      if (readinessScore <= 1 || frictionScore >= 4) {
        // High friction or low readiness: 2 short 12-min sprints with 3m break
        focusMinutes = 12;
        breakMinutes = 4;
        sessionCount = 2;
      } else {
        // 1 solid 25-minute Pomodoro with 5-minute wrap-up
        focusMinutes = 25;
        breakMinutes = 5;
        sessionCount = 1;
      }
      break;

    case 45:
      if (readinessScore <= 1 || frictionScore >= 4) {
        // 2 manageable 18-minute blocks with 5-minute break
        focusMinutes = 18;
        breakMinutes = 5;
        sessionCount = 2;
      } else if (readinessScore >= 3 && frictionScore <= 1) {
        // High focus in quiet space: single deep 35-minute block
        focusMinutes = 35;
        breakMinutes = 5;
        sessionCount = 1;
      } else {
        // Balanced 2 x 20-minute sessions
        focusMinutes = 20;
        breakMinutes = 5;
        sessionCount = 2;
      }
      break;

    case 60:
      if (readinessScore <= 1 || frictionScore >= 5) {
        // Shorter 15-minute bursts to overcome low energy / high distractions
        focusMinutes = 15;
        breakMinutes = 5;
        sessionCount = 3; // (15+5)*2 + 15 = 55m
      } else if (readinessScore >= 3 && frictionScore <= 1) {
        // Flow state potential: 2 longer sessions of 25m or 1 deep 45m block
        focusMinutes = 25;
        breakMinutes = 8;
        sessionCount = 2;
      } else {
        // Classic Pomodoro: 2 x 25-minute sessions with 5-minute break
        focusMinutes = 25;
        breakMinutes = 5;
        sessionCount = 2;
      }
      break;

    case 90:
      if (readinessScore <= 1 || frictionScore >= 4) {
        // Multiple shorter 20-minute sessions prevent burnout
        focusMinutes = 20;
        breakMinutes = 5;
        sessionCount = 3; // (20+5)*3 = 75m or 4 sessions
      } else if (readinessScore >= 3 && frictionScore <= 1) {
        // High stamina deep work: 2 x 40m sessions with 10m break
        focusMinutes = 40;
        breakMinutes = 10;
        sessionCount = 2;
      } else {
        // Standard triple Pomodoro
        focusMinutes = 25;
        breakMinutes = 5;
        sessionCount = 3;
      }
      break;
  }

  const effectiveStudyMinutes = focusMinutes * sessionCount;
  const totalBreakMinutes = breakMinutes * Math.max(0, sessionCount - 1);

  // 3. Assemble Practical Recommendations
  const recPool: RecommendationItem[] = [];

  // Technology-related recommendations
  if (phoneNotifications === 'high') {
    recPool.push({
      id: 'tech-dnd',
      category: 'technology',
      title: 'Eliminate Digital Alerts',
      action: 'Turn on "Do Not Disturb" mode immediately and place your phone screen-down in another room or out of arm\'s reach.',
    });
  } else if (phoneNotifications === 'medium') {
    recPool.push({
      id: 'tech-mute',
      category: 'technology',
      title: 'Silence Group Chats',
      action: 'Mute non-essential chat groups and disable desktop notifications so incoming messages do not break working memory.',
    });
  } else {
    recPool.push({
      id: 'tech-single-tab',
      category: 'technology',
      title: 'Full-Screen Focus',
      action: 'Close unused browser tabs and switch your study window to full-screen mode to remove visual digital clutter.',
    });
  }

  // Environment-related recommendations
  if (noiseLevel === 'loud') {
    recPool.push({
      id: 'env-noise-canceling',
      category: 'environment',
      title: 'Neutralize Ambient Noise',
      action: 'Put on noise-canceling headphones, play continuous brown noise/rain sounds, or use earplugs to block conversational sounds.',
    });
  } else if (noiseLevel === 'moderate') {
    recPool.push({
      id: 'env-ambient-sound',
      category: 'environment',
      title: 'Steady Auditory Backdrop',
      action: 'Stick to steady instrumental or lo-fi audio without lyrics, which prevents unpredictable sound spikes from derailing concentration.',
    });
  } else {
    recPool.push({
      id: 'env-quiet-leverage',
      category: 'environment',
      title: 'Protect the Quiet Zone',
      action: 'Take advantage of your quiet space by spreading your physical materials out logically so you do not need to pause and search.',
    });
  }

  if (studyEnvironment === 'very_distracting') {
    recPool.push({
      id: 'env-desk-clean',
      category: 'environment',
      title: 'Visual Perimeter Reset',
      action: 'Turn your chair away from door or hallway movement and clear your desk of everything except the materials needed for this exact task.',
    });
  } else if (studyEnvironment === 'some_distractions') {
    recPool.push({
      id: 'env-posture',
      category: 'environment',
      title: 'Anchor Your Workspace',
      action: 'Sit upright at a table rather than on a bed or couch to signal physical focus and prevent posture-induced fatigue.',
    });
  }

  // Student-related recommendations
  if (energyLevel === 'low') {
    recPool.push({
      id: 'student-micro-goal',
      category: 'student',
      title: 'Scope Down to One Micro-Task',
      action: 'Do not aim to finish the entire topic right now. Select one concrete sub-goal (e.g. 3 practice questions or 1 page summary).',
    });
    recPool.push({
      id: 'student-hydration',
      category: 'student',
      title: 'Physical Energy Boost',
      action: 'Drink a glass of cold water and stretch your shoulders for 30 seconds before hitting Start to increase blood circulation.',
    });
  } else if (energyLevel === 'high') {
    recPool.push({
      id: 'student-active-recall',
      category: 'student',
      title: 'Prioritize Active Recall',
      action: 'Channel your high energy into active problem solving or practice testing rather than passive rereading or highlighting.',
    });
  }

  if (currentFocus === 'distracted') {
    recPool.push({
      id: 'student-low-hurdle',
      category: 'student',
      title: 'Use the 5-Minute Entry Rule',
      action: 'Commit only to working on the first sentence or problem for 5 minutes. Momentum builds naturally once you cross the start threshold.',
    });
    recPool.push({
      id: 'student-distraction-pad',
      category: 'student',
      title: 'Keep a "Brain Dump" Scrap Paper',
      action: 'Place a blank scrap paper beside your keyboard. When an unrelated thought occurs, jot it down in 3 words and return to your study immediately.',
    });
  } else if (currentFocus === 'somewhat') {
    recPool.push({
      id: 'student-checkpoint',
      category: 'student',
      title: 'Define Session Checkpoints',
      action: 'Write down on paper exactly what "done" looks like for session 1 before starting the timer.',
    });
  }

  // Pick top 3 balanced recommendations (ensure at least 1 tech/env and 1 student if possible)
  const prioritizedRecs: RecommendationItem[] = [];
  const techRec = recPool.find((r) => r.category === 'technology');
  const envRec = recPool.find((r) => r.category === 'environment');
  const studentRec = recPool.find((r) => r.category === 'student');

  if (techRec) prioritizedRecs.push(techRec);
  if (envRec && !prioritizedRecs.some((r) => r.id === envRec.id)) prioritizedRecs.push(envRec);
  if (studentRec && !prioritizedRecs.some((r) => r.id === studentRec.id)) prioritizedRecs.push(studentRec);

  // Fill up to 3 if needed
  for (const item of recPool) {
    if (prioritizedRecs.length >= 3) break;
    if (!prioritizedRecs.some((r) => r.id === item.id)) {
      prioritizedRecs.push(item);
    }
  }

  // 4. Generate Clear, Transparent Explanation
  let explanation = '';

  if (availableTime === 15) {
    explanation = `With 15 minutes available, we designed a quick, focused ${focusMinutes}-minute single sprint with a ${breakMinutes}-minute buffer. This prevents spending valuable time transitioning and maximizes your brief window.`;
  } else if (energyLevel === 'low' || currentFocus === 'distracted') {
    explanation = `Because your current energy is ${energyLevel} and your focus is ${currentFocus === 'distracted' ? 'scattered' : 'somewhat distracted'}, demanding a long 45-minute block would cause rapid mental exhaustion. Instead, we scheduled ${sessionCount} bite-sized ${focusMinutes}-minute focus intervals with ${breakMinutes}-minute restorative breaks to lower the psychological barrier to starting.`;
  } else if (frictionScore >= 4) {
    explanation = `Your current environment presents notable friction (${noiseLevel} noise, ${phoneNotifications} notification volume, and ${studyEnvironment.replace('_', ' ')}). To safeguard your focus against frequent interruptions, we divided your ${availableTime} minutes into ${sessionCount} resilient ${focusMinutes}-minute sessions with ${breakMinutes}-minute resets.`;
  } else if (readinessScore >= 3 && frictionScore <= 1) {
    explanation = `You have high mental readiness in a quiet, low-distraction space. This plan leverages your prime focus window with an extended ${focusMinutes}-minute session cadence so you can enter a productive flow state without unnecessary interruptions.`;
  } else {
    explanation = `This balanced plan splits your ${availableTime} minutes into ${sessionCount} steady ${focusMinutes}-minute sessions and ${breakMinutes}-minute breaks. This steady cadence keeps cognitive fatigue low while maintaining solid momentum on ${cleanSubject}.`;
  }

  // 5. MYP Connection: Interactions through Technology Lens
  const studentFactor = `Internal Student State: ${energyLevel.toUpperCase()} energy and ${currentFocus === 'distracted' ? 'distracted' : currentFocus} focus define your cognitive starting baseline.`;
  const techFactor = `Technological Friction: ${phoneNotifications.toUpperCase()} phone notifications represent digital stimuli competing with task memory.`;
  const envFactor = `Physical Environment: ${noiseLevel.toUpperCase()} noise and ${studyEnvironment.replace('_', ' ')} space determine external distraction frequency.`;
  const interactionSummary = `When technology alerts (${phoneNotifications}) interact with ${noiseLevel} physical noise and ${energyLevel} student energy, total cognitive load increases. By adjusting your study interval to ${focusMinutes} minutes and silencing digital technology, you transform this interaction into a structured, sustainable focus loop.`;

  return {
    subject: cleanSubject,
    totalAvailableMinutes: availableTime,
    focusMinutes,
    breakMinutes,
    sessionCount,
    effectiveStudyMinutes,
    totalBreakMinutes,
    recommendations: prioritizedRecs.slice(0, 3),
    explanation,
    mypAnalysis: {
      studentFactor,
      techFactor,
      envFactor,
      interactionSummary,
    },
  };
}
