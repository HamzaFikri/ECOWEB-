import { useEffect, useState } from "react";
import { getProjects, getProjectPages, getResultByPageId, analyzePage, deletePage, createProjectWithPages } from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageCard from "../components/PageCard";
import CreateProjectModal from "../components/CreateProjectModal";
import Dashboard from "../components/Dashboard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [deletingMap, setDeletingMap] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedTags, setSelectedTags] = useState([]);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

    const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseProjects = await getProjects();

      const projectsWithResults = await Promise.all(
        baseProjects.map(async (project) => {
          const pages = await getProjectPages(project.id);
          const firstPage = pages[0];

          let result = null;
          if (firstPage) {
            result = await getResultByPageId(firstPage.id);
          }

          return {
            ...project,
            page: firstPage,
            result,
          hasPages: pages.length > 0
          };
        })
      );

    // Filter out projects that have no pages
    const validProjects = projectsWithResults.filter(project => project.hasPages);
    setProjects(validProjects);

    // Collect all results for the dashboard
    const results = validProjects
      .map(project => project.result)
      .filter(result => result !== null);
    setAllResults(results);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Une erreur est survenue lors du chargement des projets.");
    }
    setIsLoading(false);
    };

  useEffect(() => {
    fetchAll();
  }, [location.key]);

  useEffect(() => {
    let filtered = [...projects];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.page?.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project => 
        selectedTags.every(tag => project.tags?.includes(tag))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "score":
          comparison = (a.result?.score || 0) - (b.result?.score || 0);
          break;
        case "date":
          comparison = new Date(a.result?.analyzedAt || a.result?.createdAt || 0) - 
                      new Date(b.result?.analyzedAt || b.result?.createdAt || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery, sortBy, sortOrder, selectedTags]);

  // Get unique tags from all projects
  const allTags = [...new Set(projects.flatMap(project => project.tags || []))];

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleReanalyze = async (pageId) => {
    setLoadingMap((prev) => ({ ...prev, [pageId]: true }));
    try {
      const newResult = await analyzePage(pageId);
      if (newResult) {
        await fetchAll();
      }
    } catch (error) {
      console.error("Erreur lors de la réanalyse :", error);
      setError("Une erreur est survenue lors de la réanalyse.");
    }
    setLoadingMap((prev) => ({ ...prev, [pageId]: false }));
  };

  const handleDelete = async (pageId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette page ?")) {
      setDeletingMap((prev) => ({ ...prev, [pageId]: true }));
      try {
        await deletePage(pageId);
        await fetchAll();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        setError("Une erreur est survenue lors de la suppression de la page.");
      }
      setDeletingMap((prev) => ({ ...prev, [pageId]: false }));
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      // Create project and analyze pages in one step
      const project = await createProjectWithPages(projectData);
      
      // Start analysis for each page
      const pages = await getProjectPages(project.id);
      for (const page of pages) {
        await analyzePage(page.id);
      }
      
      await fetchAll();
    } catch (error) {
      console.error("Erreur lors de l'analyse :", error);
      throw error;
    }
  };

  const handleAnalyze = (projectId) => {
    if (projectId) {
      // If a specific project is selected, navigate to its details page
      navigate(`/projects/${projectId}`);
    } else {
      // If no project is selected, open the create project modal
      setIsModalOpen(true);
    }
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handleDeleteProject = async (projectId) => {
    setDeletingMap(prev => ({ ...prev, [projectId]: true }));
    try {
      await deletePage(projectId);
      await fetchAll();
      setDeleteConfirmProject(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Une erreur est survenue lors de la suppression du projet.");
    }
    setDeletingMap(prev => ({ ...prev, [projectId]: false }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) {
      return 'from-green-400 to-green-600';
    } else if (score >= 60) {
      return 'from-yellow-400 to-yellow-600';
    } else if (score >= 40) {
      return 'from-orange-400 to-orange-600';
    } else {
      return 'from-red-400 to-red-600';
    }
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) {
      return 'text-green-600';
    } else if (score >= 60) {
      return 'text-yellow-600';
    } else if (score >= 40) {
      return 'text-orange-600';
    } else {
      return 'text-red-600';
    }
  };

  const getRating = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    return 'F';
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      case 'E':
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <p className="mt-6 text-lg font-medium text-gray-700">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Projets</h1>
              <p className="text-gray-500 mt-2">Gérez et analysez vos projets web</p>
            </div>
        <button
          onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
        >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Nouveau Projet</span>
        </button>
      </div>
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

        {/* Dashboard Section */}
      {allResults.length > 0 && (
          <div className="mb-8 transform transition-all duration-300 hover:scale-[1.01]">
          <Dashboard 
            projects={projects} 
            results={allResults} 
            onAnalyze={handleAnalyze}
          />
        </div>
      )}

      {/* Projects List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vos projets</h2>
              <p className="text-gray-500 mt-1">Liste de tous vos projets analysés</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white shadow-sm text-green-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-white shadow-sm text-green-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="name-asc">Nom (A-Z)</option>
                  <option value="name-desc">Nom (Z-A)</option>
                  <option value="score-desc">Score (Plus élevé)</option>
                  <option value="score-asc">Score (Plus bas)</option>
                  <option value="date-desc">Date (Récent)</option>
                  <option value="date-asc">Date (Ancien)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedTags.includes(tag)
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'projet' : 'projets'}
              </span>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-7xl mb-6 animate-bounce">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {searchQuery || selectedTags.length > 0 ? "Aucun projet trouvé" : "Aucun projet"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery || selectedTags.length > 0
                  ? "Aucun projet ne correspond à votre recherche. Essayez avec d'autres termes ou tags."
                  : "Commencez par créer un nouveau projet pour analyser vos pages web et améliorer votre impact environnemental."}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Créer un projet
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-4"
            }>
              {filteredProjects.map((project) => (
                <div key={project.id} className={`transform transition-all duration-300 hover:scale-[1.02] ${
                  viewMode === "list" ? "bg-white rounded-xl shadow-lg border border-gray-100" : ""
                }`}>
                  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
                    viewMode === "list" ? "flex" : ""
                  }`}>
                    <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className={`flex items-center space-x-3 mb-4 ${viewMode === "list" ? "mb-0" : ""}`}>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">{project.page?.url}</p>
                        </div>
                      </div>
                      
                      {project.result && (
                        <div className={`space-y-3 ${viewMode === "list" ? "ml-16" : ""}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Score écologique</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-lg font-bold ${getScoreTextColor(project.result.score)}`}>
                                {project.result.score.toFixed(1)}%
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-sm font-bold ${getRatingColor(getRating(project.result.score))}`}>
                                {getRating(project.result.score)}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${getScoreColor(project.result.score)} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${project.result.score}%` }}
                            ></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <span className="text-sm text-gray-500">CO₂</span>
                              <p className="text-sm font-medium text-gray-900">{project.result.co2Emission}g</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Poids</span>
                              <p className="text-sm font-medium text-gray-900">{project.result.pageWeight}Ko</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Project Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className={`flex flex-wrap gap-2 mt-4 ${viewMode === "list" ? "ml-16" : ""}`}>
                          {project.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-4 border-t border-gray-100 bg-gray-50 ${viewMode === "list" ? "w-48" : ""}`}>
                      <div className={`flex ${viewMode === "list" ? "flex-col space-y-2" : "space-x-2"}`}>
                        <button
                          onClick={() => handleReanalyze(project.page?.id)}
                          disabled={loadingMap[project.page?.id]}
                          className={`bg-white text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg border border-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 ${
                            viewMode === "list" ? "w-full" : "flex-1"
                          }`}
                        >
                          {loadingMap[project.page?.id] ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Analyse...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span></span>
                            </>
                          )}
                        </button>
              <Link
                to={`/projects/${project.id}`}
                          className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                            viewMode === "list" ? "w-full" : "flex-1"
                          }`}
              >
                          <span>Détails</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
              </Link>
                        <button
                          onClick={() => setDeleteConfirmProject(project)}
                          disabled={deletingMap[project.id]}
                          className={`bg-white text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg border border-red-200 transition-all duration-200 flex items-center justify-center space-x-2 ${
                            viewMode === "list" ? "w-full" : "flex-1"
                          }`}
                        >
                          {deletingMap[project.id] ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Suppression...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span></span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Supprimer le projet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer le projet "{deleteConfirmProject.name}" ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteConfirmProject(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteProject(deleteConfirmProject.id)}
                  disabled={deletingMap[deleteConfirmProject.id]}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingMap[deleteConfirmProject.id] ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}

export default Projects;





