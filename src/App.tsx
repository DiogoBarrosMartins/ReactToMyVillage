import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NewAccountPage from './pages/NewAccountPage';
import Rules from './pages/Rules';
import Leaderboard from './pages/Leaderboard';
import { VillageDataProvider } from './api/VillageDataContext';
import './App.css';
import VillageOverview from './pages/OutterVillageView';
import MapView from './pages/MapView';

const App: React.FC = () => {
console.log("App rendered");

return (
    <Router>
        <div className="App">
            <VillageDataProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/create-account" element={<NewAccountPage />} />
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/village" element={<VillageOverview />} />
                    <Route path="/map" element={<MapView />} />
                </Routes>     
            </VillageDataProvider>
        </div>
    </Router>
);
}

export default App;
