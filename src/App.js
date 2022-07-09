import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import { AdminRoutes, LogedIn, PrivateRoutes } from "./routes";
import Admin from "./pages/adminPages/Admin";
import Period from "./pages/Period";
import PeriodStudent from "./pages/adminPages/PeriodStudent/PeriodStudent";
import GroupStudent from "./pages/studentPages/GroupStudent/GroupStudent";

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
            <Route exact path="/admin" element={<Admin />} />
            <Route exact path="/admin/PeriodStudent" element={
              <Layout>
                <PeriodStudent/>
              </Layout>}/>
          </Route>
          <Route path="/GroupStudent" element={
          <Layout>
            <GroupStudent></GroupStudent>
          </Layout>}>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

