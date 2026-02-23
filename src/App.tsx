/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Navbar, Footer, Home, About, Services, SolarSavings, Projects, Contact } from "./components/Lumora";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Layout for Public Pages (with Navbar and Footer)
const PublicLayout = ({ session }: { session: Session | null }) => (
  <div className="flex flex-col min-h-screen">
    {session && <Navbar />}
    <div className="flex-grow">
      <Outlet />
    </div>
    {session && <Footer />}
  </div>
);

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg flex items-center justify-center">
        <div className="text-solar-gold animate-pulse text-xl font-bold">Loading Lumora...</div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin route is completely isolated */}
        <Route path="/admin" element={<Admin />} />

        {/* Public routes wrapped in PublicLayout */}
        <Route element={<PublicLayout session={session} />}>
          <Route
            path="/auth"
            element={!session ? <Auth /> : <Navigate to="/" replace />}
          />
          <Route path="/" element={session ? <Home /> : <Navigate to="/auth" replace />} />
          <Route path="/about" element={session ? <About /> : <Navigate to="/auth" replace />} />
          <Route path="/services" element={session ? <Services /> : <Navigate to="/auth" replace />} />
          <Route path="/savings" element={session ? <SolarSavings /> : <Navigate to="/auth" replace />} />
          <Route path="/projects" element={session ? <Projects /> : <Navigate to="/auth" replace />} />
          <Route path="/contact" element={session ? <Contact /> : <Navigate to="/auth" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
