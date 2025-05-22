# facachievement
# Faculty Achievements System

This project is a full-stack web application for managing faculty achievements, built with React, Express, MongoDB, and Tailwind CSS.

---

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local or remote instance)

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd project-bolt-sb1-rjywj7gm/project
   ```

2. **Install all dependencies:**
   ```sh
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the `project` directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/your-db-name
```

Replace `your-db-name` with your desired MongoDB database name.

---

## Scripts

- **Start development server:**
  ```sh
  npm run dev
  ```
  - Starts the Vite dev server for the frontend.
  - Also starts the Express backend on port `5000`.

- **Build for production:**
  ```sh
  npm run build
  ```

- **Preview production build:**
  ```sh
  npm run preview
  ```

- **Lint the code:**
  ```sh
  npm run lint
  ```

---

## Project Structure

- `src/` - Frontend React code and backend API services.
- `src/services/` - Express API, MongoDB models, file upload logic.
- `src/pages/` - React pages.
- `src/components/` - Reusable React components.
- `src/types/` - TypeScript types/interfaces.
- `index.html` - Main HTML entry point.
- `vite.config.ts` - Vite configuration.
- `tailwind.config.js` - Tailwind CSS configuration.

---

## Main Dependencies

### Runtime

- **Frontend:**
  - `react`, `react-dom`, `react-router-dom` - UI and routing
  - `react-hook-form`, `@hookform/resolvers`, `zod` - Forms and validation
  - `react-chartjs-2`, `chart.js` - Charts
  - `lucide-react` - Icons
  - `date-fns` - Date utilities
  - `axios` - HTTP requests

- **Backend:**
  - `express` - API server
  - `mongoose`, `mongodb` - MongoDB ODM and driver
  - `dotenv` - Environment variables
  - `cors` - CORS middleware
  - `multer`, `multer-gridfs-storage` - File uploads and GridFS
  - `gridfs-stream` - GridFS file streaming
  - `jwt-decode` - JWT decoding

### Development

- `@vitejs/plugin-react`, `vite` - Build tools
- `tailwindcss`, `postcss`, `autoprefixer` - CSS framework and tooling
- `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` - Linting
- `typescript`, `@types/react`, `@types/react-dom`, `typescript-eslint` - TypeScript support

---

## Running the App

1. **Start MongoDB**  
   Make sure your MongoDB server is running locally or update `MONGO_URI` in `.env` for a remote server.

2. **Start the app**
   ```sh
   npm run dev
   ```
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

3. **Login and use the app**  
   - Register or login as a teacher/admin.
   - Upload achievements, manage users, and view statistics.

---

## Notes

- **PDF Uploads:**  
  Certificates are uploaded and stored using MongoDB GridFS.
- **User Roles:**  
  Supports teacher, HOD, admin, and student roles.
- **Styling:**  
  Uses Tailwind CSS and Inter font.

---

## Troubleshooting

- If you get MongoDB connection errors, check your `MONGO_URI` and ensure MongoDB is running.
- If you change dependencies, re-run `npm install`.

---

## License

MIT
