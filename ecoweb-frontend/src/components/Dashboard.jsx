import React, { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard({ projects, results, onAnalyze }) {
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  // Filter results based on selected project
  const filteredResults = selectedProjectId === 'all'
    ? results
    : results.filter(r => {
        // Find the project that contains this result
        const project = projects.find(p => p.pages?.some(page => page.result?.id === r.id));
        return project && String(project.id) === String(selectedProjectId);
      });

  const calculateTotalImpact = () => {
    if (!filteredResults || filteredResults.length === 0) return 0;
    return filteredResults.reduce((total, result) => total + (result.co2Emission || 0), 0);
  };

  const calculateAverageScore = () => {
    if (!filteredResults || filteredResults.length === 0) return 0;
    const sum = filteredResults.reduce((total, result) => total + (result.score || 0), 0);
    return (sum / filteredResults.length).toFixed(1);
  };

  const getScoreDistribution = () => {
    const distribution = {
      excellent: 0, // 80-100
      good: 0,     // 60-79
      fair: 0,     // 40-59
      poor: 0      // 0-39
    };

    filteredResults.forEach(result => {
      if (result.score >= 80) distribution.excellent++;
      else if (result.score >= 60) distribution.good++;
      else if (result.score >= 40) distribution.fair++;
      else distribution.poor++;
    });

    return distribution;
  };

  const getTopPagesByImpact = () => {
    if (!filteredResults || filteredResults.length === 0) return [];
    return [...filteredResults]
      .sort((a, b) => (b.co2Emission || 0) - (a.co2Emission || 0))
      .slice(0, 5);
  };

  const scoreDistribution = getScoreDistribution();
  const topPages = getTopPagesByImpact();

  const scoreChartData = {
    labels: ['Excellent', 'Bon', 'Moyen', 'Faible'],
    datasets: [
      {
        data: [
          scoreDistribution.excellent,
          scoreDistribution.good,
          scoreDistribution.fair,
          scoreDistribution.poor
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // green
          'rgba(59, 130, 246, 0.8)',  // blue
          'rgba(234, 179, 8, 0.8)',   // yellow
          'rgba(239, 68, 68, 0.8)'    // red
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  };

  const impactChartData = {
    labels: topPages.map(page => {
      // Find the corresponding project and page for this result
      const project = projects.find(p => p.pages?.some(page => page.result?.id === page.id));
      return project?.page?.url || 'Page inconnue';
    }),
    datasets: [
      {
        label: 'Impact CO₂ (g)',
        data: topPages.map(page => page.co2Emission || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  const hasResults = filteredResults && filteredResults.length > 0;

  return (
    <div className="space-y-8 p-6">
      {/* Project Selector */}
      {/* <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label htmlFor="project-select" className="text-gray-700 font-medium">Projet :</label>
            <select
              id="project-select"
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
            >
              <option value="all">Tous les projets</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          {!hasResults && (
            <button
              onClick={() => onAnalyze(selectedProjectId === 'all' ? null : selectedProjectId)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <span>Analyser</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      </div> */}

      {!hasResults ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {selectedProjectId === 'all' 
                ? "Aucune donnée disponible" 
                : "Aucune analyse disponible pour ce projet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedProjectId === 'all'
                ? "Commencez par analyser des pages pour voir les statistiques."
                : "Lancez une analyse pour ce projet pour voir les statistiques."}
            </p>
            <button
              onClick={() => onAnalyze(selectedProjectId === 'all' ? null : selectedProjectId)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Commencer l'analyse
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Impact CO₂ Total</h3>
                <span className="text-green-600">🌍</span>
              </div>
              <p className="text-4xl font-bold text-green-600 mt-4">
                {calculateTotalImpact().toFixed(2)}g
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Score Moyen</h3>
                <span className="text-blue-600">📊</span>
              </div>
              <p className="text-4xl font-bold text-blue-600 mt-4">
                {calculateAverageScore()}/100
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Pages Analysées</h3>
                <span className="text-purple-600">📑</span>
              </div>
              <p className="text-4xl font-bold text-purple-600 mt-4">
                {filteredResults.length}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Distribution des Scores</h3>
              <div className="h-72">
                <Doughnut data={scoreChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Top 5 Pages par Impact CO₂</h3>
              <div className="h-72">
                <Bar data={impactChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Recommandations</h3>
            <div className="space-y-4">
              {scoreDistribution.poor > 0 && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-red-600">
                    {scoreDistribution.poor} page(s) nécessite(nt) une attention immédiate (score &lt; 40)
                  </p>
                </div>
              )}
              {calculateTotalImpact() > 10 && (
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">ℹ️</span>
                  <p className="text-yellow-600">
                    L&apos;impact CO₂ total dépasse 10g. Envisagez d&apos;optimiser les pages les plus impactantes.
                  </p>
                </div>
              )}
              {calculateAverageScore() < 60 && (
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <span className="text-2xl">💡</span>
                  <p className="text-blue-600">
                    Le score moyen est inférieur à 60. Considérez une revue générale des bonnes pratiques.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard; 