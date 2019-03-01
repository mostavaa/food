import { User } from "../models/user.model";

export class UserService {

  saveLocalStorage(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  getCurrentUser(): User{
    let user = localStorage.getItem("user");
    if (user) {
      return <User>JSON.parse(user);
    }
    return null;
  }
  clearCurrentUser() {
    localStorage.setItem("user", null);
  }
}
