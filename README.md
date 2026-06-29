# Flagship Law — FDCPA/FCRA Violation Analysis API

AI-powered legal violation analysis for AI agents. Analyzes consumer complaints about debt collectors and credit bureaus, identifies FDCPA/FCRA statutory violations, and provides specific citations, elements, penalties, and demand letter language.

Built for the agent economy — discovered via [x402scan](https://x402scan.com), paid via X402 (USDC on Base).

## Endpoints

| Endpoint | Method | Price | Description |
|----------|--------|-------|-------------|
| `/api/analyze` | POST | $0.05 USDC | Analyze complaint for statutory violations |
| `/api/violations` | GET | Free | Browse statute database |
| `/api/stats` | GET | Free | Query statistics |
| `/health` | GET | Free | Health check |
| `/openapi.json` | GET | Free | OpenAPI 3.1.0 spec |

## Quick Start

```bash
npm install
npm run build
npm start
# → http://localhost:3002
```

## Usage

```bash
curl -X POST https://flagship-law.onrender.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"complaint": "A debt collector called me 5 times before 8am and threatened wage garnishment", "state": "FL"}'
```

## Owner

- Patrick Gentles
- pgpgentles@gmail.com
- Wallet: `0x421C25445d6CF7B292933D743E698ed24dE36270`
