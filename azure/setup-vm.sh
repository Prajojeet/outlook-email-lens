
#!/bin/bash

# Azure VM Setup Script
# Usage: ./setup-vm.sh <subscription-id>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <subscription-id>"
    echo "Example: $0 12345678-1234-1234-1234-123456789012"
    exit 1
fi

SUBSCRIPTION_ID=$1
RESOURCE_GROUP="email-comparison-rg"
VM_NAME="email-comparison-vm"
LOCATION="eastus"
VM_SIZE="Standard_B2s"  # 2 vCPUs, 4GB RAM - cost effective
ADMIN_USERNAME="azureuser"

echo "Setting up Azure VM for Email Comparison API..."
echo "Subscription ID: $SUBSCRIPTION_ID"
echo "Resource Group: $RESOURCE_GROUP"
echo "VM Name: $VM_NAME"
echo "Location: $LOCATION"

# Login to Azure
echo "Please login to Azure..."
az login

# Set subscription
echo "Setting subscription..."
az account set --subscription $SUBSCRIPTION_ID

# Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create VM
echo "Creating Virtual Machine..."
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --image Ubuntu2204 \
  --size $VM_SIZE \
  --admin-username $ADMIN_USERNAME \
  --generate-ssh-keys \
  --public-ip-sku Standard \
  --output table

# Open port 8000 for our API
echo "Opening port 8000..."
az vm open-port --resource-group $RESOURCE_GROUP --name $VM_NAME --port 8000

# Get VM public IP
echo "Getting VM public IP..."
VM_PUBLIC_IP=$(az vm show -d -g $RESOURCE_GROUP -n $VM_NAME --query publicIps -o tsv)

echo ""
echo "✅ VM Setup Complete!"
echo "VM Public IP: $VM_PUBLIC_IP"
echo "SSH Command: ssh $ADMIN_USERNAME@$VM_PUBLIC_IP"
echo "API Endpoint will be: http://$VM_PUBLIC_IP:8000/compare"
echo ""
echo "Next steps:"
echo "1. Run: ./deploy-to-vm.sh $VM_PUBLIC_IP"
echo "2. Update your frontend API_ENDPOINT to: http://$VM_PUBLIC_IP:8000/compare"
