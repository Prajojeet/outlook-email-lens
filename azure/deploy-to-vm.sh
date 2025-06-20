
#!/bin/bash

# Deploy to Azure VM Script
# Usage: ./deploy-to-vm.sh <vm-public-ip>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <vm-public-ip>"
    echo "Example: $0 20.123.45.67"
    exit 1
fi

VM_PUBLIC_IP=$1
ADMIN_USERNAME="azureuser"

echo "Deploying Email Comparison API to VM: $VM_PUBLIC_IP"

# Create deployment package
echo "Creating deployment package..."
tar -czf deployment.tar.gz -C .. backend/

# Copy files to VM
echo "Copying files to VM..."
scp deployment.tar.gz $ADMIN_USERNAME@$VM_PUBLIC_IP:~/

# Connect to VM and setup
echo "Setting up application on VM..."
ssh $ADMIN_USERNAME@$VM_PUBLIC_IP << 'EOF'
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11 and pip
sudo apt install -y python3.11 python3.11-venv python3-pip

# Extract deployment files
tar -xzf deployment.tar.gz
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create systemd service for auto-start
sudo tee /etc/systemd/system/email-comparison.service > /dev/null << 'EOSERVICE'
[Unit]
Description=Email Comparison API
After=network.target

[Service]
Type=simple
User=azureuser
WorkingDirectory=/home/azureuser/backend
Environment=PATH=/home/azureuser/backend/venv/bin
ExecStart=/home/azureuser/backend/venv/bin/python main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOSERVICE

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable email-comparison.service
sudo systemctl start email-comparison.service

# Check service status
sudo systemctl status email-comparison.service

echo "✅ Deployment Complete!"
echo "API is running at: http://$(curl -s ifconfig.me):8000"
echo "Health check: http://$(curl -s ifconfig.me):8000/health"
EOF

echo ""
echo "✅ Deployment finished!"
echo "Your API endpoint: http://$VM_PUBLIC_IP:8000/compare"
echo "Health check: http://$VM_PUBLIC_IP:8000/health"
echo ""
echo "To check logs: ssh $ADMIN_USERNAME@$VM_PUBLIC_IP 'sudo journalctl -u email-comparison.service -f'"
echo "To restart service: ssh $ADMIN_USERNAME@$VM_PUBLIC_IP 'sudo systemctl restart email-comparison.service'"
