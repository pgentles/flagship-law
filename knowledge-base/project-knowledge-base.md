# Kronos Legal — Project Knowledge Base

> **Last Updated:** 2026-06-28
> **Status:** Live on Render ✅ — x402scan registration needed
> **Repo:** https://github.com/pgentles/kronos-legal
> **Live URL:** https://kronos-legal.onrender.com

---

## 1. Executive Summary

Kronos Legal is an AI-powered API that analyzes consumer-submitted complaints about debt collectors and credit bureaus, identifies which federal statutes (FDCPA, FCRA) are likely being violated, provides specific statute citations/elements/penalties, generates demand letter language, and outlines next steps. It uses the X402 payment protocol (USDC on Base) for per-query billing.

---

## 2. Architecture

```
Consumer/Agent
    │
    ▼ x402scan.com → paywall → kronos-legal API
    │
┌────────────────────────────────────────┐
│ kronos-legal.onrender.com (Express)    │
│                                        │
│  X402 Middleware                       │
│    └─ Bypass: /health, /openapi.json,  │
│       /api/violations, /api/stats,      │
│       /favicon.ico                     │
│                                        │
│  POST /api/analyze  → $0.05 USDC       │
│  GET  /api/violations → FREE           │
│  GET  /api/stats → FREE                │
│  GET  /api/history → $0.05             │
│                                        │
│  In-memory query tracker               │
│  Cron monitor → Telegram alerts         │
└────────────────────────────────────────┘
```

---

## 3. Endpoints

| Endpoint | Method | Price (USDC) | Description |
|----------|--------|-------------|-------------|
| `/api/analyze` | POST | $0.05 | Analyze complaint for violations |
| `/api/violations` | GET | Free | Browse statute database (filter by act) |
| `/api/stats` | GET | Free | Query statistics |
| `/api/history` | GET | $0.05 | Full query history |
| `/health` | GET | Free | Health check |
| `/openapi.json` | GET | Free | OpenAPI 3.1.0 spec |
| `/favicon.ico` | GET | Free | API icon |

### 3.1 `/api/analyze` Input Schema
```json
{
  "complaint": "string (min 10 chars) — consumer description of conduct",
  "state": "string (optional) — US state code, e.g. FL"
}
```

### 3.2 `/api/analyze` Response
```json
{
  "matches": [{
    "violation": { "statute", "act", "section", "description", "elements", "penalties", "deadlines", "demandLanguage" },
    "confidence": 0.85,
    "reasoning": "Pattern match: ..."
  }],
  "generalAdvice": "string",
  "nextSteps": ["string"],
  "state": "FL",
  "disclaimer": "informational only, not legal advice"
}
```

---

## 4. Statute Database

Located in `src/data/statutes.ts`. Currently covers:

**FDCPA (15 U.S.C. §1692 et seq.)**
- 15 USC §1692g(b) — Validation of Debts (30-day notice)
- 15 USC §1692e(2)(A) — False Representation (character/amount)
- 15 USC §1692d — Harassment or Abuse
- 15 USC §1692c(c) — Cease Communication (consumer's right)

**FCRA (15 U.S.C. §1681 et seq.)**
- 15 USC §1681e(b) — Reasonable Procedures for Accuracy
- 15 USC §1681i(a)(5)(A) — Dispute Investigation & Correction
- 15 USC §1681s-2(a)(7) — Furnisher's Duty (dispute notification)

Each statute record includes: statute, act, section, description, elements, penalties, deadlines, common violations list, demand language template.

**To add new statutes:** Add entries to `ALL_VIOLATIONS` array in `src/data/statutes.ts`.

---

## 5. Deployment

- **Platform:** Render.com (free tier, auto-deploy from GitHub)
- **Build:** `npm install && npm run build`
- **Start:** `node dist/server.js`
- **Health:** `curl https://kronos-legal.onrender.com/health`

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (set by Render) |
| `WALLET_ADDRESS` | Payment wallet (overrides default) |

---

## 6. Payment Configuration

- **Wallet:** `0x421C25445d6CF7B292933D743E698ed24dE36270`
- **Network:** Base (chain_id: 8453)
- **Asset:** USDC
- **Facilitator:** `https://x402scan.com/facilitator`
- **x402 version:** 2 (accepts array with payTo, amount, network, asset, scheme)

### Bypass Paths (no payment required)
```
/, /health, /openapi.json, /favicon.ico
```

---

## 7. Transaction Monitoring

**Cron Job:** ID `5d722e358a8b`
- **Schedule:** Every 10 minutes
- **Check URL:** `https://kronos-legal.onrender.com/api/stats`
- **Memory key:** `kronos-legal-last-stats`
- **Action:** Sends Telegram notification on new queries
- **Format:** `⚖️ Kronos Legal: New Analysis Request!`

---

## 8. Owner Contact

- **Name:** Patrick Gentles
- **Email:** pgpgentles@gmail.com
- **Wallet:** `0x421C25445d6CF7B292933D743E698ed24dE36270`
- **GitHub:** https://github.com/pgentles/kronos-legal
- **Render URL:** https://kronos-legal.onrender.com
- **x402scan:** (not yet registered — use /resources/register with origin kronos-legal.onrender.com)
