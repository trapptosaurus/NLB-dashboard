import { kpiData } from './data.js';
import { createChart, generateChartData } from './charts.js';

// State
const state = {
    currentView: 'overall', // overall, group, retail, cib, payments
    isEditorMode: false,
    currentYear: 2027,
    sortByStatus: false,
    charts: {} // Store chart instances to update them
};

// DOM Elements
const kpiGrid = document.getElementById('kpi-grid');
const editorTableBody = document.getElementById('editor-table-body');
const viewButtons = document.querySelectorAll('.nav-btn[data-view]:not(.editor-btn)');
const editorButton = document.querySelector('.editor-btn');
const dashboardView = document.getElementById('dashboard-view');
const editorView = document.getElementById('editor-view');
const pageTitle = document.getElementById('page-title');
const currentDateDisplay = document.querySelector('.current-date');

// Helper: Determine status (On Track, Warning, Off Track)
function getStatus(kpi) {
    const yearData = kpi.data[state.currentYear];
    if (!yearData) return 'unknown';

    const actual = yearData.actual;
    const plan = yearData.plan;

    if (actual === null || actual === undefined) return 'unknown';

    // Calculate deviation
    // For higher_better: (Actual - Plan) / Plan
    // For lower_better: (Plan - Actual) / Plan

    let deviation = 0;
    if (plan !== 0) {
        if (kpi.type === 'higher_better') {
            deviation = (actual - plan) / plan;
        } else if (kpi.type === 'lower_better') {
            deviation = (plan - actual) / plan;
        } else {
            // Range: Check if within +/- 10% of plan (arbitrary for demo)
            const diff = Math.abs(actual - plan);
            const threshold = plan * 0.1;
            if (diff <= threshold) return 'on-track';
            // If outside range, check how far
            const dist = diff - threshold;
            if (dist < plan * 0.1) return 'warning';
            return 'off-track';
        }
    }

    if (kpi.type !== 'range') {
        if (deviation >= -0.02) return 'on-track'; // Allow small 2% miss
        if (deviation >= -0.10) return 'warning'; // Within 10% miss
        return 'off-track';
    }

    return 'unknown';
}

function getStatusLabel(status) {
    switch (status) {
        case 'on-track': return 'On Track';
        case 'warning': return 'Slightly Off';
        case 'off-track': return 'Off Track';
        case 'unknown': return 'No Data';
        default: return 'Unknown';
    }
}

function getStatusClass(status) {
    return `status-${status}`;
}

function getStatusIcon(status) {
    if (status === 'on-track') return '✓';
    if (status === 'warning') return '!';
    if (status === 'off-track') return '✕';
    return '-';
}

// Helper: Get Overall Stats
function getOverallStats() {
    const groups = ['group', 'retail', 'cib', 'payments'];
    const stats = {};

    groups.forEach(group => {
        const kpis = kpiData[group];
        let onTrack = 0;
        let total = 0;

        kpis.forEach(kpi => {
            if (getStatus(kpi) === 'on-track') onTrack++;
            total++;
        });

        stats[group] = { onTrack, total, percent: Math.round((onTrack / total) * 100) };
    });
    return stats;
}

// Render Overall Dashboard
function renderOverallDashboard() {
    kpiGrid.innerHTML = '';
    kpiGrid.classList.add('overall-grid'); // Add class for styling if needed

    const stats = getOverallStats();
    const groups = [
        { id: 'group', title: 'Group Strategy' },
        { id: 'retail', title: 'Retail Banking' },
        { id: 'cib', title: 'CIB' },
        { id: 'payments', title: 'Payments' }
    ];

    groups.forEach(g => {
        const stat = stats[g.id];
        const card = document.createElement('div');
        card.className = 'kpi-card overall-card';
        card.onclick = () => switchView(g.id); // Click to drill down
        card.style.cursor = 'pointer';

        card.innerHTML = `
            <div class="kpi-header">
                <h3>${g.title}</h3>
            </div>
            <div class="overall-stat">
                <div class="big-number">${stat.percent}%</div>
                <div class="stat-label">KPIs On Track</div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${stat.percent}%"></div>
            </div>
            <div class="stat-details">
                ${stat.onTrack} of ${stat.total} KPIs on track
            </div>
        `;
        kpiGrid.appendChild(card);
    });
}

// Render Dashboard
function renderDashboard() {
    // Update Current Year Display
    currentDateDisplay.innerHTML = `
        <label for="year-select">Current Year:</label>
        <select id="year-select">
            <option value="2025" ${state.currentYear === 2025 ? 'selected' : ''}>2025</option>
            <option value="2026" ${state.currentYear === 2026 ? 'selected' : ''}>2026</option>
            <option value="2027" ${state.currentYear === 2027 ? 'selected' : ''}>2027</option>
            <option value="2028" ${state.currentYear === 2028 ? 'selected' : ''}>2028</option>
            <option value="2029" ${state.currentYear === 2029 ? 'selected' : ''}>2029</option>
            <option value="2030" ${state.currentYear === 2030 ? 'selected' : ''}>2030</option>
        </select>
        <div class="sort-controls" style="margin-left: 20px; display: inline-block;">
             <label><input type="checkbox" id="sort-status" ${state.sortByStatus ? 'checked' : ''}> Sort by Status</label>
        </div>
    `;

    // Re-attach event listeners for the injected controls
    document.getElementById('year-select').addEventListener('change', (e) => {
        state.currentYear = parseInt(e.target.value);
        renderDashboard(); // Re-render to update values and statuses
    });
    document.getElementById('sort-status').addEventListener('change', (e) => {
        state.sortByStatus = e.target.checked;
        renderDashboard();
    });

    if (state.currentView === 'overall') {
        renderOverallDashboard();
        return;
    }

    kpiGrid.innerHTML = '';
    kpiGrid.classList.remove('overall-grid');
    state.charts = {}; // Reset charts

    let kpis = [...kpiData[state.currentView]];

    // Sorting
    if (state.sortByStatus) {
        kpis.sort((a, b) => {
            const statusOrder = { 'off-track': 0, 'warning': 1, 'on-track': 2, 'unknown': 3 };
            return statusOrder[getStatus(a)] - statusOrder[getStatus(b)];
        });
    }

    kpis.forEach(kpi => {
        const status = getStatus(kpi);
        const yearData = kpi.data[state.currentYear];
        const actual = yearData ? yearData.actual : '-';
        const plan = yearData ? yearData.plan : '-';
        const target2030 = kpi.data[2030].plan;

        const card = document.createElement('div');
        card.className = 'kpi-card';
        card.innerHTML = `
            <div class="kpi-header">
                <div class="kpi-title">
                    <h3>${kpi.name}</h3>
                    <span class="kpi-unit">${kpi.unit}</span>
                </div>
                <div class="kpi-status ${getStatusClass(status)}">
                    <span>${getStatusIcon(status)}</span> ${getStatusLabel(status)}
                </div>
            </div>
            
            <div class="kpi-stats">
                <div class="stat-item">
                    <span class="stat-label">${state.currentYear} Actual</span>
                    <span class="stat-value">${actual !== null ? actual : '-'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${state.currentYear} Plan</span>
                    <span class="stat-value target">${plan}</span>
                </div>
                 <div class="stat-item">
                    <span class="stat-label">2030 Target</span>
                    <span class="stat-value target">${target2030}</span>
                </div>
            </div>
            
            <div class="chart-container">
                <canvas id="chart-${kpi.id}"></canvas>
            </div>
            
            <div class="kpi-footer">
                <strong>Strategy:</strong> ${kpi.targetInfo}
            </div>
        `;

        kpiGrid.appendChild(card);

        // Initialize Chart
        state.charts[kpi.id] = createChart(`chart-${kpi.id}`, kpi, state.currentYear);
    });
}

// Render Editor
function renderEditor() {
    // Inject Current Year selector for Editor too
    const editorHeader = document.querySelector('.editor-container h3');
    if (!document.getElementById('editor-year-select')) {
        // This is a bit hacky, but simple for now. 
        // Ideally we'd have a dedicated toolbar in the editor.
    }

    editorTableBody.innerHTML = '';
    const kpis = kpiData[state.currentView === 'overall' ? 'group' : state.currentView]; // Default to group if overall

    // Header for Editor
    const thead = document.querySelector('.editor-table thead tr');
    thead.innerHTML = `
        <th>KPI Name</th>
        <th>Status (${state.currentYear})</th>
        ${[2025, 2026, 2027, 2028, 2029, 2030].map(y => `<th>${y}<br><span style="font-size:0.8em; font-weight:normal">Plan | Act</span></th>`).join('')}
    `;

    kpis.forEach(kpi => {
        const row = document.createElement('tr');
        const status = getStatus(kpi);

        let cells = `
            <td>
                <div class="kpi-name-cell">${kpi.name}</div>
                <div class="kpi-desc-cell">${kpi.unit}</div>
            </td>
            <td><span class="kpi-status ${getStatusClass(status)}">${getStatusLabel(status)}</span></td>
        `;

        [2025, 2026, 2027, 2028, 2029, 2030].forEach(year => {
            const d = kpi.data[year] || { plan: 0, actual: 0 };
            cells += `
                <td>
                    <div class="input-cell-wrapper">
                        <input type="number" step="0.01" class="input-plan" value="${d.plan}" data-id="${kpi.id}" data-year="${year}" data-field="plan" placeholder="Plan">
                        <input type="number" step="0.01" class="input-actual" value="${d.actual !== null ? d.actual : ''}" data-id="${kpi.id}" data-year="${year}" data-field="actual" placeholder="Act">
                    </div>
                </td>
            `;
        });

        row.innerHTML = cells;
        editorTableBody.appendChild(row);
    });

    // Add event listeners
    const inputs = editorTableBody.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const year = parseInt(e.target.dataset.year);
            const field = e.target.dataset.field;
            let val = e.target.value === '' ? null : parseFloat(e.target.value);

            const kpi = kpis.find(k => k.id === id);
            if (kpi) {
                if (!kpi.data[year]) kpi.data[year] = {};
                kpi.data[year][field] = val;

                // Update status cell immediately
                const statusCell = e.target.closest('tr').children[1];
                const newStatus = getStatus(kpi);
                statusCell.innerHTML = `<span class="kpi-status ${getStatusClass(newStatus)}">${getStatusLabel(newStatus)}</span>`;
            }
        });
    });
}

// Switch View
function switchView(viewName) {
    state.currentView = viewName;
    state.isEditorMode = false;

    // Update UI
    viewButtons.forEach(btn => {
        if (btn.dataset.view === viewName) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    // Add active class to Overall button if needed (we need to add it to HTML first)
    const overallBtn = document.querySelector('.nav-btn[data-view="overall"]');
    if (overallBtn) {
        if (viewName === 'overall') overallBtn.classList.add('active');
        else overallBtn.classList.remove('active');
    }

    editorButton.classList.remove('active');

    dashboardView.classList.add('active');
    editorView.classList.remove('active');

    // Update Title
    const titleMap = {
        'overall': 'Overall Dashboard',
        'group': 'Group Strategy KPIs',
        'retail': 'Retail Banking KPIs',
        'cib': 'Corporate & Investment Banking KPIs',
        'payments': 'Payments KPIs'
    };
    pageTitle.textContent = titleMap[viewName];

    renderDashboard();
}

function toggleEditor() {
    state.isEditorMode = true;

    viewButtons.forEach(btn => btn.classList.remove('active'));
    editorButton.classList.add('active');

    dashboardView.classList.remove('active');
    editorView.classList.add('active');

    pageTitle.textContent = 'Data Editor';

    renderEditor();
}

// Event Listeners
viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchView(btn.dataset.view);
    });
});

editorButton.addEventListener('click', toggleEditor);

// Initial Render
switchView('overall');
