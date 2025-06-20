
# Email Comparison Tool - Complete Azure Deployment Guide

This project implements your exact Python logic for email comparison with a complete Azure cloud deployment pipeline.

## 🚀 Quick Start

### Prerequisites
- Azure subscription
- Docker installed
- Azure CLI installed
- kubectl installed

### 1. Setup Azure Resources

```bash
# Clone and navigate to project
cd azure

# Set your Azure subscription ID
export SUBSCRIPTION_ID="your-subscription-id-here"

# Run setup script
chmod +x setup-azure-resources.sh
./setup-azure-resources.sh
```

This creates:
- Resource Group
- Azure Container Registry (ACR)  
- Azure Kubernetes Service (AKS)

### 2. Deploy the Backend

```bash
# Set environment variables (from setup script output)
export AZURE_SUBSCRIPTION_ID="your-subscription-id"
export AZURE_RESOURCE_GROUP="email-comparison-rg"
export AZURE_ACR_NAME="your-acr-name"
export AZURE_AKS_CLUSTER="email-comparison-aks"

# Deploy
chmod +x deploy.sh
./deploy.sh
```

### 3. Get Your API Endpoint

```bash
kubectl get service email-comparison-service
```

Copy the EXTERNAL-IP and use: `http://EXTERNAL-IP/compare`

### 4. Use the Frontend

1. Open the frontend application
2. Enter your API endpoint URL
3. Fill in your document comparison data
4. Click Compare on any Outlook page

## 🐍 Your Python Logic (Unchanged)

Your exact Python functions are preserved in `backend/main.py`:

- `extract_clauses_from_text()` - Unchanged
- `alpha_end_all_lines()` - Unchanged  
- `extract_with_html2text()` - Unchanged
- `extract_between_markers_from_html()` - Unchanged
- `compare_clauses_sequentially()` - Unchanged
- `display_comparison_results()` - Unchanged

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI with your exact Python logic
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Container configuration
├── k8s/
│   └── deployment.yaml     # Kubernetes deployment
├── azure/
│   ├── setup-azure-resources.sh   # Create Azure resources
│   └── deploy.sh                  # Deploy to Azure
└── src/                    # Frontend React components
```

## 🔧 Manual Deployment Steps

If you prefer manual deployment:

### 1. Create Azure Resources
```bash
az group create --name email-comparison-rg --location eastus
az acr create --resource-group email-comparison-rg --name myacrname --sku Basic
az aks create --resource-group email-comparison-rg --name myakscluster --node-count 2
```

### 2. Build and Push Docker Image
```bash
cd backend
az acr login --name myacrname
docker build -t myacrname.azurecr.io/email-comparison-api:latest .
docker push myacrname.azurecr.io/email-comparison-api:latest
```

### 3. Deploy to Kubernetes
```bash
az aks get-credentials --resource-group email-comparison-rg --name myakscluster
kubectl apply -f k8s/deployment.yaml
kubectl get service email-comparison-service
```

## 🎯 Features

- **Exact Python Logic**: Your algorithms are completely unchanged
- **HTML Output**: Results displayed as formatted, indented text
- **Copy Functionality**: Easy copying of comparison results
- **Azure Scaling**: Automatic scaling with Kubernetes
- **Chrome Extension**: Works as browser extension on Outlook
- **Secure**: API endpoint configurable per user

## 🛠️ Customization

- **Scaling**: Modify replicas in `k8s/deployment.yaml`
- **Resources**: Adjust memory/CPU limits in deployment
- **Dependencies**: Add packages to `backend/requirements.txt`

## 📞 Support

The system processes:
1. Your original document → `alpha_end_all_lines()` → `extract_clauses_from_text()`
2. HTML content → `extract_between_markers_from_html()` → `extract_clauses_from_text()`  
3. Both results → `compare_clauses_sequentially()` → `display_comparison_results()`
4. Final HTML displayed as indented text in the frontend

Your Python logic remains exactly as provided - no modifications made.
