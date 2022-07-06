import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import { AdminRoutes, LogedIn, PrivateRoutes } from "./routes";
import Admin from "./pages/adminPages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<PrivateRoutes />}>
            <Route
              exact
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
          </Route>
          <Route exact path="/login" element={<LogedIn />}>
            <Route exact path="/login" element={<Login />} />
          </Route>
          <Route exact path="/admin" element={<AdminRoutes />}>
            <Route
              exact
              path="/admin"
              element={
                <Layout>
                  <Admin />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

