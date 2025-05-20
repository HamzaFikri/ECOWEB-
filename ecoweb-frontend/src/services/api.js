import axios from 'axios';

const API = 'http://localhost:8080/api';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🟢 Créer un nouveau projet
export async function createProject(project) {
  const res = await axios.post(`${API}/projects`, project);
  return res.data;
}

// 🟢 Créer un nouveau projet avec plusieurs pages
export async function createProjectWithPages(projectData) {
  try {
    // First create the project
    const project = await createProject({ name: projectData.name });
    
    // Then create all pages
    const pagePromises = projectData.urls.map(url => 
      createPage(project.id, { url })
    );
    
    await Promise.all(pagePromises);
    
    // Return the created project
    return project;
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error);
    throw error;
  }
}

// 🔵 Récupérer tous les projets
export async function getProjects() {
  const res = await axios.get(`${API}/projects`);
  return res.data;
}

// 🟡 Créer une page dans un projet
export async function createPage(projectId, page) {
  const res = await axios.post(`${API}/pages/project/${projectId}`, page);
  return res.data;
}

// 🔴 Lancer l'analyse d'une page (API externe)
export async function analyzePage(pageId) {
  const res = await axios.post(`${API}/results/analyze/${pageId}`);
  return res.data;
}

// 🟣 Récupérer toutes les pages d'un projet
export async function getProjectPages(projectId) {
  const res = await axios.get(`${API}/pages/project/${projectId}`);
  return res.data;
}

// 🟠 Récupérer les résultats d'analyse pour une page
export async function getResultByPageId(pageId) {
  try {
    const res = await axios.get(`${API}/results/page/${pageId}`);
    return res.data;
  } catch {
    return null;
  }
}

// 🔵 Récupérer un projet par ID
export async function getProjectById(projectId) {
  const res = await axios.get(`${API}/projects/${projectId}`);
  return res.data;
}

// 🟠 Supprimer une page
export async function deletePage(pageId) {
  try {
    const response = await axios.delete(`${API}/pages/${pageId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    throw error; // Propager l'erreur pour le catch dans ProjectDetails.jsx
  }
}





