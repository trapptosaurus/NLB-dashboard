export const kpiData = {
    group: [
        {
            id: 'recurring_revenue',
            name: 'Recurring revenues',
            unit: 'bn EUR',
            description: 'Recurring, sustainable revenue base excluding one-offs',
            targetInfo: 'Reflects regional growth and higher wallet share by 2030',
            type: 'higher_better',
            data: {
                2025: { plan: 1.2, actual: 1.2 },
                2026: { plan: 1.35, actual: 1.35 },
                2027: { plan: 1.5, actual: 1.43 },
                2028: { plan: 1.65, actual: null },
                2029: { plan: 1.8, actual: null },
                2030: { plan: 2.0, actual: null }
            }
        },
        {
            id: 'recurring_profit',
            name: 'Recurring profit',
            unit: 'bn EUR',
            description: 'Underlying profit excluding volatile items',
            targetInfo: 'Profitability milestone of the 2030 strategy',
            type: 'higher_better',
            data: {
                2025: { plan: 0.55, actual: 0.55 },
                2026: { plan: 0.65, actual: 0.65 },
                2027: { plan: 0.75, actual: 0.64 },
                2028: { plan: 0.85, actual: null },
                2029: { plan: 0.95, actual: null },
                2030: { plan: 1.0, actual: null }
            }
        },
        {
            id: 'cost_income_ratio',
            name: 'Cost to income ratio',
            unit: '%',
            description: 'Operating efficiency measure',
            targetInfo: 'Reflects scale effects and digitalisation',
            type: 'lower_better',
            data: {
                2025: { plan: 45, actual: 45 },
                2026: { plan: 44, actual: 44 },
                2027: { plan: 43, actual: 43 },
                2028: { plan: 42, actual: null },
                2029: { plan: 41, actual: null },
                2030: { plan: 40, actual: null }
            }
        },
        {
            id: 'roe',
            name: 'Return on equity',
            unit: '%',
            description: 'Profitability of shareholder capital',
            targetInfo: 'Sustained double digit returns through the cycle',
            type: 'higher_better',
            data: {
                2025: { plan: 18, actual: 18 },
                2026: { plan: 17, actual: 17 },
                2027: { plan: 16.5, actual: 15.5 },
                2028: { plan: 16, actual: null },
                2029: { plan: 15.5, actual: null },
                2030: { plan: 15, actual: null }
            }
        },
        {
            id: 'dividend_payout',
            name: 'Dividend payout ratio',
            unit: '%',
            description: 'Share of profit paid to shareholders',
            targetInfo: 'Balance of growth and shareholder returns',
            type: 'range',
            data: {
                2025: { plan: 42, actual: 42 },
                2026: { plan: 45, actual: 45 },
                2027: { plan: 50, actual: 50 },
                2028: { plan: 52, actual: null },
                2029: { plan: 54, actual: null },
                2030: { plan: 55, actual: null }
            }
        },
        {
            id: 'price_book',
            name: 'Price to book ratio',
            unit: 'x',
            description: 'Market valuation versus book equity',
            targetInfo: 'Reflects value creation and market confidence',
            type: 'higher_better',
            data: {
                2025: { plan: 0.85, actual: 0.85 },
                2026: { plan: 0.95, actual: 0.95 },
                2027: { plan: 1.05, actual: 1.05 },
                2028: { plan: 1.1, actual: null },
                2029: { plan: 1.15, actual: null },
                2030: { plan: 1.2, actual: null }
            }
        },
        {
            id: 'tier1_ratio',
            name: 'Tier 1 capital ratio',
            unit: '%',
            description: 'Total regulatory capital buffer',
            targetInfo: 'Supports growth while keeping strong solvency',
            type: 'range',
            data: {
                2025: { plan: 17.0, actual: 17.0 },
                2026: { plan: 16.5, actual: 16.5 },
                2027: { plan: 16.0, actual: 16.0 },
                2028: { plan: 15.5, actual: null },
                2029: { plan: 15.2, actual: null },
                2030: { plan: 15.0, actual: null }
            }
        },
        {
            id: 'cet1_ratio',
            name: 'CET1 ratio',
            unit: '%',
            description: 'Core equity capital strength',
            targetInfo: 'Strategic solvency anchor',
            type: 'higher_better',
            data: {
                2025: { plan: 16.5, actual: 16.5 },
                2026: { plan: 16.0, actual: 16.0 },
                2027: { plan: 15.5, actual: 15.5 },
                2028: { plan: 14.5, actual: null },
                2029: { plan: 14.0, actual: null },
                2030: { plan: 13.5, actual: null }
            }
        },
        {
            id: 'cost_risk',
            name: 'Cost of risk',
            unit: 'bps',
            description: 'Credit loss charges relative to loan book',
            targetInfo: 'Reflects long term credit cycle normalisation',
            type: 'range',
            data: {
                2025: { plan: 10, actual: 10 },
                2026: { plan: 25, actual: 25 },
                2027: { plan: 35, actual: 35 },
                2028: { plan: 38, actual: null },
                2029: { plan: 39, actual: null },
                2030: { plan: 40, actual: null }
            }
        },
        {
            id: 'nps',
            name: 'Customer NPS index',
            unit: 'pts',
            description: 'Customer loyalty and advocacy',
            targetInfo: 'Ambition to become market leader',
            type: 'higher_better',
            data: {
                2025: { plan: 25, actual: 25 },
                2026: { plan: 30, actual: 30 },
                2027: { plan: 35, actual: 35 },
                2028: { plan: 40, actual: null },
                2029: { plan: 45, actual: null },
                2030: { plan: 50, actual: null }
            }
        },
        {
            id: 'enps',
            name: 'Employee engagement eNPS',
            unit: 'pts',
            description: 'Employee engagement and advocacy',
            targetInfo: 'Employer of choice ambition',
            type: 'higher_better',
            data: {
                2025: { plan: 32, actual: 32 },
                2026: { plan: 36, actual: 36 },
                2027: { plan: 40, actual: 40 },
                2028: { plan: 44, actual: null },
                2029: { plan: 48, actual: null },
                2030: { plan: 50, actual: null }
            }
        }
    ],
    retail: [
        {
            id: 'retail_clients',
            name: 'Retail clients',
            unit: 'millions',
            description: 'Total number of retail and micro clients',
            targetInfo: 'Driven by regional penetration and digital acquisition',
            type: 'higher_better',
            data: {
                2025: { plan: 2.8, actual: 2.8 },
                2026: { plan: 2.85, actual: 2.85 },
                2027: { plan: 2.9, actual: 2.78 },
                2028: { plan: 2.93, actual: null },
                2029: { plan: 2.96, actual: null },
                2030: { plan: 3.0, actual: null }
            }
        },
        {
            id: 'retail_revenue_per_client',
            name: 'Revenue per active retail client',
            unit: 'EUR',
            description: 'Average yearly monetisation per client',
            targetInfo: 'Improved cross sell and pricing power',
            type: 'higher_better',
            data: {
                2025: { plan: 290, actual: 290 },
                2026: { plan: 320, actual: 320 },
                2027: { plan: 350, actual: 350 },
                2028: { plan: 370, actual: null },
                2029: { plan: 385, actual: null },
                2030: { plan: 400, actual: null }
            }
        }
    ],
    cib: [
        {
            id: 'cib_revenue_per_client',
            name: 'Revenue per active CIB client',
            unit: 'k EUR',
            description: 'Average client monetisation in CIB',
            targetInfo: 'Deeper client relationships and advisory share',
            type: 'higher_better',
            data: {
                2025: { plan: 13, actual: 13 },
                2026: { plan: 14, actual: 14 },
                2027: { plan: 15, actual: 13.8 },
                2028: { plan: 17, actual: null },
                2029: { plan: 18.5, actual: null },
                2030: { plan: 20, actual: null }
            }
        },
        {
            id: 'green_financing',
            name: 'Green financing stock',
            unit: 'bn EUR',
            description: 'Outstanding sustainable finance volume',
            targetInfo: 'Transition finance growth pillar',
            type: 'higher_better',
            data: {
                2025: { plan: 0.5, actual: 0.5 },
                2026: { plan: 0.7, actual: 0.7 },
                2027: { plan: 0.9, actual: 0.9 },
                2028: { plan: 1.0, actual: null },
                2029: { plan: 1.15, actual: null },
                2030: { plan: 1.3, actual: null }
            }
        }
    ],
    payments: [
        {
            id: 'payments_revenue',
            name: 'Payments revenue',
            unit: 'm EUR',
            description: 'Revenue contribution of the payments business',
            targetInfo: 'Scaling of digital payments ecosystem',
            type: 'higher_better',
            data: {
                2025: { plan: 230, actual: 230 },
                2026: { plan: 250, actual: 250 },
                2027: { plan: 270, actual: 270 },
                2028: { plan: 290, actual: null },
                2029: { plan: 305, actual: null },
                2030: { plan: 320, actual: null }
            }
        },
        {
            id: 'cash_transactions',
            name: 'Cash transactions in branches',
            unit: '%',
            description: 'Share of cash handled physically in branches',
            targetInfo: 'Digitalisation and cost efficiency effect',
            type: 'lower_better',
            data: {
                2025: { plan: 28, actual: 28 },
                2026: { plan: 24, actual: 24 },
                2027: { plan: 20, actual: 20 },
                2028: { plan: 16, actual: null },
                2029: { plan: 13, actual: null },
                2030: { plan: 10, actual: null }
            }
        }
    ]
};
