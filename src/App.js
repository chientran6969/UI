import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import { AdminRoutes, LogedIn, PrivateRoutes } from "./routes";
import Admin from "./pages/adminPages/Admin";
import PeriodStudent from "./pages/adminPages/PeriodStudent/PeriodStudent";
import GroupStudent from "./pages/studentPages/GroupStudent/GroupStudent";
import Period from "./pages/adminPages/Period/Period";
import PeriodTopic from "./pages/adminPages/PeriodTopic/PeriodTopic";
import Topic from "./pages/adminPages/Topic/Topic";
import TopicForStudent from "./pages/studentPages/TopicForStudent/TopicForStudent.js";
import PeriodTopicStudent from "./pages/studentPages/PeriodTopicStudent/PeriodTopicStudent.js";
import MyPeriodTopicStudent from "./pages/studentPages/MyPeriodTopicStudent/MyPeriodTopicStudent";
import PTSForTeacher from "./pages/teacherPages/PTSForTeacher/PTSForTeacher";
import PeriodStudentShare from "./pages/teacherPages/PeriodStudentShare/PeriodStudentShare";
import PeriodTopicShare from "./pages/teacherPages/PeriodTopicShare/PeriodTopicShare";
import Report from "./pages/Report/Report";

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

          </Route>
          <Route exact path="/admin/PeriodStudent" element={
            <Layout>
              <PeriodStudent />
            </Layout>} />
          <Route exact path="/admin/Period" element={
            <Layout>
              <Period></Period>
            </Layout>
          } />
          <Route exact path="/" element={
            <Layout>
              <Report></Report>
            </Layout>}>
          </Route>
          <Route exact path="/GroupStudent" element={
            <Layout>
              <GroupStudent></GroupStudent>
            </Layout>}>
          </Route>
          <Route exact path="/admin/PeriodTopic" element={
            <Layout>
              <PeriodTopic></PeriodTopic>
            </Layout>}>
          </Route>
          <Route exact path="/admin/Topic" element={
            <Layout>
              <Topic></Topic>
            </Layout>}>
          </Route>
          <Route exact path="/Topic" element={
            <Layout>
              <TopicForStudent></TopicForStudent>
            </Layout>}>
          </Route>
          <Route exact path="/PeriodTopicStudent" element={
            <Layout>
              <PeriodTopicStudent></PeriodTopicStudent>
            </Layout>}>
          </Route>
          <Route exact path="/MyPeriodTopicStudent" element={
            <Layout>
              <MyPeriodTopicStudent></MyPeriodTopicStudent>
            </Layout>}>
          </Route>
          <Route exact path="/ApprovalPTS" element={
            <Layout>
              <PTSForTeacher></PTSForTeacher>
            </Layout>}>
          </Route>
          <Route exact path="/PeriodStudent" element={
            <Layout>
              <PeriodStudentShare></PeriodStudentShare>
            </Layout>}>
          </Route>
          <Route exact path="/PeriodTopic" element={
            <Layout>
              <PeriodTopicShare></PeriodTopicShare>
            </Layout>}>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

