import express from "express";

import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"


import databaseConnection from "./config/DBconction.js";
import ApiError from "./utils/apiError.js";
import globalError from "./middleWare/errorMiddleWare.js";
import {app, server}from"./config/socket.js"

// Routes
import mountRoutes from "./routes/index.js";


dotenv.config();
// const app = express();
app.use(express.json());
app.use(cookieParser())
// enable other domains to access our server
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
   
  })
);


// compress all responses
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// databaseConction
databaseConnection();






// Mount Routes
mountRoutes(app);


// Error handling Middleware
//  

app.use(globalError);




//start server

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(
    `Backend server is running on http://localhost:${PORT}`.green.bgRed
  );
});


// Event =>listen => callback(err) => outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err.name} ||  ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});


