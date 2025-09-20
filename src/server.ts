// Import the configured Express app (with middleware, routes, etc.)
import app from "./app";

// Define the port: use environment variable if available, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on the chosen port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

