#!/bin/bash

# =========================================================
# CONFIGURATION - EDIT THESE VALUES
# =========================================================
LINUX_USER="anto"             # Your Linux username
LINUX_IP="158.220.127.231"    # Your Linux Server IP
REMOTE_DEST="/opt/tours/backend" # Final destination on Linux
WIN_SOURCE="./backend"        # Source folder relative to this script
APP_NAME="tours-api"          # PM2 process name

# =========================================================
# COLORS & FORMATTING
# =========================================================
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "=========================================="
echo "🚀 Sharavista Tours Deployment Script (SCP)"
echo "=========================================="
echo "👤 User: $LINUX_USER"
echo "🌐 Host: $LINUX_IP"
echo "📂 Source: $WIN_SOURCE"
echo "📁 Destination: $REMOTE_DEST"
echo "🏷️  PM2 Name: $APP_NAME"
echo "=========================================="
echo ""

# 1. Check if source exists
if [ ! -d "$WIN_SOURCE" ]; then
    echo -e "${RED}❌ ERROR: Source folder '$WIN_SOURCE' not found!${NC}"
    echo "Please ensure you are running this script from the project root."
    exit 1
fi

# 2. Create Remote Directory Structure (WITH SUDO FIX)
echo -e "${YELLOW}📂 Step 1: Ensuring remote directory exists (requires sudo)...${NC}"

# We use sudo to create the folder in /opt, then immediately change ownership to $LINUX_USER
ssh "$LINUX_USER@$LINUX_IP" "sudo mkdir -p $REMOTE_DEST && sudo chown -R $LINUX_USER:$LINUX_USER $REMOTE_DEST"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create remote directory.${NC}"
    echo "💡 Ensure user '$LINUX_USER' has sudo privileges on the server."
    exit 1
fi
echo -e "${GREEN}✅ Remote directory created and ownership assigned to $LINUX_USER.${NC}"
echo ""

# 3. Copy Files (Using SCP - FIXED FOR WINDOWS)
echo -e "${YELLOW}📦 Step 2: Copying files to server via SCP...${NC}"
echo -e "${YELLOW}⚠️  Note: SCP copies ALL files (including node_modules).${NC}"
echo -e "${YELLOW}   Don't worry! 'npm install' on the server will overwrite them.${NC}"
echo ""

# ✅ FIXED COMMAND: Removed '-z' flag which causes error on Windows native SSH
# -r: Recursive (copies folders)
# -p: Preserve modification times and permissions
scp -rp "$WIN_SOURCE/" "$LINUX_USER@$LINUX_IP:$REMOTE_DEST/"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ File transfer failed!${NC}"
    echo "💡 Check your password, IP address, and network connection."
    exit 1
fi
echo -e "${GREEN}✅ Files transferred successfully.${NC}"
echo ""

# 4. Remote Installation & Startup
echo -e "${YELLOW}⚙️  Step 3: Installing dependencies and starting app...${NC}"

# Define the remote commands
REMOTE_COMMANDS="
    cd $REMOTE_DEST && \
    echo 'Installing production dependencies...' && \
    npm install --production && \
    echo 'Starting/Restarting PM2 process...' && \
    pm2 restart $APP_NAME || pm2 start server.js --name $APP_NAME && \
    pm2 save && \
    echo 'Deployment steps completed.'
"

# Execute remote commands
ssh "$LINUX_USER@$LINUX_IP" "$REMOTE_COMMANDS"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Remote execution failed!${NC}"
    echo "💡 Please SSH manually to debug: ssh $LINUX_USER@$LINUX_IP"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo "=========================================="
echo "✅ Code updated in: $REMOTE_DEST"
echo "✅ Dependencies re-installed on server"
echo "✅ PM2 Process '$APP_NAME' is running"
echo ""
echo "💡 To view live logs later:"
echo "   ssh $LINUX_USER@$LINUX_IP 'pm2 logs $APP_NAME'"
echo "=========================================="