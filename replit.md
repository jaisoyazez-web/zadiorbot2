# Discord Announcement & Moderation Bot

## Overview

A Discord bot built with Discord.js v14 that provides server-wide announcement broadcasting and member moderation capabilities. The bot uses a command-based architecture with prefix commands (!command) and implements permission-based access control for administrative actions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Bot Framework
- **Technology**: Discord.js v14 with Gateway API
- **Runtime**: Node.js with ES Modules
- **Rationale**: Discord.js provides a robust, well-maintained abstraction over Discord's API with strong TypeScript support and comprehensive documentation

### Command System
- **Pattern**: Prefix-based command parsing (!command)
- **Implementation**: Event-driven message handling with string matching
- **Rationale**: Simple to implement and understand; suitable for basic bot functionality without the overhead of slash command infrastructure
- **Command parsing**: Manual string slicing and trimming
- **Alternatives considered**: Slash commands (opted for prefix commands due to simplicity)

### Permission System
- **Approach**: Built-in Discord.js PermissionsBitField checks
- **Enforcement**: Server-side validation before command execution
- **Requirements**:
  - !announce: Administrator permission required
  - !kick: Kick Members permission required
- **Rationale**: Leverages Discord's native permission system for secure access control

### Bot Intents & Capabilities
- **Gateway Intents**:
  - Guilds: Server metadata access
  - GuildMessages: Message reading
  - MessageContent: Command content parsing (privileged)
  - GuildMembers: Member management (privileged)
  - GuildVoiceStates: Voice channel support (included for voice features)
- **Rationale**: Minimal required intents for announced functionality plus voice state for future voice features

### Message Broadcasting
- **Architecture**: Iterative channel targeting with permission validation
- **Scope**: All text-based channels where bot has SendMessages permission
- **Error handling**: Permission checks before sending to prevent failures
- **Rationale**: Ensures announcements reach all accessible channels without causing permission errors

### Authentication
- **Method**: Discord Bot Token via environment variable (DISCORD_BOT_TOKEN)
- **Storage**: Replit Secrets for secure token management
- **Rationale**: Environment variables prevent token exposure in code; Replit Secrets provides built-in secure storage

### Error Handling & Safety
- **DM Protection**: Bot validates message.guild exists before processing commands
- **Graceful Fallbacks**: DM commands receive friendly error messages
- **Permission Validation**: All moderation commands check user permissions before execution
- **Kickability Checks**: Verifies bot can kick target user before attempting
- **Rationale**: Prevents crashes from edge cases and provides good user experience

## External Dependencies

### Core Dependencies
- **discord.js (v14.23.2)**: Primary Discord API wrapper
  - Provides Client, Gateway intents, Permission management
  - Handles WebSocket connections and event dispatching
  
- **@discordjs/voice (v0.18.0)**: Voice channel support library
  - Enables future voice-related features
  - Provides audio streaming capabilities

- **libsodium-wrappers (v0.7.15)**: Cryptographic library
  - Required for voice encryption
  - Dependency of @discordjs/voice

### Platform Integration
- **Replit Environment**: 
  - Hosts the bot process
  - Provides environment variable management via Secrets
  - Handles process lifecycle and always-on capabilities

### Discord API
- **Gateway API**: Real-time event streaming for messages and server events
- **REST API**: Implicit usage through discord.js for actions (kicking members, sending messages)
- **Privileged Intents Required**: MessageContent, GuildMembers must be enabled in Discord Developer Portal