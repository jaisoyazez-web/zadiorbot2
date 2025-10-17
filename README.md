# Discord Announcement & Moderation Bot

A simple Discord bot that can announce custom messages across all channels in your server and kick members.

## Features

- **Custom Announcements**: Send messages to all text channels in your server
- **Targeted Messages**: Send messages to specific channels
- **Member Kicking**: Remove members from your server with optional reasons
- **Member Banning**: Permanently ban members (server owner only)
- **Permission-based**: Commands require appropriate permissions to use
- **Easy to use**: Simple command syntax

## Commands

### 📢 !announce <message>
Send a custom announcement to all text channels in the server.

**Example:**
```
!announce Server maintenance will begin in 30 minutes!
```

**Requirements:** Administrator permission

### 📨 !send #channel <message>
Send a message to a specific channel.

**Example:**
```
!send #general Welcome to our server!
```

**Requirements:** Administrator permission

### 👢 !kick @user <reason>
Kick a member from the server with an optional reason.

**Example:**
```
!kick @username Breaking server rules
```

**Requirements:** Kick Members permission

### 🔨 !ban @user <reason>
Permanently ban a member from the server with an optional reason.

**Example:**
```
!ban @username Serious violation of server rules
```

**Requirements:** Server Owner only

### ❓ !help
Display the list of available commands.

## Setup Instructions

1. Your bot is already configured and running on Replit
2. The bot uses the DISCORD_BOT_TOKEN from your environment secrets
3. Make sure the bot has been invited to your Discord server with proper permissions

## Required Bot Permissions

When inviting the bot to your server, ensure it has these permissions:
- Send Messages
- Kick Members
- Ban Members
- Administrator (for announcements)
- Read Message History
- Embed Links

## How It Works

- The bot monitors all messages in your server
- When a command is detected, it checks user permissions
- Only users with proper permissions can use moderation commands
- The bot will only respond to commands in servers, not in DMs

## Troubleshooting

If the bot is not responding:
1. Check that the bot is online (green status)
2. Verify the bot has been invited to your server
3. Ensure the bot has the required permissions
4. Check that you're using the correct command prefix (!)
