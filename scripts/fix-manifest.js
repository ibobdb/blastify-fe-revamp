const fs = require('fs');
const path = require('path');

// Paths for the client reference manifest
const manifestPath = path.join(process.cwd(), '.next', 'server', 'app', '(landing)', 'page_client-reference-manifest.js');
const standaloneManifestPath = path.join(process.cwd(), '.next', 'standalone', '.next', 'server', 'app', '(landing)', 'page_client-reference-manifest.js');

// Create a minimal client reference manifest
const minimalManifest = `module.exports = {
  clientModules: {},
  ssrModuleMapping: {},
  edgeSSRModuleMapping: {},
  entryCSSFiles: {},
  entryJSFiles: {}
};`;

// Function to create manifest file
function createManifest(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`Creating missing ${label}...`);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      fs.writeFileSync(filePath, minimalManifest);
      console.log(`✓ ${label} created successfully`);
    } catch (err) {
      console.error(`Error creating ${label}:`, err.message);
      process.exit(1);
    }
  } else {
    console.log(`✓ ${label} already exists`);
  }
}

// Create both manifests
createManifest(manifestPath, 'client reference manifest');
createManifest(standaloneManifestPath, 'standalone client reference manifest');
