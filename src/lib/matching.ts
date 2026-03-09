export interface AdvisorProfile {
  id: string;
  name: string;
  credentials: string;
  sebiNumber: string;
  bio: string;
  specializations: string[];
  lifeStages: string[];
  workingStyle: string[];
  incomeRange: string[];
  languages: string[];
  yearsExperience: number;
  city: string;
  rating: number;
  responseTimeHours: number;
  tags: string[];
  avatarInitials: string;
  avatarColor: string;
}

export interface UserAnswers {
  situation: string;
  moneyLocation: string;
  topGoal: string;
  employmentType: string;
  incomeRange: string;
  monthlySurplus: string;
  currentInvestments: string;
  workingStyle: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
}

export interface MatchResult {
  advisor: AdvisorProfile;
  matchScore: number;
  matchReasons: string[];
  allMatches: Array<{ advisor: AdvisorProfile; score: number }>;
}

export function computeMatchScore(advisor: AdvisorProfile, answers: UserAnswers): number {
  let score = 0;

  const goalToSpecMap: Record<string, string[]> = {
    investment_plan: ['investment_strategy', 'mutual_fund_review'],
    tax_reduction: ['tax_planning'],
    retirement: ['retirement_planning'],
    insurance: ['insurance_review'],
    major_goal: ['goal_planning'],
    nri: ['nri_planning'],
    second_opinion: ['second_opinion', 'mutual_fund_review'],
    debt: ['debt_management'],
  };
  const relevantSpecs = goalToSpecMap[answers.topGoal] || [];
  const specOverlap = relevantSpecs.filter((s) => advisor.specializations.includes(s)).length;
  score += Math.min(35, specOverlap * 20);

  const situationToStageMap: Record<string, string[]> = {
    new_earner: ['early_career'],
    confused_investor: ['early_career', 'mid_career'],
    big_decision: ['mid_career', 'business_owner'],
    retirement_planning: ['mid_career', 'pre_retirement'],
  };
  const userStages = situationToStageMap[answers.situation] || [];
  const stageOverlap = userStages.filter((s) => advisor.lifeStages.includes(s)).length;
  score += Math.min(25, stageOverlap * 15);

  const styleMap: Record<string, string> = {
    single_session: 'single_session',
    ongoing: 'ongoing',
    explore: 'flexible',
  };
  const userStyle = styleMap[answers.workingStyle];
  if (userStyle && advisor.workingStyle.includes(userStyle)) score += 20;
  else if (advisor.workingStyle.includes('flexible')) score += 10;

  if (advisor.incomeRange.includes(answers.incomeRange)) score += 10;
  else if (advisor.incomeRange.length === 0) score += 5;

  if (answers.moneyLocation === 'foreign_nri' && advisor.specializations.includes('nri_planning')) {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}

export function generateMatchReasons(
  advisor: AdvisorProfile,
  answers: UserAnswers,
): string[] {
  const reasons: string[] = [];

  const goalLabels: Record<string, string> = {
    investment_plan: 'building investment plans',
    tax_reduction: 'tax optimisation',
    retirement: 'retirement planning',
    insurance: 'insurance review',
    major_goal: 'goal-based planning',
    nri: 'NRI financial planning',
    second_opinion: 'portfolio review',
    debt: 'debt management',
  };

  const situationLabels: Record<string, string> = {
    new_earner: 'early-career professionals',
    confused_investor: 'investors without a structured plan',
    big_decision: 'professionals at financial crossroads',
    retirement_planning: 'pre-retirement planning',
  };

  if (goalLabels[answers.topGoal]) {
    reasons.push(`Specialises in ${goalLabels[answers.topGoal]}`);
  }
  if (situationLabels[answers.situation]) {
    reasons.push(`Has experience with ${situationLabels[answers.situation]}`);
  }
  if (answers.workingStyle === 'single_session' && advisor.workingStyle.includes('single_session')) {
    reasons.push('Working style matches your preference');
  } else if (answers.workingStyle === 'ongoing' && advisor.workingStyle.includes('ongoing')) {
    reasons.push('Offers the ongoing check-in style you prefer');
  }
  reasons.push('SEBI registered \u00b7 Fee-only \u00b7 No commissions');

  return reasons.slice(0, 4);
}

export function runMatchingAlgorithm(
  answers: UserAnswers,
  advisors: AdvisorProfile[],
): MatchResult {
  const scored = advisors
    .map((advisor) => ({
      advisor,
      score: computeMatchScore(advisor, answers),
    }))
    .sort((a, b) => b.score - a.score);

  const top = scored[0];
  const matchReasons = generateMatchReasons(top.advisor, answers);

  return {
    advisor: top.advisor,
    matchScore: top.score,
    matchReasons,
    allMatches: scored,
  };
}
