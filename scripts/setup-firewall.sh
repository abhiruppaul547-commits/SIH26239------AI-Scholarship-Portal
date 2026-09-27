#!/bin/bash
set -e

echo "Configuring firewall for ports 80 and 443..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp -m multiport --dports 80,443 -j ACCEPT || true
echo "Firewall setup completed."
