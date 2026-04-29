Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd python-embedding; .\venv\Scripts\activate; python main.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd vaultsight-backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
