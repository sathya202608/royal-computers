import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function autoBackendPlugin() {
  let backendChild = null;

  function startBackend() {
    if (backendChild) return;
    const backendPath = path.resolve(__dirname, '../backend');
    console.log('[Royal Computers] 🚀 Auto-starting backend server on port 5000...');
    backendChild = spawn('node', ['server.js'], {
      cwd: backendPath,
      stdio: 'inherit',
      shell: true,
    });

    backendChild.on('exit', (code) => {
      console.log(`[Royal Computers] Backend server exited with code ${code}`);
      backendChild = null;
    });
  }

  return {
    name: 'auto-backend-server',
    configureServer(server) {
      // Check if backend is already listening on port 5000
      const checkReq = http.get('http://localhost:5000/api/health', (res) => {
        if (res.statusCode === 200) {
          console.log('[Royal Computers] ✅ Backend server is already running on port 5000.');
        } else {
          startBackend();
        }
      });

      checkReq.on('error', () => {
        startBackend();
      });

      server.httpServer?.on('close', () => {
        if (backendChild) {
          backendChild.kill();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), autoBackendPlugin()],
});
