import { ALL_VIOLATIONS, Violation, AnalysisResult } from '../data/statutes.js'

const KEYWORDS: Record<string, string[]> = {
  FDCPA: ['debt collector', 'collection', 'creditor', 'owe', 'debt', 'payment plan', 'collection notice', 'past due', 'balance', 'account', 'garnishment', 'lawsuit', 'attorney'],
  FCRA: ['credit report', 'rating', 'equifax', 'experian', 'transunion', 'tradeline', 'FICO', 'credit score', 'credit monitoring', 'identity theft', 'fraud alert', 'ein', 'personal information'],
  '1692g': ['validation', '30 days', 'written notice', 'dispute within 30', 'six years', 'verification'],
  '1692e': ['misrepresent', 'late fee', 'interest rate', 'balance', 'amount', 'fake', 'false', 'deceptive', 'wrong amount'],
  '1692d': ['harass', 'abuse', 'threat', 'oppressive', 'harassment', 'threatened', 'cease', 'desist'],
  '1692c': ['cease communication', 'stop calling', 'do not call', 'written request', 'refuse to pay'],
  '1681e': ['accuracy', 'reasonable procedures', 'procedures', 'wrong information', 'incorrect', 'not mine'],
  '1681i': ['dispute', 'investigation', '30 days', 'correct', 'delete', 'tradeline', 'inaccurate', 'credit report'],
  '1681s': ['furnisher', 'investigation', 'notice', 'reported', 'accounts']
};

const PATTERNS: Array<{ pattern: RegExp; violations: string[]; confidence: number }> = [
  { pattern: /early morning|before 8|after 9|late night|calls.*(night|early|weekend)/i, violations: ['15 USC §1692d'], confidence: 0.75 },
  { pattern: /stop.*call(ing)?|cease.*(communication|desist)|do not contact|written cease/i, violations: ['15 USC §1692c(c)'], confidence: 0.9 },
  { pattern: /validation.*notice|30.*day.*notice|debt.*verification|notice of debt/i, violations: ['15 USC §1692g(b)'], confidence: 0.85 },
  { pattern: /(false|falsa|deceptive|inflated|unauthorized fees)|wrong( balance|amount)|not( my| the) debt/i, violations: ['15 USC §1692e(2)(A)'], confidence: 0.85 },
  { pattern: /threat(ened)?.*(arrest|jail|garnish|legal|lawyer|police)/i, violations: ['15 USC §1692d'], confidence: 0.8 },
  { pattern: /credit report|credit score|equifax|experian|transunion|tradeline/i, violations: ['15 USC §1681e(b)', '15 USC §1681i(a)(5)(A)'], confidence: 0.9 },
  { pattern: /dispute.*credit|inaccurate.*(report|item|account)|not( mine| mine)|fraudulent account/i, violations: ['15 USC §1681i(a)(5)(A)', '15 USC §1681e(b)'], confidence: 0.95 },
  { pattern: /at work|place of employment|employer|coworker|office/i, violations: ['15 USC §1692d', '15 USC §1692c(b)'], confidence: 0.7 },
  { pattern: /mixed file|someone else|wrong (person|name|address|SSN)|identity.*(confused|mixed)/i, violations: ['15 USC §1681e(b)'], confidence: 0.85 },
  { pattern: /collection agency|debt buyer|third-party collector|original creditor/i, violations: ['15 USC §1692e(2)(A)'], confidence: 0.6 },
  { pattern: /late (payment|pay)|(collection|collections).*report|charge.?off|written.?off|collections agency/i, violations: ['15 USC §1681i(a)(5)(A)', '15 USC §1681s-2(a)(7)'], confidence: 0.8 }
];

export function analyzeText(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const matches: Array<{ violation: Violation; confidence: number; reasoning: string }> = [];
  const matchedStatutes = new Set<string>();

  // Pattern-based analysis
  for (const p of PATTERNS) {
    if (p.pattern.test(text) || p.pattern.test(lower)) {
      for (const statuteId of p.violations) {
        if (matchedStatutes.has(statuteId)) continue;
        const violation = ALL_VIOLATIONS.find((v) => v.statute === statuteId || statuteId.includes(v.statute.split(' ')[2]));
        if (violation) {
          matchedStatutes.add(statuteId);
          matches.push({
            violation,
            confidence: p.confidence,
            reasoning: `Pattern match: ${p.pattern.source.substring(0, 60)}...`
          });
        }
      }
    }
  }

  // Keyword-based broad matching for unmatched violations
  for (const v of ALL_VIOLATIONS) {
    if (matchedStatutes.has(v.statute)) continue;
    const keywords = [v.act.toLowerCase(), v.section.toLowerCase(), v.description.toLowerCase(), ...v.violations.map((x) => x.toLowerCase())];
    const matchCount = keywords.filter((k) => lower.includes(k) || text.toLowerCase().includes(k)).length;
    if (matchCount >= 3) {
      matches.push({ violation: v, confidence: 0.55 + matchCount * 0.05, reasoning: `Keyword overlap: ${matchCount} common terms found in your description.` });
    }
  }

  // If no specific violations found, give general FDCPA guidance
  if (matches.length === 0) {
    matches.push({
      violation: ALL_VIOLATIONS[0], // Default to §1692g as most common
      confidence: 0.3,
      reasoning: 'No definitive pattern matched. Generic analysis provided based on common consumer complaints. Model confidence is LOW — recommend human attorney review.'
    });
  }

  // Sort by confidence descending
  matches.sort((a, b) => b.confidence - a.confidence);

  return {
    matches: matches.slice(0, 5),
    generalAdvice: generateAdvice(matches),
    nextSteps: generateNextSteps(matches)
  };
}

function generateAdvice(matches: Array<{ violation: Violation; confidence: number }>): string {
  if (matches.length === 0) return 'Provide more details about the specific illegal or inaccurate conduct experienced.';
  
  const top = matches[0];
  if (top.violation.act === 'FDCPA') {
    return `Based on the provided description, the most relevant federal protection is the FDCPA (15 U.S.C. §1692). The statutes listed address specific types of illegal collector conduct. Document everything — keep letters, record call times and names, and preserve voicemails. Respond within 30 days of the FIRST contact.`;
  }
  if (top.violation.act === 'FCRA') {
    return `Under the FCRA (15 U.S.C. §1681), CRAs and furnishers have legal duties to ensure accuracy and investigate disputes. Send all disputes via certified mail. Keep copies of everything. If violations persist, you may have a private right of action.`;
  }
  return 'Document all interactions in writing. Keep records of all communications, dates, and names. Consult with a licensed attorney for formal legal advice.';
}

function generateNextSteps(matches: Array<{ violation: Violation }>): string[] {
  const steps: string[] = [];
  
  if (matches.some(m => m.violation.act === 'FDCPA')) {
    steps.push('Send written dispute/validation request to the collector via CERTIFIED MAIL — return receipt requested');
    steps.push('Document all subsequent contacts (date, time, caller name/number, what was said)');
  }
  if (matches.some(m => m.violation.act === 'FCRA')) {
    steps.push('File a direct dispute with the credit bureau(s) reporting the inaccurate information — include supporting documents');
    steps.push('File a complaint with the CFPB at consumerfinance.gov/complaint');
  }
  if (matches.some(m => m.violation.act === 'FCRA' && m.violation.statute.includes('1681i'))) {
    steps.push('If not corrected within 30 days, request method of verification per §1681g');
  }
  
  steps.push('Preserve all correspondence — these documents form the basis of any legal claim');
  steps.push('Consider filing in small claims or consulting a consumer protection attorney for statutory damages ($1,000+ per violation)');
  
  return steps;
}
