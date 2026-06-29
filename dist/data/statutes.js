// ─── Federal Statutes Database ─────────────────────────────────
// FDCPA (15 U.S.C. §1692 et seq.), FCRA (15 U.S.C. §1681 et seq.), ECOA, GLBA
export const FDCPA_VIOLATIONS = [
    {
        statute: "15 USC §1692g(b)",
        act: "FDCPA",
        section: "Validation of Debts — 30-Day Period",
        description: "Within 5 days of initial communication, a debt collector must provide: (a) the amount of the debt; (b) the name of the creditor; (c) a statement that the consumer may dispute within 30 days; (d) a statement that verification will be provided if disputed.",
        elements: [
            "Collector is a 'debt collector' under 15 USC §1692a(6) (principal purpose is collection, or regularly collects consumer debts)",
            "Communication was 'initial communication' (first contact about the debt)",
            "Required disclosures were not provided within 5 days",
            "Consumer was not given 30-day validation notice"
        ],
        penalties: "Up to $1,000 statutory damages + actual damages + attorney fees per 15 USC §1692k(a)(2)(A). Class actions up to $500K or 1% of collector's net worth.",
        deadlines: "30-day validation period runs from receipt of notice, not from collector's mailing date.",
        violations: [
            "Reporting disputed debt as valid on credit reports during 30-day validation window",
            "Continuing collection activity after receiving written dispute within 30 days without providing verification",
            "Omitting mini-Miranda 'this is an attempt to collect a debt' notice",
            "Sending communications that overshadow consumer's right to dispute"
        ],
        demandLanguage: "Pursuant to 15 U.S.C. §1692g(b), your company failed to provide the required validation notice within five (5) business days of your initial communication dated [DATE]. I hereby dispute the validity of this alleged debt and demand that you: (1) cease all collection activity immediately, (2) provide complete verification of this debt including the original signed agreement, itemized accounting, and chain of assignment, and (3) delete any and all tradelines associated with this alleged debt from all consumer reporting agencies."
    },
    {
        statute: "15 USC §1692e(2)(A)",
        act: "FDCPA",
        section: "False Representation — Character/Amount of Debt",
        description: "A debt collector may not falsely represent the character, amount, or legal status of any debt, or services rendered or compensation they may receive.",
        elements: [
            "Collector made a misrepresentation regarding the debt",
            "The misrepresentation was material (would affect consumer's response)",
            "Misrepresentation was about character, amount, or legal status"
        ],
        penalties: "Up to $1,000 + actual damages + attorney fees per §1692k.",
        violations: [
            "Reporting inflated balance that includes unauthorized fees or interest",
            "Reporting debt as 'charged off' while simultaneously demanding full payment (inconsistent position)",
            "Claiming debt is legally enforceable when statute of limitations has expired",
            "Noting balance includes 'legal fees' when no attorney has been retained (misrepresenting legal status)",
            "Failing to credit payments received and reporting an inaccurate balance"
        ],
        demandLanguage: "15 U.S.C. §1692e(2)(A) prohibits falsely representing the character or amount of a consumer debt. Your company has reported a balance of $[AMOUNT] but failed to disclose that [SPECIFIC INACCURACY]. This constitutes a material misrepresentation. I demand immediate correction and deletion of all inaccurate data."
    },
    {
        statute: "15 USC §1692d",
        act: "FDCPA",
        section: "Harassment or Abuse",
        description: "A debt collector may not engage in any conduct the natural consequence of which is to harass, oppress, or abuse any person in connection with the collection of a debt.",
        elements: [
            "Collector engaged in specified abusive conduct, OR",
            "Collector's conduct has natural consequence of harassment/oppression/abuse",
            "Conduct was in connection with debt collection"
        ],
        penalties: "Up to $1,000 + actual damages + attorney fees per §1692k.",
        violations: [
            "Calling more than once per day per phone number",
            "Calling before 8 AM or after 9 PM local time",
            "Using profane or abusive language",
            "Calling consumer's workplace after being told not to",
            "Threatening arrest, garnishment, or legal action that cannot be taken",
            "Continuing to call after written cease-and-desist request (with limited exceptions under §1692c(c))",
            "Reporting to employer that employee has a debt (except for wage garnishment orders)",
            "Publishing consumer's name on a 'bad debtor' list"
        ],
        demandLanguage: "15 U.S.C. §1692d prohibits conduct whose natural consequence is to harass, oppress, or abuse. Your company has engaged in the following prohibited conduc: [ DESCRIBE]. I demand that you immediately cease all communications except as specifically permitted by 15 USC §1692c. Continued [SPECIFIC VIOLATION] will result in immediate legal action."
    },
    {
        statute: "15 USC §1692c(c)",
        act: "FDCPA",
        section: "Cease Communication — Consumer's Right",
        description: "If a consumer notifies a collector in writing that they refuse to pay or wish all communication to cease, the collector shall cease communication except to advise: (a) collection efforts are being stopped; (b) specific legal remedies will be invoked; (c) honoring consumer communication on behalf of third parties (limited).",
        elements: [
            "Consumer sent written notice refusing payment or requesting cease of communication",
            "Collector continued communication after receiving notice",
            "No statutory exception applies (not advising of stopping collection, or specific remedy)"
        ],
        penalties: "Up to $1,000 + actual damages + attorney fees per §1692k.",
        violations: [
            "Making additional phone calls after receiving a written cease-and-desist letter",
            "Sending letters/emails after written request to stop",
            "Continuing to report to credit bureaus after written dispute (arguably violates spirit of §1692c(c))",
            "Transferring debt to another collector who reinitiates collection (evasion tactic)",
            "Contacting consumer through social media after written cease notice"
        ],
        demandLanguage: "15 U.S.C. §1692(c)(3) requires you to cease all communication upon written consumer notice. On [DATE], I sent written notice requesting you cease communication. Your company has since continued contacting me via [METHOD]. This constitutes a violation of my federal rights under the FDCPA. I demand immediate cessation of ALL communication."
    }
];
export const FCRA_VIOLATIONS = [
    {
        statute: "15 USC §1681e(b)",
        act: "FCRA",
        section: "Reasonable Procedures for Accuracy",
        description: "Consumer reporting agencies must follow reasonable procedures to assure the accuracy of information in consumer reports. This is measured by industry standards and whether the CRA took additional steps when notified of a potential inaccuracy.",
        elements: [
            "Entity qualifies as a 'consumer reporting agency' under §1681a(f)",
            "Published a consumer report containing inaccurate information",
            "CRA failed to follow reasonable procedures to assure accuracy",
            "Consumer suffered injury as a result",
            "Federal Trade Commission or Consumer Financial Protection Bureau found reasonable procedures lacking"
        ],
        penalties: "Actual damages (minimum $100 statutory per willful violation under §1681n), plus punitive damages, plus attorney fees per §1681n(a).",
        violations: [
            "Returning a response to consumer dispute that does not address specific issues raised",
            "Re-reporting previously deleted data without investigating completeness",
            "Failing to maintainydra records of disputes received and investigations conducted",
            "Conducting only keyword-match review of dispute letters without substantive investigation",
            "Permitting data furnishers to systematically report inaccurate information without any reasonable procedures to prevent it"
        ],
        demandLanguage: "15 U.S.C. §1681e(b) imposes a duty on consumer reporting agencies to follow reasonable procedures to assure the accuracy of consumer reports. Your agency has published a report on me containing the following inaccuracies: [LIST]. Despite my dispute dated [DATE], you have failed to conduct a reasonable investigation. I demand immediate correction or deletion of all inaccurate items and a new reasonable investigation per §1681i."
    },
    {
        statute: "15 USC §1681i(a)(5)(A)",
        act: "FCRA",
        section: "Dispute Investigation — Duty to Correct",
        description: "When a consumer disputes the completeness or accuracy of information, the CRA must: (1) conduct a reasonable investigation within 30 days; (2) record the current status of the disputed information or delete it; (3) provide written results within 5 days of completion.",
        elements: [
            "Consumer wrote directly to the CRA identifying the disputed information",
            "Consumer provided sufficient identifying information",
            "CRA received notice of dispute (from consumer for direct disputes, or from a party for indirect)",
            "CRA failed to complete investigation within 30 days",
            "CRA deleted the information but did NOT notify the consumer of the result properly, or",
            "CRA maintained the inaccurate information without adequate investigation record"
        ],
        penalties: "Actual damages, up to $1,000 per violation (statutory) for willful noncompliance; attorney fees under §1681g(d).",
        deadlines: "30-day investigation period begins when CRA receives the notice of dispute. Extensions to 45 days only allowed if CRA receives additional relevant information.",
        violations: [
            "Sending a form letter 'investigation complete' response without reviewing the consumer's specific dispute",
            "Re-reporting 'verified' tradeline without contacting the original furnisher",
            "Failing to consider all relevant documentation submitted by consumer",
            "Deleting item then reinserting it after 30 days without new investigation",
            "Not conducting a free credit report within 30 days per §1681j when dispute results in change"
        ],
        demandLanguage: "Pursuant to 15 U.S.C. §1681i(a)(5)(A), upon receipt of my dispute dated [DATE], you were required to complete a reasonable investigation within 30 days. You have failed to: [specify — e.g., contact the source, consider documentation, correct the error]. I demand immediate deletion of the inaccurate tradelines and written confirmation of your investigation results within five (5) business days."
    },
    {
        statute: "15 USC §1681s-2(a)(7)",
        act: "FCRA",
        section: "Furnisher's Duty — Dispute Notification from CRA",
        description: "After a consumer disputes with a CRA, the CRA must notify the furnisher that the information is disputed. The furnisher must: (1) investigate; (2) provide accurate information; (3) report results back to all CRAs to which it reported.",
        elements: [
            "Furnisher is a 'person' that furnishes information to a CRA",
            "CRA notified the furnisher of a consumer dispute under §1681i(d)",
            "Furnisher failed to conduct a reasonable investigation of the dispute",
            "Furnisher reported inaccurate information to any CRA after notice of dispute",
            "Furnisher failed to report corrected information to all CRAs to which it originally reported"
        ],
        penalties: "Actual damages + attorney fees; willful violations may result in FTC or CFPB enforcement. Furnishers may also face liability under state consumer protection statutes.",
        violations: [
            "Re-inserting previously deleted account without notifying the consumer of the right to request method of verification",
            "Failing to furnish updated balance information resulting in inflated reported amount",
            "Reporting account as active and current while simultaneously reporting it as disputed (inconsistent)",
            "Not correcting address/name variations that cause mixed files",
            "Pushing automatic payment ('pay for delete') agreements without proper authorization"
        ],
        demandLanguage: "15 U.S.C. §1681s-2(a)(7) requires furnishers to conduct reasonable investigations upon dispute from a consumer reporting agency. This notice serves as confirmation that [CRA NAME] has notified you of my dispute regarding [ACCOUNT]. You are now on notice. Any continued reporting of unverified, inaccurate information will constitute willful violation exposing you to liability under §1681n."
    }
];
export const ALL_VIOLATIONS = [...FDCPA_VIOLATIONS, ...FCRA_VIOLATIONS];
