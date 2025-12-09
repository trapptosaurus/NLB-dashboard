# NLB Group Strategy 2030 Dashboard

An interactive dashboard designed to visualize, track, and simulate the Key Performance Indicators (KPIs) of NLB Group's Strategy 2030. This tool provides a comprehensive view of the group's strategic goals across various segments, allowing stakeholders to monitor progress and explore different performance scenarios.

## 📄 Strategy Document

This dashboard is based on the official **NLB Group Strategy 2030**.

-   **[View Local PDF](NLB_Group_Strategy_2030.pdf)** (Saved in project folder)
-   [Official Online Source](https://www.nlbgroup.com/content/dam/nlb/nlb-group/documents/investor-relations/financial-reports/2024/20240430-strategy-2030-ird.pdf)

## 🚀 Features

-   **Interactive Dashboard**: Navigate through different strategic pillars: Group, Retail, CIB, and Payments.
-   **Dynamic Visualizations**:
    -   **Line Charts**: Visualize the trajectory of "Plan" vs "Actual" values over time (2025-2030).
    -   **Gauge Charts**: "Tachometer" style visualization for qualitative KPIs (e.g., "RTSR vs Peer Group").
-   **Data Editor**:
    -   **Scenario Simulation**: Manually adjust "Actual" values for any year to simulate different outcomes.
    -   **Metadata Management**: Edit KPI names, descriptions, and units.
    -   **Drag-and-Drop**: Reorder KPIs within categories.
    -   **Global Parameters**: Adjust "On Track" and "Warning" status thresholds globally.
-   **Real-time Status Calculation**: KPI statuses (On Track, Slightly Off, Off Track) are automatically calculated based on the defined thresholds and current data.

## 🛠️ Technology Stack

This project is built with a focus on performance, simplicity, and no build-step requirements.

-   **HTML5**: Provides the semantic structure of the application.
-   **CSS3**:
    -   Custom styling using **CSS Variables** for consistent theming (Primary Color: NLB Indigo Blue `#230078`).
    -   Modern layouts with **Flexbox** and **CSS Grid**.
    -   Responsive design for various screen sizes.
-   **JavaScript (ES6+)**:
    -   **Vanilla JS**: Handles all application logic, state management, and DOM manipulation without heavy frameworks.
    -   **Modular Architecture**: Code is organized into separate modules (`app.js`, `data.js`, `charts.js`) for maintainability.
-   **Chart.js**: A lightweight library used for rendering the responsive and interactive charts.

## 📂 Project Structure

-   `index.html`: Main entry point and layout structure.
-   `css/style.css`: All styling rules and theme definitions.
-   `js/app.js`: Core application logic, event handling, and rendering functions.
-   `js/data.js`: Centralized data store containing all KPI definitions and values.
-   `js/charts.js`: Logic for generating and configuring Chart.js instances.
-   `NLB_Group_Strategy_2030.pdf`: The reference strategy document.
