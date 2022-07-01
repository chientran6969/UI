class Authentication {
  constructor() {}

  isAuthentication() {
    const isAuthentication = localStorage.getItem("user");
    return isAuthentication !== null;
  }

  isStudent() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "Student";
  }

  isAdmin() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "Admin";
  }

  isTeacher() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "Teacher";
  }
}

const authentication = new Authentication();

export { authentication };
