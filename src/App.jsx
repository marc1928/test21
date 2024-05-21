import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import SignInPage from "./pages/signin";
import HomePage from "./pages/home";
import SignUpPage from "./pages/signup";
import DashboardPage from "./pages/private/dashboard";
import { DashboardLayout } from "./components/dashboard/dashboard-layout";
import QuestionsPage from "./pages/private/questions";
import QuizzPage from "./pages/private/quizz-page";
import EditQuizzPage from "./pages/private/edit-quizz";
import EditQuestionPage from "./pages/private/edit-question";
import ManagersPage from "@/pages/private/managers-page.jsx";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useContext, useEffect } from "react";
import QuizzShare from "@/pages/quizz-share.jsx";
import Quizz from "@/pages/quizz.jsx";
import QuizzList from "@/pages/quizz-list.jsx";
import SettingsPage from "./pages/private/settings";
import Notifications from "./pages/private/notification";
import Forgetpassword from "./pages/forgetpassword";
import { AuthContext } from "./context/AuthContext";
import LearnersPage from "./pages/private/learners-page";
import StatisticUser from "./pages/private/statistic-user";

function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    nprogress.start();
    nprogress.done();
  }, [pathname]);

  const { currentUser, token } = useContext(AuthContext);
  const RequireAuth = ({ children }) => {
    const isAuthenticated = currentUser && token;
    return currentUser ? children : <Navigate to="/" />;
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/forget-password" element={<Forgetpassword />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<RequireAuth><DashboardLayout/></RequireAuth>}>       
        <Route index element={<RequireAuth><DashboardPage/></RequireAuth>} />  
        <Route path="/dashboard/quizz" element={<RequireAuth><QuestionsPage/></RequireAuth>} />
        <Route path="/dashboard/managers" element={<RequireAuth><ManagersPage/></RequireAuth>} />
        <Route path="/dashboard/learners" element={<RequireAuth><LearnersPage/></RequireAuth>} />
        <Route path="/dashboard/managers/:managerName/edit" element={<RequireAuth><ManagersPage/></RequireAuth>} />
        <Route path="/dashboard/quizz/:quizzId/:quizzName" element={<RequireAuth><QuizzPage/></RequireAuth>} />
        <Route path="/dashboard/quizz/:quizzId/edit" element={<RequireAuth><EditQuizzPage/></RequireAuth>} />
        <Route path="/dashboard/quizz/:quizzName/questions/:questionId/edit" element={<RequireAuth><EditQuestionPage/></RequireAuth>} />
        <Route path="/dashboard/settings" element={<RequireAuth><SettingsPage/></RequireAuth>} />
        <Route path="/dashboard/notifications" element={<RequireAuth><Notifications/></RequireAuth>} />
      </Route>
      <Route path="/quizz/:quizzId/share" element={<RequireAuth><QuizzShare/></RequireAuth>} />      
      <Route path="/quizz/:quizzId" element={<RequireAuth><Quizz/></RequireAuth>} />
      <Route path="/stats/:userId" element={<RequireAuth><StatisticUser/></RequireAuth>} />
      <Route path="/quizz/" element={<RequireAuth><QuizzList/></RequireAuth>} />
    </Routes>
  )
}

export default App;

export const PrivateRoute = (children) => {
  return { children }
}
