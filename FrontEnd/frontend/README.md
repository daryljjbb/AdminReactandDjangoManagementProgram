# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



AdminReactandDjangoManagementProgram
A full‑stack management system built with React (frontend) and Django REST Framework (backend).
The frontend is deployed on GitHub Pages, while the backend runs locally (or can be deployed separately).

This project includes:

User authentication

Admin‑only dashboard

Customer management

Protected routes

Session‑based login

Cross‑origin communication between GitHub Pages and Django


⭐ Features
🔐 Authentication
Django session‑based login

Protected routes in React

Auto‑redirect for unauthorized users

Admin‑only pages

👥 Customer Management
View all customers

View customer details

Pagination, search, and filtering

🧭 Routing
React Router with HashRouter for GitHub Pages

Layout with sidebar + navbar

Clean navigation structure

🌐 Cross‑Origin Support
GitHub Pages → Django communication

CORS + CSRF configured for secure cookie handling

📦 API Layer
Axios instance with CSRF + credentials

/me endpoint for authentication state

CRUD endpoints for customers

📁 Project Structure

AdminReactandDjangoManagementProgram/
│
├── Backend/ (Django API)
│   ├── manage.py
│   ├── settings.py
│   ├── api/
│   └── ...
│
└── FrontEnd/
    └── frontend/ (React App)
        ├── src/
        ├── public/
        ├── package.json
        └── ...


🔐 Django CORS & CSRF Configuration
Add this to settings.py:

CORS_ALLOWED_ORIGINS = [
    "https://daryljjbb.github.io",
    "http://localhost:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "https://daryljjbb.github.io",
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SECURE = True


🌐 Frontend Setup (React)
Navigate into the React folder:

cd FrontEnd/frontend

npm install

npm start


🚀 Deploying React to GitHub Pages
1. Install gh-pages

npm install --save gh-pages

2. Add homepage to package.json
"homepage": "https://daryljjbb.github.io/AdminReactandDjangoManagementProgram"

3. Add deploy scripts
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

4. Deploy

npm run build
npm run deploy


5. GitHub Pages Settings
Go to:

Repository → Settings → Pages

Select Branch: gh-pages

Save

🔁 Routing on GitHub Pages
GitHub Pages does not support server‑side routing.
Use:

import { HashRouter } from "react-router-dom";

#/dashboard
#/customers

📚 API Documentation
Authentication
POST /api/login/
Login with username + password.
Returns session cookie.

GET /api/me/
Returns the currently authenticated user.

Example response:

{
  "username": "admin",
  "is_staff": true,
  "is_superuser": false
}

Customers
GET /api/customers/
Returns paginated list of customers.

GET /api/customers/:id/
Returns details for a single customer.

POST /api/customers/
Create a new customer (admin only).

PUT /api/customers/:id/
Update customer.

DELETE /api/customers/:id/
Delete customer.


🔧 Axios Configuration

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const csrf = getCookie("csrftoken");
  if (csrf) config.headers["X-CSRFToken"] = csrf;
  return config;
});
