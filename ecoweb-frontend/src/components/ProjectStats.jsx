import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ProjectStats({ project, results }) {
  const calculateTotalImpact = () => {
    if (!results || results.length === 0) return 0;
    return results.reduce((total, result) => total + (result.co2Emission || 0), 0);
  };

  const calculateAverageScore = () => {
    if (!results || results.length === 0) return 0;
    const sum = results.reduce((total, result) => total + (result.score || 0), 0);
    return (sum / results.length).toFixed(1);
  };

  const chartData = {
    labels: ['Score écologique', 'Impact CO₂'],
    datasets: [
      {
        data: [
          calculateAverageScore(),
          calculateTotalImpact()
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des performances'
      }
    },
    cutout: '60%'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">Statistiques du projet</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Impact CO₂ total</h3>
          <p className="text-2xl font-bold text-green-600">
            {calculateTotalImpact().toFixed(2)}g
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Score moyen</h3>
          <p className="text-2xl font-bold text-blue-600">
            {calculateAverageScore()}/100
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Pages analysées</h3>
          <p className="text-2xl font-bold text-purple-600">
            {results?.length || 0}
          </p>
        </div>
      </div>

      <div className="h-80 flex items-center justify-center">
        <div className="w-64 h-64">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>Dernière mise à jour : {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ProjectStats; 