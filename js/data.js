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
        },
        {
            id: 'normalized_roe',
            name: 'Normalized RoE',
            unit: '%',
            description: 'Return on equity adjusted for one-off and extraordinary effects',
            targetInfo: 'Sustained high returns',
            type: 'higher_better',
            data: {
                2025: { plan: 29, actual: 29 },
                2026: { plan: 27, actual: 27 },
                2027: { plan: 25, actual: 25 },
                2028: { plan: 23, actual: null },
                2029: { plan: 21, actual: null },
                2030: { plan: 20, actual: null }
            }
        },
        {
            id: 'rtsr_peer',
            name: 'RTSR vs peer group',
            unit: '',
            description: 'Relative total shareholder return versus European peer banks',
            targetInfo: 'Consistently outperforming peers',
            type: 'higher_better',
            displayType: 'qualitative', // Special visualization
            data: {
                2025: { plan: 3, actual: 3 }, // 3 = Above, 2 = Inline, 1 = Below
                2026: { plan: 3, actual: 3 },
                2027: { plan: 3, actual: 3 },
                2028: { plan: 3, actual: null },
                2029: { plan: 3, actual: null },
                2030: { plan: 3, actual: null }
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
        },
        {
            id: 'digital_penetration',
            name: 'Digital penetration (active clients)',
            unit: '%',
            description: 'Share of active retail customers using digital channels',
            targetInfo: 'Digital-first engagement model',
            type: 'higher_better',
            data: {
                2025: { plan: 50, actual: 50 },
                2026: { plan: 58, actual: 58 },
                2027: { plan: 65, actual: 65 },
                2028: { plan: 70, actual: null },
                2029: { plan: 75, actual: null },
                2030: { plan: 80, actual: null }
            }
        },
        {
            id: 'digital_core_sales',
            name: 'Digital core product sales penetration',
            unit: '%',
            description: 'Share of core retail products sold fully digitally',
            targetInfo: 'End-to-end digital sales processes',
            type: 'higher_better',
            data: {
                2025: { plan: 5, actual: 5 },
                2026: { plan: 15, actual: 15 },
                2027: { plan: 25, actual: 25 },
                2028: { plan: 35, actual: null },
                2029: { plan: 42, actual: null },
                2030: { plan: 50, actual: null }
            }
        },
        {
            id: 'mobile_app_rating',
            name: 'Mobile app rating',
            unit: '⭐',
            description: 'Average customer rating of the mobile banking application',
            targetInfo: 'Best-in-class user experience',
            type: 'higher_better',
            data: {
                2025: { plan: 4.4, actual: 4.4 },
                2026: { plan: 4.45, actual: 4.45 },
                2027: { plan: 4.5, actual: 4.5 },
                2028: { plan: 4.5, actual: null },
                2029: { plan: 4.5, actual: null },
                2030: { plan: 4.5, actual: null }
            }
        },
        {
            id: 'nps_retail',
            name: 'Customer NPS (Retail)',
            unit: 'pts',
            description: 'Net Promoter Score measuring retail customer advocacy',
            targetInfo: 'High customer loyalty',
            type: 'higher_better',
            data: {
                2025: { plan: 30, actual: 30 },
                2026: { plan: 35, actual: 35 },
                2027: { plan: 40, actual: 40 },
                2028: { plan: 44, actual: null },
                2029: { plan: 47, actual: null },
                2030: { plan: 50, actual: null }
            }
        },
        {
            id: 'digital_acquisition',
            name: 'Digital acquisition share',
            unit: '%',
            description: 'Share of new retail customers acquired fully digitally',
            targetInfo: 'Seamless digital onboarding',
            type: 'higher_better',
            data: {
                2025: { plan: 1, actual: 1 },
                2026: { plan: 8, actual: 8 },
                2027: { plan: 15, actual: 15 },
                2028: { plan: 20, actual: null },
                2029: { plan: 25, actual: null },
                2030: { plan: 30, actual: null }
            }
        },
        {
            id: 'stp_consumer',
            name: 'STP consumer finance',
            unit: '%',
            description: 'Straight-through-processing ratio in consumer finance',
            targetInfo: 'Automated lending decisions',
            type: 'higher_better',
            data: {
                2025: { plan: 47, actual: 47 },
                2026: { plan: 60, actual: 60 },
                2027: { plan: 70, actual: 70 },
                2028: { plan: 80, actual: null },
                2029: { plan: 85, actual: null },
                2030: { plan: 90, actual: null }
            }
        },
        {
            id: 'net_customer_growth',
            name: 'Net customer base growth',
            unit: '%',
            description: 'Annual net growth rate of total retail customer base',
            targetInfo: 'Expanding market presence',
            type: 'higher_better',
            data: {
                2025: { plan: 0.5, actual: 0.5 },
                2026: { plan: 0.8, actual: 0.8 },
                2027: { plan: 1.0, actual: 1.0 },
                2028: { plan: 1.2, actual: null },
                2029: { plan: 1.4, actual: null },
                2030: { plan: 1.5, actual: null }
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
        },
        {
            id: 'cib_loan_stock',
            name: 'Total CIB loan stock',
            unit: 'bn EUR',
            description: 'Total outstanding corporate and investment banking loan portfolio',
            targetInfo: 'Doubling the loan book',
            type: 'higher_better',
            data: {
                2025: { plan: 6, actual: 6 },
                2026: { plan: 7.5, actual: 7.5 },
                2027: { plan: 9, actual: 9 },
                2028: { plan: 10, actual: null },
                2029: { plan: 11, actual: null },
                2030: { plan: 12, actual: null }
            }
        },
        {
            id: 'fee_income_share',
            name: 'Fee income share',
            unit: '%',
            description: 'Share of fee-based income in total CIB revenues',
            targetInfo: 'Diversifying revenue streams',
            type: 'higher_better',
            data: {
                2025: { plan: 27, actual: 27 },
                2026: { plan: 29, actual: 29 },
                2027: { plan: 31, actual: 31 },
                2028: { plan: 33, actual: null },
                2029: { plan: 35, actual: null },
                2030: { plan: 37, actual: null }
            }
        },
        {
            id: 'cross_sell_ratio',
            name: 'Cross-sell ratio',
            unit: 'x',
            description: 'Average number of products per active CIB client',
            targetInfo: 'Deepening client relationships',
            type: 'higher_better',
            data: {
                2025: { plan: 3.2, actual: 3.2 },
                2026: { plan: 3.4, actual: 3.4 },
                2027: { plan: 3.6, actual: 3.6 },
                2028: { plan: 3.8, actual: null },
                2029: { plan: 3.9, actual: null },
                2030: { plan: 4.0, actual: null }
            }
        },
        {
            id: 'sme_onboarding',
            name: 'SME onboarding time',
            unit: 'days',
            description: 'Average time to onboard a standard SME client',
            targetInfo: 'Fast and efficient onboarding',
            type: 'lower_better',
            data: {
                2025: { plan: 6, actual: 6 },
                2026: { plan: 5, actual: 5 },
                2027: { plan: 4, actual: 4 },
                2028: { plan: 3, actual: null },
                2029: { plan: 2.5, actual: null },
                2030: { plan: 2, actual: null }
            }
        },
        {
            id: 'nps_cib',
            name: 'Customer NPS (CIB)',
            unit: 'pts',
            description: 'Net Promoter Score for corporate and SME clients',
            targetInfo: 'Client-centric service model',
            type: 'higher_better',
            data: {
                2025: { plan: 33, actual: 33 },
                2026: { plan: 37, actual: 37 },
                2027: { plan: 41, actual: 41 },
                2028: { plan: 45, actual: null },
                2029: { plan: 48, actual: null },
                2030: { plan: 50, actual: null }
            }
        },
        {
            id: 'segment_cir',
            name: 'Segment cost-income ratio',
            unit: '%',
            description: 'Cost efficiency ratio specific to the CIB segment',
            targetInfo: 'Operational excellence',
            type: 'lower_better',
            data: {
                2025: { plan: 50, actual: 50 },
                2026: { plan: 49, actual: 49 },
                2027: { plan: 48, actual: 48 },
                2028: { plan: 47, actual: null },
                2029: { plan: 46, actual: null },
                2030: { plan: 45, actual: null }
            }
        },
        {
            id: 'transition_finance',
            name: 'Transition finance annual volume',
            unit: 'bn EUR',
            description: 'Annual new volume of transition finance originated',
            targetInfo: 'Supporting clients in green transition',
            type: 'higher_better',
            data: {
                2025: { plan: 1.0, actual: 1.0 },
                2026: { plan: 1.5, actual: 1.5 },
                2027: { plan: 2.0, actual: 2.0 },
                2028: { plan: 2.5, actual: null },
                2029: { plan: 2.9, actual: null },
                2030: { plan: 3.2, actual: null }
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
        },
        {
            id: 'incremental_revenue',
            name: 'Incremental payments revenue',
            unit: 'm EUR',
            description: 'Additional revenue from payments innovations vs 2023',
            targetInfo: 'New revenue streams from innovation',
            type: 'higher_better',
            data: {
                2025: { plan: 10, actual: 10 },
                2026: { plan: 30, actual: 30 },
                2027: { plan: 50, actual: 50 },
                2028: { plan: 70, actual: null },
                2029: { plan: 85, actual: null },
                2030: { plan: 100, actual: null }
            }
        },
        {
            id: 'mobile_active_customers',
            name: 'Mobile active customers',
            unit: '%',
            description: 'Share of payments customers using mobile wallet',
            targetInfo: 'Mobile-first payments',
            type: 'higher_better',
            data: {
                2025: { plan: 40, actual: 40 },
                2026: { plan: 50, actual: 50 },
                2027: { plan: 60, actual: 60 },
                2028: { plan: 70, actual: null },
                2029: { plan: 75, actual: null },
                2030: { plan: 80, actual: null }
            }
        },
        {
            id: 'mobile_wallet_rating',
            name: 'Mobile wallet rating',
            unit: '⭐',
            description: 'Customer rating of NLB Pay mobile wallet',
            targetInfo: 'Top-rated payment experience',
            type: 'higher_better',
            data: {
                2025: { plan: 4.5, actual: 4.5 },
                2026: { plan: 4.5, actual: 4.5 },
                2027: { plan: 4.5, actual: 4.5 },
                2028: { plan: 4.5, actual: null },
                2029: { plan: 4.5, actual: null },
                2030: { plan: 4.5, actual: null }
            }
        },
        {
            id: 'mobile_wallet_penetration',
            name: 'Mobile wallet penetration',
            unit: '%',
            description: 'Share of retail customers actively using mobile wallet',
            targetInfo: 'Broad adoption of digital wallets',
            type: 'higher_better',
            data: {
                2025: { plan: 15, actual: 15 },
                2026: { plan: 20, actual: 20 },
                2027: { plan: 25, actual: 25 },
                2028: { plan: 30, actual: null },
                2029: { plan: 35, actual: null },
                2030: { plan: 40, actual: null }
            }
        },
        {
            id: 'digitized_transactions',
            name: 'Digitized card transactions',
            unit: '%',
            description: 'Share of total card transactions processed digitally',
            targetInfo: 'Shift to digital transaction processing',
            type: 'higher_better',
            data: {
                2025: { plan: 5, actual: 5 },
                2026: { plan: 10, actual: 10 },
                2027: { plan: 15, actual: 15 },
                2028: { plan: 20, actual: null },
                2029: { plan: 22, actual: null },
                2030: { plan: 25, actual: null }
            }
        },
        {
            id: 'payments_partners',
            name: 'Payments partners',
            unit: '#',
            description: 'Number of strategic ecosystem partners in payments',
            targetInfo: 'Open ecosystem approach',
            type: 'higher_better',
            data: {
                2025: { plan: 6, actual: 6 },
                2026: { plan: 9, actual: 9 },
                2027: { plan: 12, actual: 12 },
                2028: { plan: 15, actual: null },
                2029: { plan: 18, actual: null },
                2030: { plan: 20, actual: null }
            }
        }
    ]
};
