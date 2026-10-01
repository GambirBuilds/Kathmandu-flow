# Kathmandu Flow 

### Kathmandu Valley Traffic Simulation & City Flow Dashboard

**Kathmandu Flow** is an interactive traffic simulation and city-flow dashboard designed around the road network of the Kathmandu Valley. It provides a visual way to explore traffic congestion, road capacity, vehicle movement, traffic signals, incidents, weather conditions, road closures, and alternative routes across **Kathmandu, Lalitpur, and Bhaktapur**.

The project combines a React-based dashboard with a custom JavaScript traffic simulation engine to create a realistic and interactive representation of Kathmandu Valley traffic conditions.

---

## 📸 Project Overview

Kathmandu Flow provides a centralized dashboard where users can monitor and experiment with simulated traffic conditions throughout the Kathmandu Valley.

<img width="1918" height="910" alt="image" src="https://github.com/user-attachments/assets/b831d654-d266-4c83-b4cc-34bd83ac86ff" />

The system includes:

* 🗺️ Interactive Kathmandu Valley traffic map
* 🚗 Animated vehicle simulation
* 🚦 Traffic signal simulation
* 📊 Real-time traffic metrics
* 🛣️ Road-level traffic information
* 🧭 Route and detour planning
* 🌧️ Weather-based traffic scenarios
* 🚧 Road closure simulation
* 🎯 Traffic incident management
* 🧪 Scenario testing
* 📈 Traffic history and charts
* 🇳🇵 Kathmandu, Lalitpur & Bhaktapur coverage

---

## ✨ Main Features

### 🗺️ Interactive City Traffic Map

The application visualizes major traffic corridors and intersections throughout the Kathmandu Valley.

Users can inspect different roads and intersections and observe changes in:

* Traffic volume
* Congestion
* Road capacity
* Average speed
* Travel time
* Traffic signals
* Road closures
* Active incidents

---

### 🚗 Live Vehicle Simulation

Kathmandu Flow includes a custom traffic simulation engine that generates and moves vehicles across the simulated road network.

The simulation includes different vehicle categories:

| Vehicle Type                | Approx. Share |
| --------------------------- | ------------: |
| 🏍️ Motorcycles / Scooters  |           60% |
| 🚕 Cars / Taxis             |           22% |
| 🚐 Microbuses / Safa Tempos |           12% |
| 🚌 Public Buses             |            6% |

Vehicle movement is affected by road conditions, traffic volume, road capacity, and simulated traffic signals.

---

### 🚦 Traffic Signal Simulation

Traffic intersections can have simulated signal states such as:

* 🟢 Green
* 🔴 Red

Signal durations can be adjusted from the dashboard, allowing users to experiment with different traffic-control conditions.

---

### 📊 Traffic Metrics Dashboard

The dashboard provides traffic-related metrics such as:

* Current traffic volume
* Congestion level
* Average speed
* Travel time
* Vehicle count
* Road capacity
* Network conditions
* Traffic history

These metrics change as simulation parameters are modified.

---

### 🛣️ Route & Detour Planner

The Route Planner allows users to select:

**Origin → Destination**

and calculate simulated routes across the Kathmandu Valley.

The application can compare:

* Primary route
* Alternative route
* Distance
* Estimated travel time
* Average speed
* Number of road segments
* Number of junctions

Example corridors include:

* Kalanki ↔ Bhaktapur
* Pulchowk ↔ Bhaktapur Durbar Square
* Jawalakhel ↔ Maharajgunj
* Koteshwor ↔ Thamel
* Kalanki ↔ Tribhuvan International Airport
* Chabahil ↔ Singha Durbar

---

## 🎯 Scenario Simulation

One of the major features of Kathmandu Flow is the ability to simulate different real-world traffic situations.

Example scenarios include:

### 🌧️ Monsoon Waterlogging

Simulates heavy rainfall and waterlogging that affects road capacity and traffic movement.

### 🎉 Festival Traffic

Simulates increased traffic caused by major festivals and pilgrimage activities.

### 🚌 Dashain Transit Exodus

Simulates increased outbound traffic from Kathmandu Valley during Dashain.

### 🚘 VIP Motorcade

Simulates road closures and traffic diversions caused by VIP movement.

### 🚧 Road Closures

Specific roads can be closed to observe how traffic is redistributed across the network.

### 🤖 Smart Traffic Infrastructure

Simulates improved traffic capacity through synchronized signals and infrastructure improvements.

---

## ⚙️ Simulation Controls

Users can experiment with several simulation parameters.

### Traffic Volume

Controls the amount of traffic entering the simulated network.

### Road Capacity

Changes the effective capacity of the road network.

### Weather

The simulation can represent conditions such as:

* Clear weather
* Monsoon rain
* Fog

### Simulation Speed

Controls how quickly the simulation progresses.

### Signal Duration

Changes the duration of simulated traffic signals.

### Play / Pause

The entire simulation can be paused and resumed.

---

## 🧠 Traffic Simulation Engine

The project contains a dedicated JavaScript simulation engine located in:

```text
src/simulation/simulationEngine.js
```

The engine is responsible for:

* Initializing the road network
* Creating traffic nodes
* Creating road segments
* Generating vehicles
* Updating vehicle movement
* Calculating traffic flow
* Calculating congestion
* Managing traffic signals
* Managing road closures
* Applying scenarios
* Calculating alternative routes
* Recording traffic history

Keeping the simulation logic separate from the React UI makes the project easier to maintain and extend.

---

## 🏗️ Project Architecture

The project follows a component-based React architecture.

```text
kathmandu_flow/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── CityMap.jsx
│   │   ├── Header.jsx
│   │   ├── LegendModal.jsx
│   │   ├── MetricsOverview.jsx
│   │   ├── RoadDetailsPanel.jsx
│   │   ├── RoutePlanner.jsx
│   │   ├── ScenarioManager.jsx
│   │   ├── SimulationControls.jsx
│   │   └── TrafficCharts.jsx
│   │
│   ├── simulation/
│   │   ├── networkData.js
│   │   ├── scenarioPresets.js
│   │   ├── simulationEngine.js
│   │   └── storageService.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Technologies Used

### Frontend

* **React 19**
* **JavaScript**
* **HTML5**
* **CSS**
* **Tailwind CSS**

### Build Tool

* **Vite**

### Icons

* **Lucide React**

### Animation / UI

* **Motion**

### Simulation

* Custom JavaScript traffic simulation engine
* Graph-based route calculation
* Dynamic traffic-flow calculations

### Development Tools

* Node.js
* npm
* TypeScript configuration
* Vite development server

---

## 🚀 Getting Started

### Prerequisites

Before running the project, make sure you have installed:

* Node.js
* npm
* Git

You can check your installation using:

```bash
node --version
npm --version
git --version
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/kathmandu-flow.git
```

Move into the project directory:

```bash
cd kathmandu-flow
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run the Development Server

Start the application using:

```bash
npm run dev
```

Vite will start the development server.

Open the local address shown in your terminal, typically:

```text
http://localhost:3000
```

---

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Environment Variables

If environment-based services are used, create a local environment file based on:

```text
.env.example
```

Do not upload private API keys or other secrets to GitHub.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

Only add environment variables that are actually required by your current implementation.

---

## 🧪 How to Use

After launching Kathmandu Flow:

### 1. Explore the Map

Use the city map to explore simulated roads and intersections throughout Kathmandu Valley.

### 2. Monitor Traffic

Observe vehicle movement and traffic conditions.

### 3. Select a Road

Open road details to inspect information about a particular road.

### 4. Change Simulation Conditions

Experiment with:

* Traffic volume
* Road capacity
* Weather
* Simulation speed
* Signal duration

### 5. Apply a Scenario

Select one of the predefined scenarios to simulate a particular traffic situation.

### 6. Test Road Closures

Close selected roads and observe how traffic conditions change.

### 7. Plan a Route

Choose an origin and destination to compare simulated routes.

### 8. Compare Traffic Conditions

Use the dashboard metrics and charts to understand how changes affect the simulated network.

---

## 🧩 Important Project Components

| Component                | Purpose                                     |
| ------------------------ | ------------------------------------------- |
| `CityMap.jsx`            | Displays the simulated city traffic network |
| `MetricsOverview.jsx`    | Displays traffic statistics                 |
| `TrafficCharts.jsx`      | Visualizes traffic data                     |
| `RoutePlanner.jsx`       | Provides route and detour planning          |
| `ScenarioManager.jsx`    | Manages traffic scenarios                   |
| `SimulationControls.jsx` | Controls simulation parameters              |
| `RoadDetailsPanel.jsx`   | Displays road-specific information          |
| `LegendModal.jsx`        | Explains map symbols and traffic states     |
| `simulationEngine.js`    | Core traffic simulation logic               |
| `networkData.js`         | Kathmandu Valley road/network data          |
| `scenarioPresets.js`     | Predefined simulation scenarios             |
| `storageService.js`      | Handles local application storage           |

---

## 🌐 Kathmandu Valley Coverage

The simulation focuses on the three major cities of Kathmandu Valley:

### Kathmandu

Includes major locations and corridors such as:

* Kalanki
* Koteshwor
* Baneshwor
* Thamel
* Maharajgunj
* Chabahil
* Singha Durbar
* Tinkune
* Airport area

### Lalitpur

Includes areas such as:

* Pulchowk
* Jawalakhel
* Patan
* Lagankhel

### Bhaktapur

Includes major corridors and locations around:

* Koteshwor
* Sallaghari
* Suryabinayak
* Bhaktapur Durbar Square

---

## 📈 Why This ?

Traffic congestion is one of the major challenges faced by rapidly growing urban areas.

Kathmandu Valley has a complex combination of:

* High motorcycle usage
* Mixed vehicle types
* Narrow roads
* Major intersections
* Rapid urban development
* Festival-related traffic
* Monsoon conditions
* Road construction
* Temporary road closures

Kathmandu Flow provides a **simulation-based environment** where different traffic situations can be explored without affecting real-world traffic.

> **Note:** This project is an educational and experimental traffic simulation. Its simulated values should not be interpreted as official real-time traffic measurements.

---

## 🔮 Future Improvements

Possible future improvements include:

* 📍 Real GPS traffic data integration
* 🛰️ Live traffic API integration
* 🗺️ Real geographic map integration
* 🚕 Public transport tracking
* 📱 Mobile-first optimization
* 🤖 AI-based traffic prediction
* 🚨 Automatic incident detection
* 🚦 Adaptive traffic signal optimization
* 📊 Historical traffic analytics
* 🌦️ Live weather integration
* 🏙️ Expansion to additional Nepalese cities
* 👥 Multi-user traffic planning
* ☁️ Cloud-based simulation storage

---

## 🤝 Contributing

Contributions are welcome.

If you would like to improve the project:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Make your changes
4. Commit your changes

```bash
git add .
git commit -m "Add new traffic simulation feature"
```

5. Push the branch

```bash
git push origin feature/new-feature
```

6. Open a Pull Request

---

## 📄 License

This project is intended primarily for educational, experimental, and demonstration purposes.

If you plan to reuse or distribute the project, add an appropriate license based on your intended use.

---

## ⭐ Support the Project

If you find **Kathmandu Flow** interesting or useful:

⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements
🤝 Contribute to development

---

<div align="center">

### 🚦 Kathmandu Flow

**Simulating Kathmandu Valley. Exploring better city mobility.**

Made with ❤️ and code in Nepal.

</div>
