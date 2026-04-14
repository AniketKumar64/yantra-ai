import { Toaster } from "@/components/ui/sonner";
import { Routes, useLocation, Route } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import Home from "./pages/Home";
import Community from "./pages/Community";
import MyProjects from "./pages/MyProjects";
import Preview from "./pages/Preview";
import Pricing from "./pages/Pricing";
import View from "./pages/view";
import AuthPage from "./pages/auth/AuthPage";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./Context/ThemeContext";
import AnimatedGridBackground from "./components/Common/AnimatedGridBackground";
import FooterSection from "./components/Home/FooterSection";
import Projects from "./pages/projects";


const App = () => {
  const { pathname } = useLocation();

const hideNavbar =
  (pathname.startsWith("/projects") && pathname !== "/projects") ||
  pathname.startsWith("/view/") ||
  pathname.startsWith("/preview/")
  || pathname.startsWith("/project/");

  const hideFooter =
    (pathname.startsWith("/projects") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/account/settings")||
    pathname.startsWith("/project/");
  return (
    <div>
      <ThemeProvider>
        <Toaster />
        {!hideNavbar && <Navbar />}
        <AnimatedGridBackground />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/projects" element={<MyProjects />} />
          <Route path="/project/:projectId" element={<Projects />} />
          <Route path="/preview/:projectId" element={<Preview />} />
          <Route path="/preview/:projectId/:versionId" element={<Preview />} />
          <Route path="/view/:projectId" element={<View />} />
          <Route path="/auth/:pathname" element={<AuthPage />} />
          <Route path="/account/settings" element={<Settings />} />
        </Routes>
        {!hideFooter && <FooterSection />}
      </ThemeProvider>
    </div>
  );
};

export default App;
