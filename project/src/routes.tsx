import { Route, Routes } from "react-router-dom";
import AchievementCreatePage from "./pages/AchievementCreatePage";
// ...other imports

const AppRoutes = () => {
  return (
    <Routes>
      {/* ...existing routes... */}
      <Route path="/achievements/new" element={<AchievementCreatePage />} />
      {/* ...existing routes... */}
    </Routes>
  );
};

export default AppRoutes;
