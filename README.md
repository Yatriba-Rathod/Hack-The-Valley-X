# EY Data Integration Dashboard

This project is a full-stack web application for uploading, mapping, and merging two datasets (CSV files) to analyze relationships between weather conditions and energy consumption. Built for the EY Data Integration Challenge at Hack-The-Valley-X.

## Features

- Upload two CSV datasets (e.g., weather data and energy consumption data)
- Automatic column mapping using exact match and string similarity
- Merges and concatenates all rows from both datasets, combining mapped columns and including unmapped columns
- Displays merged data and column mapping in a clean, interactive web UI
- Built with React (frontend) and Node.js/Express (backend)

## How It Works

1. **Upload**: Select and upload two CSV files via the dashboard.
2. **Mapping**: The backend automatically maps columns between the two datasets using name similarity.
3. **Merging**: All rows from both datasets are merged. Mapped columns are unified; unmapped columns are appended.
4. **Visualization**: The merged data and column mapping are displayed in the web UI for further analysis.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express, Multer, csv-parser, string-similarity
- **Other**: CORS, file upload handling

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ey-data-integration-dashboard.git
   cd ey-data-integration-dashboard
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend**
   ```bash
   cd ../frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
backend/
  server.js
  package.json
  uploads/
frontend/
  src/
    App.js
    components/
      DataUploader.jsx
  package.json
```

## Example Use Case

- **Dataset 1**: Weather data (temperature, humidity, etc.)
- **Dataset 2**: Energy consumption data (energy usage, occupancy, etc.)
- **Goal**: Analyze how weather conditions affect energy consumption by merging and mapping relevant columns.

## License

MIT

---

*Built for Hack-The-Valley-X EY Data Integration Challenge.*