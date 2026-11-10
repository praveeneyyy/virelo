"""
VIRELO Unified Dev Launcher.
Launches both FastAPI Backend (port 8000) and Vite React Frontend (port 5173) concurrently.
Press Ctrl+C to terminate both gracefully.
"""
import sys
import os
import subprocess
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("\n" + "=" * 60)
    print(" [VIRELO] UNIVERSAL MEDIA INGEST & WORKSTATION")
    print("=" * 60)

    # 1. Start Backend process
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000"]
    print(" -> Launching FastAPI Backend on http://127.0.0.1:8000")
    backend_proc = subprocess.Popen(backend_cmd, cwd=root_dir)

    # 2. Check if npm exists and start Frontend process
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_cmd = [npm_cmd, "run", "dev"]
    print(" -> Launching Vite Frontend on http://localhost:5173")
    try:
        frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)
    except Exception as e:
        print(f"Failed to launch npm run dev: {e}")
        frontend_proc = None

    print("\n -> VIRELO Web Interface active at: http://localhost:5173")
    print(" -> Backend API & Interactive Docs at: http://127.0.0.1:8000/docs")
    print(" -> Production Built Bundle Served at: http://127.0.0.1:8000/")
    print(" -> Press Ctrl+C to stop both servers.\n")

    try:
        while True:
            time.sleep(0.5)
            if backend_proc.poll() is not None:
                print("Backend process terminated.")
                break
            if frontend_proc and frontend_proc.poll() is not None:
                print("Frontend process terminated.")
                break
    except KeyboardInterrupt:
        print("\nShutting down VIRELO services...")
    finally:
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
        print("VIRELO services stopped cleanly.")

if __name__ == "__main__":
    main()
