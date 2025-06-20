
# Local Testing Guide

## Prerequisites
- Python 3.11+ installed
- Node.js and npm/yarn for frontend

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server:**
   ```bash
   python run_local.py
   ```

   The server will start at `http://localhost:8000`

## Frontend Setup

1. **Make sure the API endpoint in your frontend points to localhost:**
   - In `src/components/EmailComparisonTool.tsx`, the `API_ENDPOINT` is already set to `http://localhost:8000/compare`

2. **Start the frontend development server:**
   ```bash
   npm install  # if not already done
   npm run dev
   ```

## Testing the Application

1. **Test the backend directly:**
   - Visit `http://localhost:8000/health` to check if the API is running
   - Use Postman or curl to test the `/compare` endpoint

2. **Test the full application:**
   - Open your frontend in the browser
   - Fill in the form with test data
   - Open a Microsoft Outlook page in another tab
   - Switch back to your app and try the comparison

## Sample Test Data

**Original Document:**
```
C1. ALL NEGOS / EVENTUAL FIXTURE TO BE KEPT PRIVATE AND CONFIDENTIAL.
C2. This is another clause for testing purposes.
*****
```

**Date-Time Format:**
```
Mon 6/16/2025 11:20 AM
```

**End Marker:**
```
*
```

## Troubleshooting

- **CORS Issues:** The backend is configured to allow all origins for development
- **Port Conflicts:** Change the port in `run_local.py` if 8000 is already in use
- **Package Issues:** Make sure all Python packages are installed correctly

## When Ready for Azure

1. Update the `API_ENDPOINT` in `EmailComparisonTool.tsx` to your Azure URL
2. Use the provided Azure deployment scripts
3. Follow the Azure setup guide in the project files
