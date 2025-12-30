export const ROUTERS = {
  USER: {
    HOME: "/",
    LOGINPAGE: "/login",
    REGISTERPAGE: "/register",
    LISTCOURSE: "/courses",
    DETAILCOURSE: "/detailCourse/:id",
    CART: "/cart",
    PROFILEPAGE: "/profile",
    EDITPROFILE: "/profile/edit",
    CHANGEPASSWORD: "/profile/change-password",
    LESSONPAGE: "/learning/:slug",
    SUCCESSFULPAYMENT: "/payment-success",
    PAYMENTFAILED: "/payment-failed",
  },
  ADMIN: {
    LOGIN: "/admin/login",
    ADMINPAGE: "/admin",
  },
  INSTRUCTOR: {
    LOGIN: "/instructor/login",
    INSTRUCTORPAGE: "/instructor",
  },
};
