import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cvRoutes from "./routes/cvRoutes";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { requestLogger } from "./middleware/requestLogger";

const app: Application = express();

// Global Request Logger (applies to all routes)
app.use(requestLogger);

// Core middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use(express.static(path.join(__dirname, "public")));

// Swagger docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/cv", cvRoutes);

export default app;
