import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedPage from "./pages/ProtectedPage";
import { UserProvider } from "./components/LoginPage/UserProvider";
import Navbar from "./share/Navbar";
import ExplorePage from "./pages/ExplorePage";
import ReelsPage from "./pages/ReelsPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import ShowNotificationSend from "./components/HomePage/ShowNotificationSend";
import PublicacionPage from "./pages/PublicacionPage";
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <ShowNotificationSend>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedPage />}>
              <Route element={<Navbar />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/reels" element={<ReelsPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/publicacion/:id" element={<PublicacionPage />} />
              </Route>
            </Route>
          </Routes>
        </ShowNotificationSend>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
