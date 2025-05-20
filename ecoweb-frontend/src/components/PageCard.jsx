import React from "react";

function PageCard({ name, page, result, onReanalyze, onDelete, isAnalyzing, isDeleting }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600 break-all mt-1">{page.url}</p>
        {result && (
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
            {result.score}/100
          </span>
        )}
            </div>

      {result && (
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Impact CO₂</span>
            <span className="font-medium">{result.co2Emission.toFixed(2)}g</span>
            </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Poids de la page</span>
            <span className="font-medium">{result.pageWeight} KB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Requêtes</span>
            <span className="font-medium">{result.requestCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hébergement vert</span>
            <span className={`font-medium ${result.greenHosting ? 'text-green-600' : 'text-red-600'}`}>
              {result.greenHosting ? 'Oui' : 'Non'}
            </span>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => onReanalyze(page.id)}
          disabled={isAnalyzing}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
            isAnalyzing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isAnalyzing ? 'Analyse en cours...' : 'Réanalyser'}
        </button>
        <button
          onClick={() => onDelete(page.id)}
          disabled={isDeleting}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
            isDeleting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </div>
  );
}

export default PageCard;
