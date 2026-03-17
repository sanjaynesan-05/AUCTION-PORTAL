backend 
    cd 'd:\AUCTION-PORTAL\backend';
    .\.venv\Scripts\Activate.ps1;
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload

frontend
    npm run dev