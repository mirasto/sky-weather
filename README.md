# ☁️ SkyWeather

<div align="center">

![Preview](https://i.postimg.cc/wjW6mQrj/sky-Weather.png)


**A state-of-the-art meteorological intelligence platform built for precision and visual elegance.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)

</div>

---

## 🌟 Overview

**SkyWeather** is a premium weather application that delivers high-fidelity meteorological data through a sophisticated, glassmorphic interface. Designed for users who demand both precision and aesthetic excellence, it leverages modern API architectures to provide real-time atmospheric insights, interactive mapping, and comprehensive localized forecasts.

## ✨ Key Features

- 🛰️ **Real-Time Synchronicity** – Live meteorological data stream optimized for minimal latency.
- � **Data Visualization** – Interactive hourly and daily trends powered by professional charting libraries.
- 🌪️ **Atmospheric Intelligence** – Deep tracking of Air Quality (AQI), Pollutant concentrations (PM2.5, NO₂), and UV cycles.
- 🗺️ **Interactive Radar** – High-precision geospatial weather maps with real-time precipitation layers.
- 🌅 **Celestial Dynamics** – Scientific tracking of solar cycles with custom-engineered arc visualizations.
- 📱 **Progressive Web App (PWA)** – Fully responsive and installable offline experience with background synchronization.
- 🔍 **Global Geocoding** – Worldwide city indexing and search optimized by Open-Meteo algorithms.
- 🌓 **Dynamic Themes** – Context-aware Light and Dark modes with automatic system preference detection.
- 🌐 **Global Localization** – Full i18n support including English and Ukrainian (UKR) translations.

## 🛠️ Technical Architecture

### **Core Framework**
- **React 18** – Leveraging Concurrent Mode, Suspense for data fetching, and functional hooks.
- **TypeScript** – Full-spectrum type safety ensuring robust code quality and maintainability.
- **Vite** – Next-generation frontend tooling for instantaneous Hot Module Replacement (HMR).

### **State Orchestration**
- **Redux Toolkit (RTK)** – Scalable state management for complex UI interactions and user preferences.
- **RTK Query** – Advanced data-fetching layer with automatic caching, polling, and invalidation strategies.
- **Redux Persist** – Seamless local persistence for unit preferences and favorite locations.

### **Styling & Motion**
- **Tailwind CSS** – Atomic CSS architecture for high-performance, responsive layout rendering.
- **Framer Motion** – Production-grade animations for fluid UI transitions and gesture-based interactions.
- **Lucide & Heroicons** – Curated vector iconography for sharp visual communication.

### **Intelligence Layers**
- **Meteorology**: [OpenWeatherMap Pro API](https://openweathermap.org/)
- **Geocoding**: [Open-Meteo Geocoding API](https://open-meteo.com/)
- **Mapping**: [Leaflet Engine](https://leafletjs.com/) with high-resolution tile services.

---

## 📂 Project Structure

```bash
src/
├── assets/         # Optimized vector assets and global design tokens
├── components/     # Atomic system: UI primitives, layouts, and domain widgets
├── i18n/           # Internationalization core: localized JSON dictionaries
├── pages/          # High-level views with lazy-loading implementation
├── services/       # API abstraction layer and RTK Query definitions
├── store/          # Redux Toolkit configuration, slices, and middleware
├── styles/         # Layout definitions and theme-specific CSS variables
├── types/          # Domain-specific TypeScript interfaces and models
└── utils/          # Pure logic helpers, geospatial tools, and constants
```

---

## 🚀 Installation & Deployment

### Prerequisites
- **Node.js**: `v18.0` or higher
- **npm**: `v9.0` or higher

### Step-by-Step Setup

1. **Repository Linkage**
   ```bash
   git clone https://github.com/mirasto/skyweather.git
   cd skyweather
   ```

2. **Initialize Dependencies**
   ```bash
   npm install
   ```

3. **Environmental Integration**
   Create a `.env` file in the project root:
   ```env
   VITE_API_KEY_OPENWEATHERMAP=your_professional_api_key
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

5. **Development Environment**
   ```bash
   npm run dev
   ```
