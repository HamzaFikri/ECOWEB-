# ECOWEB - Ecological Web Analysis Tool

ECOWEB is a modern web application that helps analyze and improve the ecological impact of websites. It provides detailed insights into CO2 emissions, page weight, and other environmental metrics to help make the web more sustainable.

## 🌟 Features

- **Website Analysis**: Analyze any website's ecological impact with detailed metrics
- **Multi-language Support**: Available in English, French, and Arabic with RTL support
- **Project Management**: Create and manage multiple projects with multiple URLs
- **Detailed Metrics**:
  - CO2 emissions tracking
  - Page weight analysis
  - Request count monitoring
  - Green hosting verification
  - Ecological score rating (A+ to F)
- **Data Export**: Export analysis results in JSON format
- **Responsive Design**: Modern UI that works on all devices
- **User Authentication**: Secure login and registration system
- **Dashboard**: Visual representation of project statistics and impact

## 🚀 Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management
- Chart.js for data visualization

### Backend
- Java Spring Boot
- Spring Security for authentication
- Spring Data JPA for database operations
- MariaDB
- JWT Authentication

## 📋 Prerequisites

- Node.js (v14 or higher) for frontend
- Java JDK 17 or higher
- Maven
- MariaDB
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohammedhamzafikri/ECOWEB-V3.git
   cd ECOWEB-V3
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ecoweb-frontend
   npm install
   ```

3. **Set up Backend**
   ```bash
   cd ../ecoweb-backend
   mvn install
   ```

4. **Set up Environment Variables**

   Create a `application.properties` file in the backend directory:
   ```properties
   spring.datasource.url=jdbc:mariadb://localhost:3306/ecoweb
   spring.datasource.username=your_mariadb_user
   spring.datasource.password=your_mariadb_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect
   jwt.secret=your_jwt_secret
   server.port=8080
   ```

   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:8080
   ```

## 🚀 Running the Application

1. **Start the Backend Server**
   ```bash
   cd ecoweb-backend
   mvn spring-boot:run
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd ecoweb-frontend
   npm run dev
   ```

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

1. **Create an Account**
   - Register with your email and password
   - Log in to access the dashboard

2. **Create a Project**
   - Click "New Project"
   - Enter project name and URLs to analyze
   - Add multiple URLs to a single project

3. **Analyze Websites**
   - View detailed ecological metrics for each URL
   - Get ecological score rating (A+ to F)
   - Monitor CO2 emissions and page weight
   - Check green hosting status

4. **Export Data**
   - Export analysis results in JSON format
   - Use the data for further analysis or reporting

## 🌐 Multi-language Support

The application supports three languages:
- English (en)
- French (fr)
- Arabic (ar) with RTL support

Language can be changed using the language switcher in the navigation bar.

## 🔒 Security

- JWT-based authentication
- Spring Security
- Password hashing with BCrypt
- CORS protection
- Input validation
- SQL injection prevention

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Analysis
- `POST /api/results/analyze/{pageId}` - Analyze a page
- `GET /api/results/{pageId}` - Get analysis results

## 👥 Author

- Mohammed Hamza Fikri - Owner and Developer

## 🙏 Acknowledgments

- Website Carbon Calculator API
- Green Web Foundation
- All contributors and supporters

## 📞 Support

For support, create an issue in the repository or contact the developer.

## 🔄 Updates

Check the [CHANGELOG.md](CHANGELOG.md) file for recent updates and changes. 