/**
 * Backend Server Entry Point
 * Initializes and starts the Express server
 */

import app from "./app.js";

/**
 * Server port - defaults to 4000
 * Can be overridden via PORT environment variable
 * @type {number}
 */
const PORT = process.env.PORT || 4000;

/**
 * Start the server and listen for incoming requests
 */
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
