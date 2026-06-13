import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Coach from "./pages/Coach.jsx";
import Battle from "./pages/Battle.jsx";
import Research from "./pages/Research.jsx";
import History from "./pages/History.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/coach"    element={<Coach />} />
        <Route path="/battle"   element={<Battle />} />
        <Route path="/research" element={<Research />} />
        <Route path="/history"  element={<History />} />
      </Routes>
    </Layout>
  );
}
