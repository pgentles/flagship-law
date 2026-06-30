import express from 'express';
import cors from 'cors';
import { analyzeText } from './api/analysis.js';
import { ALL_VIOLATIONS } from './data/statutes.js';
const app = express();
const PORT = process.env.PORT || 3002;
const VERSION = '1.0.1';
app.use(cors());
app.use(express.json({ limit: '256kb' }));
// ─── X402 Middleware (x402 v2 spec compliant) ──────────────────────
const FREE_PATHS = ['/', '/health', '/openapi.json', '/favicon.ico', '/api/violations', '/api/stats', '/api/regulations', '/api/categories', '/api/sales'];
const USDC_BASE_MAINNET = '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA';
const BASE_NETWORK_CAIP2 = 'eip155:8453';
app.use((req, res, next) => {
    if (FREE_PATHS.includes(req.path))
        return next();
    const payment = req.headers['x402-payment'];
    if (!payment) {
        const wallet = process.env.WALLET_ADDRESS || '0x421C25445d6CF7B292933D743E698ed24dE36270';
        const resourceUrl = `https://${req.headers.host}${req.path}`;
        // Per x402 spec: provide TWO network requirements — "base" first, then "eip155:8453"
        // Both with same asset, payTo, amount, resource, scheme: "exact"
        const accepts = [
            {
                scheme: 'exact',
                network: 'base',
                amount: '50000',
                asset: USDC_BASE_MAINNET,
                payTo: wallet,
                maxTimeoutSeconds: 60,
                resource: {
                    url: resourceUrl,
                    description: 'FDCPA/FCRA legal violation analysis',
                    mimeType: 'application/json',
                    serviceName: 'Flagship Law',
                    tags: ['legal', 'fdcpa', 'fcra', 'debt-collection'],
                },
                extra: { name: 'USDC', version: '2' },
            },
            {
                scheme: 'exact',
                network: BASE_NETWORK_CAIP2,
                amount: '50000',
                asset: USDC_BASE_MAINNET,
                payTo: wallet,
                maxTimeoutSeconds: 60,
                resource: {
                    url: resourceUrl,
                    description: 'FDCPA/FCRA legal violation analysis',
                    mimeType: 'application/json',
                    serviceName: 'Flagship Law',
                    tags: ['legal', 'fdcpa', 'fcra', 'debt-collection'],
                },
                extra: { name: 'USDC', version: '2' },
            }
        ];
        const body = { x402Version: 2, accepts, wallet, facilitator: 'https://x402scan.com/facilitator' };
        const b64 = Buffer.from(JSON.stringify(body)).toString('base64');
        res.set('X-Payment-Protocol', 'x402');
        res.set('X402-Payment', 'required');
        res.set('Payment-Required', b64);
        return res.status(402).json(body);
    }
    next();
});
// ─── Health ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({
        status: 'flagship-law live',
        version: VERSION,
        endpoints: ['/api/analyze', '/api/violations', '/api/stats'],
        uptime: process.uptime()
    });
});
// ─── OpenAPI Discovery (pinned to 3.1.0, x402scan compatible) ───────
app.get('/openapi.json', (_req, res) => {
    res.json({
        openapi: '3.1.0',
        info: {
            title: 'Flagship Law — FDCPA/FCRA Violation Analysis API',
            version: VERSION,
            description: 'AI-powered legal violation analysis for consumer debt and credit reporting complaints. Identifies FDCPA, FCRA, and related statutory violations from consumer-submitted descriptions.',
            contact: { email: 'pgpgentles@gmail.com' },
            'x-guidance': 'Use POST /api/analyze to submit consumer complaints for statutory violation analysis. Use GET /api/violations to browse the statute database. All paid endpoints require X402-Payment header.',
        },
        servers: [{ url: 'https://flagship-law.onrender.com' }],
        paths: {
            '/api/analyze': {
                post: {
                    operationId: 'analyzeViolations',
                    summary: 'Analyze consumer complaint for statutory violations',
                    tags: ['Legal Analysis'],
                    'x-payment-info': {
                        price: { mode: 'fixed', currency: 'USD', amount: '0.05' },
                        protocols: [{ x402: {} }],
                    },
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        complaint: {
                                            type: 'string',
                                            description: 'Consumer description of debt collector or credit bureau conduct',
                                            examples: ['A debt collector called me 5 times yesterday before 8am and threatened to garnish my wages']
                                        },
                                        state: {
                                            type: 'string',
                                            description: 'US state code for jurisdictional analysis (e.g., FL, CA, TX)',
                                            examples: ['FL']
                                        },
                                    },
                                    required: ['complaint'],
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Violation analysis results',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            matches: { type: 'array', items: { type: 'object' } },
                                            generalAdvice: { type: 'string' },
                                            nextSteps: { type: 'array', items: { type: 'string' } },
                                        },
                                    },
                                },
                            },
                        },
                        '402': { description: 'Payment Required' },
                    },
                },
            },
            '/api/violations': {
                get: {
                    operationId: 'listViolations',
                    summary: 'Browse the statute database (no payment required)',
                    tags: ['Legal Reference'],
                    security: [],
                    parameters: [
                        {
                            name: 'act',
                            in: 'query',
                            required: false,
                            schema: { type: 'string', enum: ['FDCPA', 'FCRA'] },
                            description: 'Filter by act type',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'List of statutory violations',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            count: { type: 'integer' },
                                            violations: { type: 'array', items: { type: 'object' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/api/stats': {
                get: {
                    operationId: 'queryStats',
                    summary: 'Query statistics (no payment required)',
                    tags: ['Analytics'],
                    security: [],
                    responses: {
                        '200': {
                            description: 'Running query statistics',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            totalQueries: { type: 'integer' },
                                            recentQueries: { type: 'array', items: { type: 'object' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
});
// ─── API: Violation Analysis ────────────────────────────────────────
const queryLog = [];
const MAX_LOG = 1000;
app.post('/api/analyze', (req, res) => {
    const { complaint, state } = req.body;
    if (!complaint || typeof complaint !== 'string' || complaint.trim().length < 10) {
        return res.status(400).json({ error: 'Field "complaint" is required and must be at least 10 characters.' });
    }
    const result = analyzeText(complaint);
    queryLog.push({ type: 'analyze', timestamp: new Date().toISOString(), path: '/api/analyze' });
    if (queryLog.length > MAX_LOG)
        queryLog.shift();
    res.json({
        ...result,
        state: state || 'general',
        disclaimer: 'This analysis is informational only and does not constitute legal advice. Consult a licensed attorney for formal legal guidance.',
    });
});
// ─── API: Sales (Free) ──────────────────────────────────────────────
app.get('/api/sales', (_req, res) => {
    res.json({
        total: 0,
        revenue_usdc: "0.00",
        recent: []
    });
});
// ─── API: Violations Database ───────────────────────────────────────
app.get('/api/violations', (req, res) => {
    const act = req.query.act;
    const filtered = act
        ? ALL_VIOLATIONS.filter(v => v.act.toUpperCase() === act.toUpperCase())
        : ALL_VIOLATIONS;
    res.json({
        count: filtered.length,
        violations: filtered.map(v => ({
            statute: v.statute,
            act: v.act,
            section: v.section,
            description: v.description,
            penalties: v.penalties,
            deadlines: v.deadlines,
            elements: v.elements,
            commonViolations: v.violations?.slice(0, 3),
        })),
    });
});
// ─── API: Query Stats ───────────────────────────────────────────────
app.get('/api/stats', (_req, res) => {
    res.json({
        totalQueries: queryLog.length,
        recentQueries: queryLog.slice(-50).reverse(),
    });
});
// ─── API: Regulations (Free) ───────────────────────────────────────
app.get('/api/regulations', (_req, res) => {
    res.json({
        regulations: [
            { id: 'fdcpa', name: 'Fair Debt Collection Practices Act', statute: '15 U.S.C. §1692', agency: 'CFPB' },
            { id: 'fcra', name: 'Fair Credit Reporting Act', statute: '15 U.S.C. §1681', agency: 'CFPB/FTC' },
            { id: 'crosa', name: 'Credit Repair Organizations Act', statute: '15 U.S.C. §1678', agency: 'FTC' },
            { id: 'tcpa', name: 'Telephone Consumer Protection Act', statute: '47 U.S.C. §227', agency: 'FCC' },
            { id: 'fdcpa-fl', name: 'Florida Consumer Collection Practices Act', statute: 'Fla. Stat. §559.55', agency: 'FL Dept of Financial Services' },
        ],
    });
});
// ─── API: Categories (Free) ────────────────────────────────────────
app.get('/api/categories', (_req, res) => {
    res.json({
        categories: [
            { id: 'harassment', name: 'Harassment/Abuse', statute: 'FDCPA §806' },
            { id: 'misrepresentation', name: 'Misrepresentation', statute: 'FDCPA §807' },
            { id: 'unfair-practices', name: 'Unfair Practices', statute: 'FDCPA §808' },
            { id: 'validation', name: 'Validation Notice', statute: 'FDCPA §809' },
            { id: 'reporting', name: 'Credit Reporting', statute: 'FCRA §602-629' },
            { id: 'privacy', name: 'Privacy Violations', statute: 'GLBA/CCPA' },
            { id: 'robo-call', name: 'Robocalls/Auto-dialer', statute: 'TCPA §227' },
        ],
    });
});
// ─── Static Files ───────────────────────────────────────────────────
app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Flagship Law v${VERSION} running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/{analyze,violations,stats}`);
    console.log(`OpenAPI: http://localhost:${PORT}/openapi.json`);
});
