import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, getProjectPages, getResultByPageId, analyzePage, deletePage } from "../services/api";
import PageCard from "../components/PageCard";
import ProjectStats from "../components/ProjectStats";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [pages, setPages] = useState([]);
  const [results, setResults] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [deletingMap, setDeletingMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const projectData = await getProjectById(id);
      setProject(projectData);

      const pagesData = await getProjectPages(id);
      setPages(pagesData);

      const resultsData = {};
      for (const page of pagesData) {
        try {
          const result = await getResultByPageId(page.id);
          resultsData[page.id] = result;
        } catch (error) {
          console.error(`Error fetching result for page ${page.id}:`, error);
          resultsData[page.id] = null;
        }
      }
      setResults(resultsData);
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError("Une erreur est survenue lors du chargement du projet.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReanalyze = async (pageId) => {
    setLoadingMap((prev) => ({ ...prev, [pageId]: true }));
    try {
      const newResult = await analyzePage(pageId);
      if (newResult) {
        setResults((prev) => ({ ...prev, [pageId]: newResult }));
      }
    } catch (error) {
      console.error("Erreur lors de la réanalyse :", error);
      setError("Une erreur est survenue lors de la réanalyse.");
    }
    setLoadingMap((prev) => ({ ...prev, [pageId]: false }));
  };

  const handleDelete = async (pageId) => {
    setShowDeleteConfirm(pageId);
  };

  const confirmDelete = async (pageId) => {
    setDeletingMap((prev) => ({ ...prev, [pageId]: true }));
    try {
      await deletePage(pageId);
      if (pages.length === 1) {
        navigate('/projects');
      } else {
        await fetchData();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Une erreur est survenue lors de la suppression de la page.");
    }
    setDeletingMap((prev) => ({ ...prev, [pageId]: false }));
    setShowDeleteConfirm(null);
  };

  const handleExportData = () => {
    const exportData = {
      project: project,
      pages: pages,
      results: results
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-500 border-t-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-7xl mb-6 animate-bounce">🔍</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Projet non trouvé</h2>
          <p className="text-gray-600 mb-8">Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Retour aux projets
          </button>
        </div>
      </div>
    );
  }

  const allResults = Object.values(results).filter(Boolean);
  const lastAnalysisDate = allResults.length > 0 
    ? new Date(Math.max(...allResults.map(r => new Date(r.analyzedAt || r.createdAt))))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
              </div>
              <p className="text-green-600 font-medium break-all flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {pages[0]?.url || "URL non disponible"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button
                  onClick={handleExportData}
                  className="w-10 h-10 bg-white text-gray-700 hover:bg-gray-50 rounded-full border border-gray-200 transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Exporter les données
                  </div>
                  <p className="text-gray-300 text-xs mt-1">Télécharger les données du projet au format JSON</p>
                </div>
              </div>
              <div className="relative group">
                <button
                  onClick={() => navigate('/projects')}
                  className="w-10 h-10 bg-white text-gray-700 hover:bg-gray-50 rounded-full border border-gray-200 transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Retour aux projets
                  </div>
                  <p className="text-gray-300 text-xs mt-1">Retourner à la liste des projets</p>
                </div>
              </div>
            </div>
          </div>

          {/* Last Analysis Info */}
          {lastAnalysisDate && (
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dernière analyse : {lastAnalysisDate.toLocaleDateString()} à {lastAnalysisDate.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="ml-3 text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="mb-8 transform transition-all duration-300 hover:scale-[1.01]">
          <ProjectStats project={project} results={allResults} />
        </div>

        {/* Analysis Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des analyses</h2>
          <div className="space-y-4">
            {allResults.map((result, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Analyse #{index + 1}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(result.analyzedAt || result.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">Score:</span>
                      <span className="text-sm font-bold text-green-600">{result.score.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">CO₂:</span>
                      <span className="ml-1 font-medium text-gray-900">{result.co2Emission}g</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Poids:</span>
                      <span className="ml-1 font-medium text-gray-900">{result.pageWeight}Ko</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Requêtes:</span>
                      <span className="ml-1 font-medium text-gray-900">{result.httpsRequests}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pages Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pages analysées</h2>
              <p className="text-gray-500 mt-1">Gérez et analysez vos pages web</p>
            </div>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
              {pages.length} {pages.length === 1 ? 'page' : 'pages'}
            </span>
          </div>

          {pages.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-7xl mb-6 animate-bounce">📄</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Aucune page analysée</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Commencez par analyser une page pour voir les résultats et améliorer votre impact environnemental.
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Analyser une page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pages.map((page) => (
                <div key={page.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                  <PageCard
                    name={project.name}
                    page={page}
                    result={results[page.id]}
                    onReanalyze={handleReanalyze}
                    onDelete={handleDelete}
                    isAnalyzing={loadingMap[page.id]}
                    isDeleting={deletingMap[page.id]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer cette page ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
