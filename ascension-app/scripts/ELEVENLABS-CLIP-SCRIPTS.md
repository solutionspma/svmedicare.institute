# ElevenLabs / AI Video Clip Scripts

Use these scripts to create character-driven clips for SV Medicare Institute.  
**Where to put finished clips:** `/public/assets/elevenlabs/`

---

## File naming convention

| Filename | Duration | Use |
|----------|----------|-----|
| `module-1-intro.mp4` | 15–30 sec | Module 1 intro |
| `module-2-intro.mp4` | 15–30 sec | Module 2 intro |
| `module-3-intro.mp4` | 15–30 sec | Module 3 intro |
| `module-4-intro.mp4` | 15–30 sec | Module 4 intro |
| `module-5-intro.mp4` | 15–30 sec | Module 5 intro |
| `cert-pass.mp4` | 8–15 sec | Certification passed celebration |
| `trivia-correct.mp4` | 3–5 sec | Correct answer (optional) |
| `trivia-try-again.mp4` | 3–5 sec | Wrong answer, keep going (optional) |

---

## Module intros (character welcome)

**Tone:** Professional, warm, confident. Think trusted advisor, not salesperson.

---

### Module 1 — Medicare Basics

> "Welcome to Module 1: Medicare Program Basics.  
> By the end of this module, you'll know how Medicare is structured, who qualifies, and when you need Part A, Part B, or both.  
> Let's get started."

---

### Module 2 — Plan Types & Benefits

> "Welcome to Module 2: Plan Types and Benefits.  
> Here we break down Medicare Advantage, HMOs, PPOs, and Part D.  
> You'll learn how to match the right plan to the right beneficiary.  
> Ready? Let's go."

---

### Module 3 — Compliance & Marketing

> "Welcome to Module 3: Compliance and Marketing.  
> CMS rules are strict for a reason.  
> In this module, you'll learn how to stay compliant—Scope of Appointment, educational vs marketing events, and what you can and cannot do.  
> Let's dive in."

---

### Module 4 — Fraud, Waste & Abuse

> "Welcome to Module 4: Fraud, Waste, and Abuse.  
> This isn't optional—it's required every year.  
> You'll learn how to spot FWA, report it, and protect yourself and your beneficiaries.  
> Here we go."

---

### Module 5 — Enrollment & Special Periods

> "Welcome to Module 5: Enrollment and Special Periods.  
> AEP, OEP, SEP—knowing the difference is critical.  
> By the end of this module, you'll know exactly when your clients can enroll or change plans.  
> Let's get into it."

---

## Certification pass celebration

**Tone:** Energetic, congratulatory, brief.

> "Congratulations! You passed the certification exam.  
> You're ready to serve Medicare beneficiaries with confidence.  
> Well done."

---

## Trivia feedback (short clips)

**trivia-correct.mp4** — 3–5 sec

> "Correct. Nice work."

---

**trivia-try-again.mp4** — 3–5 sec

> "Not quite. Check the explanation and keep learning."

---

## Optional: Key concept explainers

Use these for longer, standalone clips you can drop into modules.

---

### TrOOP (True Out-of-Pocket)

> "TrOOP—True Out-of-Pocket—is what counts toward your Part D catastrophic coverage.  
> Your deductible, copays, and coinsurance count.  
> OTC meds, vitamins, and employer help usually don't.  
> Keep that in mind when helping beneficiaries with high drug costs."

---

### Scope of Appointment

> "Scope of Appointment is required before you discuss specific plans.  
> Get it in writing—or recorded—and it's valid for 12 months from the date they sign.  
> No SOA, no plan specifics.  
> It's that simple."

---

### AEP vs OEP

> "AEP: October 15 to December 7. Everyone can change.  
> OEP: January 1 to March 31. Only for people already in Medicare Advantage who want to switch.  
> If they're in Original Medicare, they can't use OEP.  
> AEP is their window."

---

## Where to put clips

```
ascension-app/
  public/
    assets/
      elevenlabs/
        module-1-intro.mp4
        module-2-intro.mp4
        module-3-intro.mp4
        module-4-intro.mp4
        module-5-intro.mp4
        cert-pass.mp4
        trivia-correct.mp4      (optional)
        trivia-try-again.mp4    (optional)
```

After adding files, the app will use them if the paths in `src/data/certification.ts` match.  
Module intros are already wired to `module-{n}-intro.mp4`.

---

## ElevenLabs tips

- **Voice:** Professional, clear, slightly warm. Avoid salesy or overly casual.
- **Pacing:** 140–160 words per minute.
- **Pause:** Brief pause after "Welcome to Module X" and before "Let's get started."
- **Format:** Export as MP4 or WebM for web compatibility.
