import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import messageRoute from "./message.route.js"

// Mount all application routes
const mountRoutes = (app) => {
  app.get("/", (req, res) => {
    res.send("Chat app server is running");
  });

  // Authentication routes
  app.use("/api/v1/auth", authRoute);

  // User-related routes
  app.use("/api/v1/users", userRoute);
    app.use("/api/v1/message", messageRoute)
};

export default mountRoutes;
