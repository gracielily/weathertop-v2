"use strict";

const userstore = require("../models/user-store");
const uuid = require("uuid");

const LoginContextData = {
  pageTitle: "Login",
};
const signupContextData = {
  pageTitle: "Signup",
};

const account = {
  login(request, response) {
    response.render("login", LoginContextData);
  },

  logout(request, response) {
    ["user", "display_welcome_message"].forEach((cookie) => {
      response.clearCookie(cookie);
    });
    response.redirect("/");
  },

  signup(request, response) {
    response.render("signup", signupContextData);
  },

  register(request, response) {
    const user = {
      id: uuid.v4(),
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
    };
    try {
      userstore.addUser(user);
      response.redirect("/");
    } catch (e) {
      const errorContextData = { ...signupContextData };
      errorContextData.error = e;
      response.render("signup", errorContextData);
    }
  },

  authenticate(request, response) {
    const user = userstore.getByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie("user", user.email);
      response.cookie("display_welcome_message", true);
      response.redirect("/dashboard");
    } else {
      const errorContextData = { ...LoginContextData };
      errorContextData.error = "Invalid Credentials. Please try again.";
      response.render("login", errorContextData);
    }
  },

  getLoggedInUserOrRedirect(request, response) {
    const user = userstore.getByEmail(request.cookies.user);
    if (!user) {
      response.redirect("/login");
    }
    return user;
  },

  edit(request, response) {
    const user = userstore.getByEmail(request.cookies.user);
    if (user.id !== request.params.id) {
      return response.render("404");
    } else {
      response.render("editdetails", {
        pageTitle: "Edit User Details",
        user: user,
        navBreadcrumbs: [
          { title: "Dashboard", link: "/dashboard" },
          { title: "Account Details" },
        ],
        postUrl: '/users/' + user.id + '/save-details'
      });
    }
  },
  
  saveDetails(request, response){
    const user = userstore.getByEmail(request.cookies.user);
    if (user.id !== request.params.id) {
      response.render("404");
    } else {
      const updatedUser = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
    };
      userstore.updateUser(user, updatedUser);
      response.redirect('/users/' + user.id);
    }
  }
};

module.exports = account;
