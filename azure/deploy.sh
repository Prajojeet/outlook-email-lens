
#!/bin/bash

# Azure deployment script
# Make sure to set these environment variables before running:
# export AZURE_SUBSCRIPTION_ID="your-subscription-id"
# export AZURE_RESOURCE_GROUP="your-resource-group"
# export AZURE_ACR_NAME="your-acr-name"
# export AZURE_AKS_CLUSTER="your-aks-cluster"

set -e

echo "Starting Azure deployment..."

# Login to Azure (uncomment if not already logged in)
# az login

# Set subscription
az account set --subscription $AZURE_SUBSCRIPTION_ID

# Login to ACR
az acr login --name $AZURE_ACR_NAME

# Build and push Docker image
echo "Building Docker image..."
cd backend
docker build -t $AZURE_ACR_NAME.azurecr.io/email-comparison-api:latest .

echo "Pushing image to ACR..."
docker push $AZURE_ACR_NAME.azurecr.io/email-comparison-api:latest

# Get AKS credentials
echo "Getting AKS credentials..."
az aks get-credentials --resource-group $AZURE_RESOURCE_GROUP --name $AZURE_AKS_CLUSTER

# Update deployment YAML with correct ACR name
cd ../k8s
sed -i "s/YOUR_ACR_NAME/$AZURE_ACR_NAME/g" deployment.yaml

# Deploy to Kubernetes
echo "Deploying to Kubernetes..."
kubectl apply -f deployment.yaml

# Wait for deployment
echo "Waiting for deployment to be ready..."
kubectl rollout status deployment/email-comparison-api

# Get service URL
echo "Getting service URL..."
kubectl get service email-comparison-service

echo "Deployment completed successfully!"
echo "Your API endpoint will be available at the EXTERNAL-IP shown above on port 80"
echo "Full URL: http://EXTERNAL-IP/compare"
