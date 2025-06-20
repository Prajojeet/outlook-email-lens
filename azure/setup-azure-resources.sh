
#!/bin/bash

# Azure resource setup script
# Set these variables before running
SUBSCRIPTION_ID="your-subscription-id"
RESOURCE_GROUP="email-comparison-rg"
LOCATION="eastus"
ACR_NAME="emailcomparisonacr$(date +%s)"
AKS_CLUSTER="email-comparison-aks"

set -e

echo "Setting up Azure resources..."

# Login to Azure
az login

# Set subscription
az account set --subscription $SUBSCRIPTION_ID

# Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Registry
echo "Creating Azure Container Registry..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

# Create AKS cluster
echo "Creating AKS cluster..."
az aks create \
    --resource-group $RESOURCE_GROUP \
    --name $AKS_CLUSTER \
    --node-count 2 \
    --node-vm-size Standard_D2s_v3 \
    --enable-addons monitoring \
    --generate-ssh-keys \
    --attach-acr $ACR_NAME

echo "Azure resources created successfully!"
echo "Resource Group: $RESOURCE_GROUP"
echo "ACR Name: $ACR_NAME"
echo "AKS Cluster: $AKS_CLUSTER"
echo ""
echo "Set these environment variables for deployment:"
echo "export AZURE_SUBSCRIPTION_ID=\"$SUBSCRIPTION_ID\""
echo "export AZURE_RESOURCE_GROUP=\"$RESOURCE_GROUP\""
echo "export AZURE_ACR_NAME=\"$ACR_NAME\""
echo "export AZURE_AKS_CLUSTER=\"$AKS_CLUSTER\""
