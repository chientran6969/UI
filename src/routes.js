import Home from "./component/Home";
import Login from "./component/Login";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login, layout: null },
];

export { routes };
