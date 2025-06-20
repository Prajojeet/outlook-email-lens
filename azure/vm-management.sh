
#!/bin/bash

# VM Management Script
# Usage: ./vm-management.sh <action> [subscription-id]
# Actions: start, stop, restart, status, delete

ACTION=$1
SUBSCRIPTION_ID=$2
RESOURCE_GROUP="email-comparison-rg"
VM_NAME="email-comparison-vm"

if [ $# -eq 0 ]; then
    echo "Usage: $0 <action> [subscription-id]"
    echo "Actions:"
    echo "  start     - Start the VM"
    echo "  stop      - Stop the VM (saves costs)"
    echo "  restart   - Restart the VM"
    echo "  status    - Check VM status"
    echo "  delete    - Delete the VM and resources"
    echo "  ip        - Get VM public IP"
    exit 1
fi

# Login and set subscription if provided
if [ ! -z "$SUBSCRIPTION_ID" ]; then
    az account set --subscription $SUBSCRIPTION_ID
fi

case $ACTION in
    "start")
        echo "Starting VM..."
        az vm start --resource-group $RESOURCE_GROUP --name $VM_NAME
        VM_IP=$(az vm show -d -g $RESOURCE_GROUP -n $VM_NAME --query publicIps -o tsv)
        echo "VM started. Public IP: $VM_IP"
        echo "API endpoint: http://$VM_IP:8000/compare"
        ;;
    "stop")
        echo "Stopping VM... (This will save costs)"
        az vm deallocate --resource-group $RESOURCE_GROUP --name $VM_NAME
        echo "VM stopped and deallocated."
        ;;
    "restart")
        echo "Restarting VM..."
        az vm restart --resource-group $RESOURCE_GROUP --name $VM_NAME
        ;;
    "status")
        echo "VM Status:"
        az vm show -d --resource-group $RESOURCE_GROUP --name $VM_NAME --query powerState -o tsv
        VM_IP=$(az vm show -d -g $RESOURCE_GROUP -n $VM_NAME --query publicIps -o tsv)
        echo "Public IP: $VM_IP"
        ;;
    "delete")
        echo "⚠️  WARNING: This will delete the entire resource group and all resources!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo "Deleting resource group..."
            az group delete --name $RESOURCE_GROUP --yes --no-wait
            echo "Deletion initiated. Resources will be removed in background."
        else
            echo "Deletion cancelled."
        fi
        ;;
    "ip")
        VM_IP=$(az vm show -d -g $RESOURCE_GROUP -n $VM_NAME --query publicIps -o tsv)
        echo "VM Public IP: $VM_IP"
        echo "API endpoint: http://$VM_IP:8000/compare"
        ;;
    *)
        echo "Unknown action: $ACTION"
        echo "Use: start, stop, restart, status, delete, or ip"
        exit 1
        ;;
esac
