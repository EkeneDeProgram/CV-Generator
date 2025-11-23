/**
 * Entry Point: Server Bootstrap File
 * -----------------------------------
 * - Imports the fully configured Express application
 * - Determines the server port (environment variable or default)
 * - Starts the HTTP server and listens for incoming requests
 * - Logs the startup status to the console
 */

import app from "./app";

const PORT = process.env.PORT || 5000;

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

