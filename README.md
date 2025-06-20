
# Email Comparison Tool - Azure Virtual Machine Deployment

This project implements your exact Python logic for email comparison with a simple Azure Virtual Machine deployment.

## 🚀 Quick Start

### Prerequisites
- Azure subscription ID
- Azure CLI installed locally

### 1. Setup Azure Virtual Machine

```bash
cd azure

# Set your Azure subscription ID and run setup
chmod +x setup-vm.sh
./setup-vm.sh YOUR_SUBSCRIPTION_ID
```

This creates:
- Resource Group: `email-comparison-rg`
- Virtual Machine: Ubuntu 22.04, 2 vCPUs, 4GB RAM
- Public IP with port 8000 open

### 2. Deploy Your Application

```bash
# Deploy to the VM (use the public IP from step 1)
chmod +x deploy-to-vm.sh
./deploy-to-vm.sh YOUR_VM_PUBLIC_IP
```

### 3. Get Your API Endpoint

After deployment, your API will be available at:
```
http://YOUR_VM_PUBLIC_IP:8000/compare
```

Update this URL in `src/components/EmailComparisonTool.tsx` if needed.

## 🐍 Your Python Logic (Unchanged)

Your exact Python functions are preserved in `backend/main.py`:

- `extract_clauses_from_text()` - Unchanged
- `alpha_end_all_lines()` - Unchanged  
- `extract_with_html2text()` - Unchanged
- `extract_between_markers_from_html()` - Unchanged
- `compare_clauses_sequentially()` - Unchanged
- `display_comparison_results()` - Unchanged

## 💰 Cost Management

### Start/Stop VM to Save Costs
```bash
# Stop VM when not in use (saves money)
./vm-management.sh stop YOUR_SUBSCRIPTION_ID

# Start VM when needed
./vm-management.sh start YOUR_SUBSCRIPTION_ID

# Check status
./vm-management.sh status YOUR_SUBSCRIPTION_ID
```

### VM Costs (Approximate)
- **Running**: ~$60-80/month (Standard_B2s)
- **Stopped**: ~$5/month (storage only)

## 🔧 Local Testing

Before deploying to Azure, test locally:

```bash
# Backend testing
cd backend
python run_local.py
# API available at: http://localhost:8000

# Frontend testing  
npm run dev
# Frontend available at: http://localhost:5173
```

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI with your exact Python logic
│   ├── requirements.txt     # Python dependencies
│   └── run_local.py        # Local development server
├── azure/
│   ├── setup-vm.sh         # Create Azure VM
│   ├── deploy-to-vm.sh     # Deploy to VM
│   └── vm-management.sh    # Start/stop/manage VM
└── src/                    # Frontend React components
```

## 🛠️ VM Management Commands

```bash
# Start VM
./vm-management.sh start YOUR_SUBSCRIPTION_ID

# Stop VM (saves costs)
./vm-management.sh stop YOUR_SUBSCRIPTION_ID

# Restart VM
./vm-management.sh restart YOUR_SUBSCRIPTION_ID

# Check status
./vm-management.sh status YOUR_SUBSCRIPTION_ID

# Get public IP
./vm-management.sh ip YOUR_SUBSCRIPTION_ID

# Delete everything (⚠️ permanent)
./vm-management.sh delete YOUR_SUBSCRIPTION_ID
```

## 🔍 Troubleshooting

### Check if API is running
```bash
curl http://YOUR_VM_PUBLIC_IP:8000/health
```

### View application logs
```bash
ssh azureuser@YOUR_VM_PUBLIC_IP 'sudo journalctl -u email-comparison.service -f'
```

### Restart the service
```bash
ssh azureuser@YOUR_VM_PUBLIC_IP 'sudo systemctl restart email-comparison.service'
```

## 🎯 Features

- **Simple VM Deployment**: No Docker/Kubernetes complexity
- **Cost Effective**: Start/stop VM as needed
- **Your Exact Logic**: Python algorithms completely unchanged
- **Auto-restart**: Service automatically restarts if it crashes
- **Easy Management**: Simple scripts for all operations

## 📞 Usage Flow

1. User fills form (original document, date-time format, marker)
2. Frontend scrapes current Outlook page HTML
3. Data sent to your Azure VM API endpoint
4. Your Python logic processes the comparison
5. Results returned as formatted HTML text
6. User sees well-indented text with copy option

Your Python logic remains exactly as provided - no modifications made.
