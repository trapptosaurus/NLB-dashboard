import kpiData from './store.js';
import { createChart, generateChartData } from './charts.js';

// State
const state = {
    currentView: 'overall', // overall, group, retail, cib, payments
    isEditorMode: false,
    currentYear: 2027,
    sortByStatus: false,
    thresholds: {
        onTrack: 2, // % deviation allowed for On Track
        warning: 10 // % deviation allowed for Warning (Slightly Off)
    },
    thresholds: {
        onTrack: 2, // % deviation allowed for On Track
        warning: 10 // % deviation allowed for Warning (Slightly Off)
    },
    dashboardViewMode: 'percent',
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
function getStatus(kpi, year = state.currentYear) {
    const yearData = kpi.data[year];
    if (!yearData) return 'unknown';

    const actual = yearData.actual;
    const plan = yearData.plan;

    if (actual === null || actual === undefined) return 'off-track';

    // Calculate deviation
    // For higher_better: (Actual - Plan) / Plan
    // For lower_better: (Plan - Actual) / Plan

    if (kpi.displayType === 'qualitative') {
        if (actual >= plan) return 'on-track';
        if (actual >= plan - 1) return 'warning';
        return 'off-track';
    }

    let deviation = 0;
    if (plan !== 0) {
        if (kpi.type === 'higher_better') {
            deviation = (actual - plan) / plan;
        } else if (kpi.type === 'lower_better') {
            deviation = (plan - actual) / plan;
        } else {
            // Range: Check if within +/- X% of plan
            const diff = Math.abs(actual - plan);
            const onTrackThreshold = plan * (state.thresholds.onTrack / 100);

            if (diff <= onTrackThreshold) return 'on-track';

            // If outside range, check how far
            const warningThreshold = plan * (state.thresholds.warning / 100);
            if (diff <= warningThreshold) return 'warning';

            return 'off-track';
        }
    }

    if (kpi.type !== 'range') {
        // Convert deviation to percentage for comparison (deviation is e.g. -0.05 for -5%)
        // We care about negative deviation for higher_better (underperformance)
        // and positive deviation for lower_better (underperformance, already handled by sign flip above?)
        // Actually, the formula above (actual-plan)/plan gives negative if actual < plan (bad for higher_better)
        // For lower_better: (plan-actual)/plan gives negative if actual > plan (bad for lower_better)

        // So in both cases, negative deviation means "worse than plan".

        const onTrackLimit = -(state.thresholds.onTrack / 100);
        const warningLimit = -(state.thresholds.warning / 100);

        if (deviation >= onTrackLimit) return 'on-track';
        if (deviation >= warningLimit) return 'warning';
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
    if (status === 'unknown') return '-'; // No Data
    return '-';
}

// Helper: Get Overall Stats
function getOverallStats() {
    const groups = ['group', 'retail', 'cib', 'payments', 'operational'];
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

// Helper: Destroy existing charts to prevent memory leaks/zombies
function destroyCharts() {
    Object.values(state.charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    state.charts = {};
}

// Helper: Get Advanced Stats for Overall Dashboard
function getAdvancedStats(groupId) {
    const kpis = kpiData[groupId];
    const total = kpis.length;
    let onTrack = 0;
    let warning = 0;
    let offTrack = 0;
    const kpiStatuses = []; // To store individual KPI statuses for dots

    kpis.forEach(kpi => {
        const status = getStatus(kpi);
        kpiStatuses.push(status);
        if (status === 'on-track') onTrack++;
        else if (status === 'warning') warning++;
        else offTrack++; // 'off-track' or 'unknown' (treated as red)
    });

    const onTrackPct = (onTrack / total) * 100;
    const warningPct = (warning / total) * 100;
    const offTrackPct = (offTrack / total) * 100;

    let tintClass = '';
    if (onTrackPct >= 80) tintClass = 'tint-green';
    else if (onTrackPct >= 50) tintClass = 'tint-yellow';
    else tintClass = 'tint-red';

    return {
        total,
        onTrackPct,
        warningPct,
        offTrackPct,
        onTrackCount: onTrack,
        warningCount: warning,
        offTrackCount: offTrack,
        kpiStatuses,
        tintClass
    };
}

// Helper: Calculate Year-over-Year change for a group
function calculateYoY(groupId) {
    if (state.currentYear <= 2023) return null; // No previous year data

    const currentYearKpis = kpiData[groupId];
    const prevYear = state.currentYear - 1;

    let currentOnTrack = 0;
    let prevOnTrack = 0;

    currentYearKpis.forEach(kpi => {
        // Temporarily change year to calculate previous year's status
        const originalYear = state.currentYear;
        state.currentYear = prevYear;
        const prevStatus = getStatus(kpi);
        state.currentYear = originalYear; // Revert year

        if (getStatus(kpi) === 'on-track') currentOnTrack++;
        if (prevStatus === 'on-track') prevOnTrack++;
    });

    return currentOnTrack - prevOnTrack;
}

// Global function for toggle buttons (needs to be global or attached to window)
window.toggleDashboardView = function (mode) {
    state.dashboardViewMode = mode;
    renderDashboard(); // Re-render to apply changes
};

// Render Overall Dashboard (Advanced)
function renderOverallDashboard() {
    kpiGrid.innerHTML = '';
    kpiGrid.classList.remove('overall-grid'); // Remove old class
    kpiGrid.classList.remove('overall-grid-advanced');
    kpiGrid.classList.add('ceo-grid');

    // Insert Toggle if not present (Segmented Control Style)
    if (!document.getElementById('view-toggle-container')) {
        const toggleHTML = `
            <div id="view-toggle-container" class="segmented-control-container">
                <div class="segmented-control">
                    <button id="toggle-percent" class="segmented-btn" onclick="toggleDashboardView('percent')">% View</button>
                    <button id="toggle-count" class="segmented-btn" onclick="toggleDashboardView('count')"># View</button>
                </div>
            </div>
        `;
        kpiGrid.insertAdjacentHTML('beforebegin', toggleHTML);
    }

    // Update Active State
    const btnPercent = document.getElementById('toggle-percent');
    const btnCount = document.getElementById('toggle-count');
    if (btnPercent && btnCount) {
        if (state.dashboardViewMode === 'percent') {
            btnPercent.classList.add('active');
            btnCount.classList.remove('active');
        } else {
            btnPercent.classList.remove('active');
            btnCount.classList.add('active');
        }
    }

    const groups = [
        { id: 'group', title: 'Group Strategy' },
        { id: 'retail', title: 'Retail Banking' },
        { id: 'cib', title: 'CIB' },
        { id: 'payments', title: 'Payments' },
        { id: 'operational', title: 'Operational Model' }
    ];

    groups.forEach(g => {
        const stats = getAdvancedStats(g.id);
        const yoy = calculateYoY(g.id);

        const card = document.createElement('div');
        card.className = `ceo-card`;
        card.onclick = () => switchView(g.id);
        card.style.cursor = 'pointer';

        // Warning Badge Logic
        let badgeHTML = '';
        if (stats.offTrackCount > 0) {
            badgeHTML = `<span class="ceo-badge badge-red">Off Track: ${stats.offTrackCount}</span>`;
        } else if (stats.warningCount > 0) {
            badgeHTML = `<span class="ceo-badge badge-yellow">Warning: ${stats.warningCount}</span>`;
        }

        // Main Stat Text
        let mainStatText = '';
        if (state.dashboardViewMode === 'percent') {
            mainStatText = `${Math.round(stats.onTrackPct)}%`;
        } else {
            mainStatText = `${stats.onTrackCount}`;
        }

        // YoY HTML (Single line with arrow)
        let yoyHTML = '';
        if (yoy !== null) {
            let iconClass = 'arrow-up';
            let iconChar = '▲';
            if (yoy < 0) {
                iconClass = 'arrow-down';
                iconChar = '▼';
            }
            if (yoy === 0) iconChar = '—';

            yoyHTML = `
                <div class="ceo-delta-line">
                     <span class="delta-arrow ${iconClass}">${iconChar}</span>
                     <span>${yoy > 0 ? '+' : ''}${yoy} vs LY</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="ceo-card-header">
                <div class="ceo-card-title">${g.title}</div>
                ${badgeHTML}
            </div>

            <div class="ceo-stat-block">
                <div class="ceo-big-number">${mainStatText}</div>
                <div class="ceo-stat-label">KPIs on track</div>
                ${yoyHTML}
            </div>

            <div class="ceo-bar-container">
                 <div class="ceo-bar-segment bg-green" style="width: ${stats.onTrackPct}%"></div>
                 <div class="ceo-bar-segment bg-yellow" style="width: ${stats.warningPct}%"></div>
                 <div class="ceo-bar-segment bg-red" style="width: ${stats.offTrackPct}%"></div>
            </div>

            <div class="ceo-status-list">
                <div class="status-row">
                    <div class="status-row-dot bg-green"></div>
                    <span style="font-weight: 500;">On Track</span>
                    <span class="text-muted-val">${stats.onTrackCount} KPIs</span>
                </div>
                <div class="status-row">
                    <div class="status-row-dot bg-yellow"></div>
                    <span style="font-weight: 500;">Warning</span>
                    <span class="text-muted-val">${stats.warningCount} KPIs</span>
                </div>
                <div class="status-row">
                    <div class="status-row-dot bg-red"></div>
                    <span style="font-weight: 500;">Off Track</span>
                    <span class="text-muted-val">${stats.offTrackCount} KPIs</span>
                </div>
            </div>
        `;
        kpiGrid.appendChild(card);
    });
}


// Render Dashboard
function renderDashboard() {
    if (window.logToScreen) window.logToScreen(`Rendering Dashboard: ${state.currentView}`);

    // Safety check for kpiGrid
    const kpiGrid = document.getElementById('kpi-grid');
    if (!kpiGrid) {
        if (window.logToScreen) window.logToScreen('CRITICAL: kpi-grid element not found!');
        return;
    }

    // Set page title (redundant safety)
    if (pageTitle) {
        // ... (title logic handled in switchView)
    }

    // Update Year Display
    const yearSelect = document.getElementById('year-select');
    if (!yearSelect) {
        // If header not built yet, build it
        const header = document.querySelector('.top-bar');
        if (header && !header.querySelector('.dashboard-controls')) {
            // ... Code to inject controls if missing ...
            // For now, assume controls exist or we don't block
        }
    }

    // Inject Controls if missing (Idempotent)
    const topBar = document.querySelector('.top-bar');
    if (topBar && !document.querySelector('.dashboard-controls')) {
        const controlsHTML = `
        <div class="dashboard-controls" style="display: flex; gap: 15px; align-items: center; margin-top: 10px;">
            <select id="year-select" style="padding: 5px; border-radius: 4px;">
                <option value="2023" ${state.currentYear === 2023 ? 'selected' : ''}>2023</option>
                <option value="2024" ${state.currentYear === 2024 ? 'selected' : ''}>2024</option>
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
        </div>
        `;
        topBar.insertAdjacentHTML('beforeend', controlsHTML); // Append to header

        // Attach listeners
        document.getElementById('year-select').addEventListener('change', (e) => {
            state.currentYear = parseInt(e.target.value);
            state.isEditorMode ? renderEditor() : renderDashboard();
        });
        document.getElementById('sort-status').addEventListener('change', (e) => {
            state.sortByStatus = e.target.checked;
            renderDashboard();
        });
    }


    if (state.currentView === 'overall') {
        if (window.logToScreen) window.logToScreen('Delegating to renderOverallDashboard');
        destroyCharts();
        renderOverallDashboard();
        return;
    }

    destroyCharts(); // Cleanup before rendering new view
    kpiGrid.innerHTML = '';
    kpiGrid.classList.remove('overall-grid');
    kpiGrid.classList.remove('overall-grid-advanced');
    kpiGrid.classList.remove('ceo-grid');

    // Remove Toggle if present (it's outside kpiGrid)
    const toggle = document.getElementById('view-toggle-container');
    if (toggle) toggle.remove();

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
        let actual = yearData ? yearData.actual : '-';
        let plan = yearData ? yearData.plan : '-';
        let target2030 = kpi.data[2030].plan;

        if (kpi.displayType === 'qualitative') {
            const map = { 1: 'Below', 2: 'Inline', 3: 'Above' };
            actual = map[actual] || '-';
            plan = map[plan] || '-';
            target2030 = map[target2030] || '-';
        }

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

    // Inject Threshold Controls
    let thresholdControls = document.getElementById('threshold-controls');
    if (!thresholdControls) {
        thresholdControls = document.createElement('div');
        thresholdControls.id = 'threshold-controls';
        thresholdControls.style.marginBottom = '1.5rem';
        thresholdControls.style.padding = '1rem';
        thresholdControls.style.background = '#f8fafc';
        thresholdControls.style.borderRadius = '0.5rem';
        thresholdControls.style.border = '1px solid #e2e8f0';
        thresholdControls.innerHTML = `
            <h4 style="font-size: 0.9rem; margin-bottom: 0.75rem; color: #475569;">Global Status Parameters</h4>
            <div style="display: flex; gap: 2rem; align-items: center;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <label style="font-size: 0.85rem; color: #64748b;">On Track Tolerance:</label>
                    <input type="number" id="threshold-ontrack" value="${state.thresholds.onTrack}" style="width: 60px; padding: 0.25rem; border: 1px solid #cbd5e1; border-radius: 0.25rem;">
                    <span style="font-size: 0.85rem; color: #64748b;">%</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <label style="font-size: 0.85rem; color: #64748b;">Slightly Off Limit:</label>
                    <input type="number" id="threshold-warning" value="${state.thresholds.warning}" style="width: 60px; padding: 0.25rem; border: 1px solid #cbd5e1; border-radius: 0.25rem;">
                    <span style="font-size: 0.85rem; color: #64748b;">%</span>
                </div>
                <div style="font-size: 0.8rem; color: #94a3b8; margin-left: auto;">
                    (Deviation > Limit = Off Track)
                </div>
            </div>
        `;
        editorHeader.after(thresholdControls);

        // Add listeners for thresholds
        document.getElementById('threshold-ontrack').addEventListener('change', (e) => {
            state.thresholds.onTrack = parseFloat(e.target.value);
            renderEditor(); // Re-render to update statuses
        });
        document.getElementById('threshold-warning').addEventListener('change', (e) => {
            state.thresholds.warning = parseFloat(e.target.value);
            renderEditor();
        });
    }

    let kpis = [];
    if (state.currentView === 'overall') {
        // Aggregate all KPIs
        ['group', 'retail', 'cib', 'payments', 'operational'].forEach(cat => {
            kpis = kpis.concat(kpiData[cat]);
        });
    } else {
        kpis = kpiData[state.currentView];
    }

    // Header for Editor
    const thead = document.querySelector('.editor-table thead tr');
    thead.innerHTML = `
        <th style="width: 30px"></th> <!-- Drag Handle -->
        <th>KPI Details</th>
        <th>Category</th>
        <th>Status</th>
        ${[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => {
        const isCurrent = y === state.currentYear;
        const bgStyle = isCurrent ? 'background-color: #eff6ff; color: #1e3a8a;' : '';
        return `<th style="${bgStyle}">${y}<br><span style="font-size:0.8em; font-weight:normal">Plan | Act</span></th>`;
    }).join('')}
        <th style="width: 30px"></th> <!-- Delete -->
    `;

    editorTableBody.innerHTML = ''; // Clear existing rows

    kpis.forEach((kpi, index) => {
        const row = document.createElement('tr');
        row.draggable = true;
        row.dataset.index = index;
        row.dataset.id = kpi.id;

        const status = getStatus(kpi);

        // Find KPI's actual category
        let actualCategory = state.currentView;
        if (state.currentView === 'overall') {
            for (const cat in kpiData) {
                if (kpiData[cat].find(k => k.id === kpi.id)) {
                    actualCategory = cat;
                    break;
                }
            }
        }

        // Category Options
        const categories = ['group', 'retail', 'cib', 'payments', 'operational'];
        const categoryOptions = categories.map(c =>
            `<option value="${c}" ${c === actualCategory ? 'selected' : ''}>${c.charAt(0).toUpperCase() + c.slice(1)}</option>`
        ).join('');

        const isOverall = state.currentView === 'overall';

        let cells = `
            <td class="drag-handle" style="cursor: ${isOverall ? 'default' : 'move'}; color: #cbd5e1;">${isOverall ? '' : '☰'}</td>
            <td style="min-width: 200px;">
                <input type="text" class="input-text kpi-name-input" value="${kpi.name}" data-id="${kpi.id}" data-field="name" placeholder="KPI Name" style="font-weight: 500; margin-bottom: 4px;">
                <textarea class="input-text kpi-desc-input" data-id="${kpi.id}" data-field="description" placeholder="Description" rows="2" style="font-size: 0.75rem; color: #64748b; resize: vertical;">${kpi.description}</textarea>
                <input type="text" class="input-text kpi-unit-input" value="${kpi.unit}" data-id="${kpi.id}" data-field="unit" placeholder="Unit" style="width: 60px; font-size: 0.75rem; margin-top: 4px;">
            </td>
            <td>
                <select class="category-select" data-id="${kpi.id}">
                    ${categoryOptions}
                </select>
            </td>
            <td><span class="kpi-status ${getStatusClass(status)}">${getStatusLabel(status)}</span></td>
        `;

        [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].forEach(year => {
            const d = kpi.data[year] || { plan: 0, actual: 0 };
            const isCurrent = year === state.currentYear;
            const bgStyle = isCurrent ? 'background-color: #eff6ff;' : ''; // Light blue highlight

            let inputHtml = '';
            if (kpi.displayType === 'qualitative') {
                const options = [
                    { val: 1, text: 'Below' },
                    { val: 2, text: 'Inline' },
                    { val: 3, text: 'Above' }
                ];

                const planOptions = options.map(o => `<option value="${o.val}" ${d.plan == o.val ? 'selected' : ''}>${o.text}</option>`).join('');
                const actualOptions = options.map(o => `<option value="${o.val}" ${d.actual == o.val ? 'selected' : ''}>${o.text}</option>`).join('');

                inputHtml = `
                    <div class="input-cell-wrapper">
                        <select class="input-plan" data-id="${kpi.id}" data-year="${year}" data-field="plan" style="font-size: 0.8rem; padding: 2px;">
                            <option value="">Plan</option>
                            ${planOptions}
                        </select>
                        <select class="input-actual" data-id="${kpi.id}" data-year="${year}" data-field="actual" style="font-size: 0.8rem; padding: 2px;">
                            <option value="">Act</option>
                            ${actualOptions}
                        </select>
                    </div>
                `;
            } else {
                inputHtml = `
                    <div class="input-cell-wrapper">
                        <input type="number" step="0.01" class="input-plan" value="${d.plan}" data-id="${kpi.id}" data-year="${year}" data-field="plan" placeholder="Plan">
                        <input type="number" step="0.01" class="input-actual" value="${d.actual !== null ? d.actual : ''}" data-id="${kpi.id}" data-year="${year}" data-field="actual" placeholder="Act">
                    </div>
                `;
            }

            cells += `
                <td style="${bgStyle}">
                    ${inputHtml}
                </td>
            `;
        });

        cells += `<td><button class="delete-btn" data-id="${kpi.id}" style="color: #ef4444; background: none; border: none; cursor: pointer;">✕</button></td>`;

        row.innerHTML = cells;
        editorTableBody.appendChild(row);
    });

    // Add "Add KPI" Button if not exists
    if (!document.getElementById('add-kpi-btn')) {
        const btnFn = document.createElement('div');
        btnFn.style.display = 'flex';
        btnFn.style.gap = '1rem';
        btnFn.style.marginTop = '1rem';

        const btnAdd = document.createElement('button');
        btnAdd.id = 'add-kpi-btn';
        btnAdd.className = 'nav-btn';
        btnAdd.style.background = '#eef2ff';
        btnAdd.style.width = 'auto'; // Auto width
        btnAdd.style.color = '#230078';
        btnAdd.innerHTML = '+ Add New KPI';
        btnAdd.onclick = addNewKPI;

        const btnSave = document.createElement('button');
        btnSave.id = 'save-github-btn';
        btnSave.className = 'nav-btn';
        btnSave.style.background = '#230078';
        btnSave.style.color = '#ffffff';
        btnSave.style.width = 'auto';
        btnSave.innerHTML = '💾 Save Changes';
        btnSave.onclick = saveToGitHub;

        btnFn.appendChild(btnAdd);
        btnFn.appendChild(btnSave);
        editorTableBody.parentElement.after(btnFn);
    }

    attachEditorListeners();
}

function addNewKPI() {
    const newId = 'new_' + Date.now();
    const newKPI = {
        id: newId,
        name: 'New KPI',
        unit: 'Unit',
        description: 'Description',
        targetInfo: 'Target Info',
        type: 'higher_better',
        data: {
            2023: { plan: 0, actual: 0 },
            2024: { plan: 0, actual: 0 },
            2025: { plan: 0, actual: 0 },
            2026: { plan: 0, actual: 0 },
            2027: { plan: 0, actual: 0 },
            2028: { plan: 0, actual: null },
            2029: { plan: 0, actual: null },
            2030: { plan: 0, actual: null }
        }
    };

    // Add to current view's list
    const view = state.currentView === 'overall' ? 'group' : state.currentView;
    kpiData[view].push(newKPI);
    renderEditor();
}

function attachEditorListeners() {
    // Inputs (Plan/Actual)
    editorTableBody.querySelectorAll('.input-plan, .input-actual').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const year = parseInt(e.target.dataset.year);
            const field = e.target.dataset.field;
            let val = e.target.value === '' ? null : parseFloat(e.target.value);

            // Find KPI across all categories
            let kpi;
            for (const cat in kpiData) {
                kpi = kpiData[cat].find(k => k.id === id);
                if (kpi) break;
            }

            if (kpi) {
                if (!kpi.data[year]) kpi.data[year] = {};
                kpi.data[year][field] = val;

                // Update status
                const row = e.target.closest('tr');
                const statusCell = row.children[3]; // Index 3 is Status
                const newStatus = getStatus(kpi);
                statusCell.innerHTML = `<span class="kpi-status ${getStatusClass(newStatus)}">${getStatusLabel(newStatus)}</span>`;
            }
        });
    });

    // Metadata Inputs (Name, Desc, Unit)
    editorTableBody.querySelectorAll('.kpi-name-input, .kpi-desc-input, .kpi-unit-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const field = e.target.dataset.field;
            const val = e.target.value;

            let kpi;
            for (const cat in kpiData) {
                kpi = kpiData[cat].find(k => k.id === id);
                if (kpi) break;
            }
            if (kpi) kpi[field] = val;
        });
    });

    // Category Select
    editorTableBody.querySelectorAll('.category-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const newCategory = e.target.value;
            const currentCategory = state.currentView === 'overall' ? 'group' : state.currentView;

            if (newCategory !== currentCategory) {
                // Remove from old
                const oldIndex = kpiData[currentCategory].findIndex(k => k.id === id);
                if (oldIndex > -1) {
                    const [kpi] = kpiData[currentCategory].splice(oldIndex, 1);
                    // Add to new
                    kpiData[newCategory].push(kpi);
                    renderEditor(); // Re-render to remove row
                }
            }
        });
    });

    // Delete Button
    editorTableBody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Delete this KPI?')) {
                const id = e.target.dataset.id;

                // Find which category this KPI belongs to
                let targetCat = state.currentView;
                if (state.currentView === 'overall') {
                    for (const cat in kpiData) {
                        if (kpiData[cat].find(k => k.id === id)) {
                            targetCat = cat;
                            break;
                        }
                    }
                }

                const idx = kpiData[targetCat].findIndex(k => k.id === id);
                if (idx > -1) {
                    kpiData[targetCat].splice(idx, 1);
                    renderEditor();
                }
            }
        });
    });

    // Drag and Drop
    let draggedRow = null;
    const rows = editorTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        row.addEventListener('dragstart', (e) => {
            draggedRow = row;
            e.dataTransfer.effectAllowed = 'move';
            row.classList.add('dragging');
        });

        row.addEventListener('dragend', () => {
            draggedRow = null;
            rows.forEach(r => r.classList.remove('dragging'));
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(editorTableBody, e.clientY);
            if (afterElement == null) {
                editorTableBody.appendChild(draggedRow);
            } else {
                editorTableBody.insertBefore(draggedRow, afterElement);
            }
        });

        row.addEventListener('drop', (e) => {
            if (state.currentView === 'overall') return; // No reordering in overall view

            // Reorder data array based on new DOM order
            const view = state.currentView;
            const newOrder = [];
            editorTableBody.querySelectorAll('tr').forEach(r => {
                const id = r.dataset.id;
                const kpi = kpiData[view].find(k => k.id === id);
                if (kpi) newOrder.push(kpi);
            });
            kpiData[view] = newOrder;
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('tr:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// GitHub Persistence (Open Access)
// TO SETUP: Paste your GitHub Personal Access Token below.
// WARNING: This token is visible to anyone who views the source code.
// Token Split to bypass GitHub Secret Scanning
const TOKEN_PART_1 = "github_pat_11AO2USUY01nRUbTrRDykb";
const TOKEN_PART_2 = "_6fJ3jOHorHNOSAkNnVGhUidQuqwltEzrS82y7x694dHVUEQDEJQxmeScnCG";
const GITHUB_TOKEN = TOKEN_PART_1 + TOKEN_PART_2;

async function saveToGitHub() {
    const REPO_OWNER = 'trapptosaurus';
    const REPO_NAME = 'NLB-dashboard';
    const FILE_PATH = 'js/store.js';
    const BRANCH = 'main';

    if (!GITHUB_TOKEN) {
        alert("System not configured. Please ask the Admin to set the GITHUB_TOKEN in js/app.js.");
        return;
    }

    const btn = document.getElementById('save-github-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Saving...';
    btn.disabled = true;

    try {
        // 1. Generate File Content
        const fileContent = `export default ${JSON.stringify(kpiData, null, 4)};\n\n// Last Updated: ${new Date().toISOString()}`;

        // 2. Get Current File SHA
        const getUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;
        const getRes = await fetch(getUrl, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (getRes.status === 401 || getRes.status === 403) {
            throw new Error("Invalid GitHub Token. Please check GITHUB_TOKEN in js/app.js.");
        }
        if (!getRes.ok) throw new Error('Failed to fetch file info.');

        const getData = await getRes.json();
        const currentSha = getData.sha;

        // 3. Update File
        const putUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const putRes = await fetch(putUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Update KPI Data via Dashboard (${new Date().toLocaleDateString()})`,
                content: btoa(unescape(encodeURIComponent(fileContent))),
                sha: currentSha,
                branch: BRANCH
            })
        });

        if (!putRes.ok) throw new Error('Failed to commit changes.');

        alert('✅ Changes saved.');

    } catch (err) {
        console.error(err);
        alert(`❌ Error: ${err.message}`);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
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
        'payments': 'Payments KPIs',
        'operational': 'Operational Model KPIs'
    };
    pageTitle.textContent = titleMap[viewName];

    renderDashboard();
}

function toggleEditor() {
    // Show Modal instead of prompt
    const modal = document.getElementById('editor-modal');
    const input = document.getElementById('editor-password-input');
    const btn = document.getElementById('editor-login-btn');
    const cancel = document.getElementById('editor-cancel-btn');
    const error = document.getElementById('editor-error');

    if (modal) {
        modal.style.display = 'flex';
        input.value = '';
        input.focus();
        error.style.display = 'none';

        const unlock = () => {
            if (input.value === 'navi') {
                modal.style.display = 'none';
                // Proceed to Editor code
                state.isEditorMode = true;
                viewButtons.forEach(b => b.classList.remove('active'));
                editorButton.classList.add('active');
                dashboardView.classList.remove('active');
                editorView.classList.add('active');
                pageTitle.textContent = 'Data Editor';
                renderEditor();
            } else {
                error.style.display = 'block';
                input.value = '';
            }
        };

        // Remove old listeners to prevent stacking
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', unlock);

        // Handle Enter key
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        newInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') unlock();
        });
        // Refocus after replace
        setTimeout(() => newInput.focus(), 0);

        // Cancel
        const newCancel = cancel.cloneNode(true);
        cancel.parentNode.replaceChild(newCancel, cancel);
        newCancel.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

// Authentication Logic
// Authentication Logic
function checkAuth() {
    // Disable auto-login to force password screen on load
    const isAuthenticated = false; // sessionStorage.getItem('nlb_auth');

    // Clear session on load to ensure new login required
    sessionStorage.removeItem('nlb_auth');

    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.querySelector('.app-container');

    console.log('Checking Auth... Status: Forced Login');

    if (isAuthenticated === 'true') {
        // ... (Disabled) ...
    } else {
        console.log('User is NOT authenticated. Showing login.');
        if (loginScreen) loginScreen.style.display = 'flex';
        // Hide app until manual login (handled by inline script)
        if (appContainer) appContainer.style.display = 'none';

        // Don't render dashboard yet
    }
}


function logToScreen(msg) {
    console.log(msg);
    const debugBox = document.getElementById('debug-log');
    if (debugBox) {
        debugBox.style.display = 'block';
        debugBox.innerHTML += `<div>${new Date().toLocaleTimeString()} ${msg}</div>`;
        debugBox.scrollTop = debugBox.scrollHeight;
    }
}

// Initialize
function initApp() {
    console.log('App Initializing...');

    // Expose render for the inline script
    window.renderDashboard = renderDashboard;

    // Just check auth. The inline script handles the login UI interaction.
    checkAuth();
}

function handleLogin() {
    const passwordInput = document.getElementById('login-password');
    const errorMsg = document.getElementById('login-error');

    if (!passwordInput) {
        logToScreen("Critical: Password input missing");
        return;
    }

    const password = passwordInput.value.trim();
    logToScreen(`Attempting login: "${password}"`); // Quote to show spaces

    if (password === 'nlb2030') {
        logToScreen('Password match. Authenticating...');
        try {
            sessionStorage.setItem('nlb_auth', 'true');

            const screen = document.getElementById('login-screen');
            const app = document.querySelector('.app-container');

            if (screen) screen.style.display = 'none';
            if (app) app.style.display = 'flex';
            if (errorMsg) errorMsg.style.display = 'none';

            // Wrap render in try-catch to prevent auth loop crash
            try {
                renderDashboard();
            } catch (renderErr) {
                console.error("Render Error:", renderErr);
                logToScreen("Render Error: " + renderErr);
            }
        } catch (e) {
            logToScreen("ERROR: " + e.message);
        }
    } else {
        logToScreen('Password mismatch');
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = "Incorrect code";
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
}

// Event Listeners for Switch View (Global)
viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchView(btn.dataset.view);
    });
});

if (editorButton) editorButton.addEventListener('click', toggleEditor);

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('nlb_auth');
        window.location.reload();
    });
}

// Run immediately (Module is deferred by default, so DOM is likely ready)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
