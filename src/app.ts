// // Imports: Express, middleware (body-parser, cors), custom routes, and utilities (path)
// import express, { Application } from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import cvRoutes from "./routes/cvRoutes";
// import path from "path";

// // Initialize the Express application
// const app: Application = express();

// // Middleware setup: handle CORS, parse JSON & form data, configure EJS views, and serve static files
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "templates"));
// app.use(express.static(path.join(__dirname, "public")));

// // Routes: mount all CV-related API routes under /api/cv
// app.use("/api/cv", cvRoutes);

// // Export the app for use in the server entry point
// export default app;


// Imports: Express, middleware (body-parser, cors), custom routes, Swagger, and utilities (path)
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cvRoutes from "./routes/cvRoutes";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

// Initialize the Express application
const app: Application = express();

// Middleware setup: handle CORS, parse JSON & form data, configure EJS views, and serve static files
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use(express.static(path.join(__dirname, "public")));

// Swagger Docs Route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes: mount all CV-related API routes under /api/cv
app.use("/api/cv", cvRoutes);

// Export the app for use in the server entry point
export default app;
