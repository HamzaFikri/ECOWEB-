import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, createPage, analyzePage } from '../services/api';

function ProjectForm() {
  const [projectName, setProjectName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (projectName.length < 3) {
      errors.projectName = "Le nom du projet doit contenir au moins 3 caractères";
    }
    if (!url.match(/^https?:\/\/.+/)) {
      errors.url = "L'URL doit commencer par http:// ou https://";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setValidationErrors({});

    try {
      const newProject = await createProject({ name: projectName });
      const page = await createPage(newProject.id, { url });
      const analysis = await analyzePage(page.id);

      setResult(analysis);
      setShowSuccess(true);
      
      // Navigate after showing success animation
      setTimeout(() => {
        navigate(`/projects/${newProject.id}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
    }

    setLoading(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Analyse EcoWeb - ${projectName}`,
        text: `Découvrez l'analyse environnementale de ${projectName} sur EcoWeb!`,
        url: window.location.href
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const tooltips = {
    co2: "Émission de CO2 générée par le chargement de la page",
    weight: "Taille totale de la page en kilo-octets",
    https: "Nombre de requêtes HTTPS effectuées",
    hosting: "Indique si l'hébergeur utilise des énergies renouvelables",
    score: "Score global basé sur tous les critères d'analyse"
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
      <div className="text-center mb-8">
        <span className="text-4xl mb-4 block">🌿</span>
        <h2 className="text-2xl font-bold text-gray-900">Analyser un site web</h2>
        <p className="text-gray-600 mt-2">Vérifiez l'impact environnemental de votre site web</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
            Nom du projet
          </label>
          <input
            id="projectName"
            type="text"
            maxLength={56}
            required
            placeholder="Ex: Mon site web écologique"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
              validationErrors.projectName ? 'border-red-500' : 'border-gray-300'
            }`}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          {validationErrors.projectName && (
            <p className="text-sm text-red-500">{validationErrors.projectName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL du site web
          </label>
          <input
            id="url"
            type="url"
            required
            placeholder="https://exemple.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
              validationErrors.url ? 'border-red-500' : 'border-gray-300'
            }`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {validationErrors.url && (
            <p className="text-sm text-red-500">{validationErrors.url}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyse en cours...
              </>
            ) : (
              'Analyser le site'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyse terminée !</h3>
            <p className="text-gray-600">Redirection vers les résultats...</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <span className="mr-2">🧪</span>
              Résultat de l'analyse
            </h3>
            <button
              onClick={handleShare}
              className="text-green-600 hover:text-green-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Partager
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm group relative">
              <p className="text-sm text-gray-600">Émission CO2</p>
              <p className="text-lg font-semibold text-gray-900">{result.co2Emission} g</p>
              <div className="absolute bottom-0 left-0 w-full bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {tooltips.co2}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm group relative">
              <p className="text-sm text-gray-600">Poids de la page</p>
              <p className="text-lg font-semibold text-gray-900">{result.pageWeight} Ko</p>
              <div className="absolute bottom-0 left-0 w-full bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {tooltips.weight}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm group relative">
              <p className="text-sm text-gray-600">Requêtes HTTPS</p>
              <p className="text-lg font-semibold text-gray-900">{result.httpsRequests}</p>
              <div className="absolute bottom-0 left-0 w-full bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {tooltips.https}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm group relative">
              <p className="text-sm text-gray-600">Hébergement vert</p>
              <p className="text-lg font-semibold text-gray-900">
                {result.greenHosting ? '✅ Oui' : '❌ Non'}
              </p>
              <div className="absolute bottom-0 left-0 w-full bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {tooltips.hosting}
              </div>
            </div>
          </div>
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm group relative">
            <p className="text-sm text-gray-600">Score global</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              <span className="text-lg font-semibold text-gray-900">{result.score.toFixed(2)}%</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {tooltips.score}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectForm;
