import { Client, GatewayIntentBits, PermissionsBitField } from 'discord.js';

async function startBot() {
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN environment variable is not set');
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates
    ]
  });

  function isAuthorized(member, guild) {
    if (member.id === guild.ownerId) return true;
    
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return true;
    
    const modPermissions = [
      PermissionsBitField.Flags.ManageMessages,
      PermissionsBitField.Flags.KickMembers,
      PermissionsBitField.Flags.BanMembers,
      PermissionsBitField.Flags.ManageChannels
    ];
    
    return modPermissions.some(perm => member.permissions.has(perm));
  }

  client.on('ready', () => {
    console.log(`✅ Bot is online as ${client.user.tag}!`);
    console.log(`📋 Commands available (Owner/Admin/Moderator only):`);
    console.log(`   !announce <message> - Send a message to all text channels`);
    console.log(`   !send #channel <message> - Send a message to a specific channel`);
    console.log(`   !kick @user <reason> - Kick a member from the server`);
    console.log(`   !ban @user <reason> - Ban a member (OWNER ONLY)`);
    console.log(`   !help - Show available commands`);
  });

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (!message.guild) {
      if (message.content.startsWith('!')) {
        return message.reply('❌ Bot commands only work in servers, not in DMs!');
      }
      return;
    }

    if (message.content.startsWith('!announce ')) {
      if (!isAuthorized(message.member, message.guild)) {
        return message.reply('❌ Only server owners, admins, and moderators can use this command!');
      }

      const announcement = message.content.slice(10).trim();
      
      if (!announcement) {
        return message.reply('❌ Please provide a message to announce!');
      }

      const guild = message.guild;
      const textChannels = guild.channels.cache.filter(ch => ch.isTextBased() && ch.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages));
      
      let successCount = 0;
      
      for (const [id, channel] of textChannels) {
        try {
          await channel.send(`📢 **ANNOUNCEMENT:** ${announcement}`);
          successCount++;
        } catch (error) {
          console.error(`Failed to send to ${channel.name}:`, error.message);
        }
      }

      message.reply(`✅ Announcement sent to ${successCount} text channel(s)!`);
    }

    else if (message.content.startsWith('!send ')) {
      if (!isAuthorized(message.member, message.guild)) {
        return message.reply('❌ Only server owners, admins, and moderators can use this command!');
      }

      const args = message.content.slice(6).trim();
      const channelMention = message.mentions.channels.first();
      
      if (!channelMention) {
        return message.reply('❌ Please mention a channel! Usage: !send #channel <message>');
      }

      if (!channelMention.isTextBased()) {
        return message.reply('❌ You can only send messages to text channels!');
      }

      const messageContent = args.replace(/<#\d+>\s*/, '').trim();
      
      if (!messageContent) {
        return message.reply('❌ Please provide a message to send!');
      }

      if (!channelMention.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) {
        return message.reply(`❌ I don't have permission to send messages in ${channelMention}!`);
      }

      try {
        await channelMention.send(`📢 **ANNOUNCEMENT:** ${messageContent}`);
        message.reply(`✅ Message sent to ${channelMention}!`);
        console.log(`📨 ${message.author.tag} sent announcement to #${channelMention.name}`);
      } catch (error) {
        message.reply(`❌ Failed to send message: ${error.message}`);
      }
    }

    else if (message.content.startsWith('!kick ')) {
      if (!isAuthorized(message.member, message.guild)) {
        return message.reply('❌ Only server owners, admins, and moderators can use this command!');
      }

      const args = message.content.slice(6).trim().split(' ');
      const userMention = message.mentions.members.first();
      
      if (!userMention) {
        return message.reply('❌ Please mention a user to kick! Usage: !kick @user <reason>');
      }

      const reason = args.slice(1).join(' ') || 'No reason provided';

      if (!userMention.kickable) {
        return message.reply('❌ I cannot kick this user! They may have higher permissions.');
      }

      try {
        await userMention.kick(reason);
        message.reply(`✅ Successfully kicked ${userMention.user.tag}. Reason: ${reason}`);
        console.log(`👢 ${message.author.tag} kicked ${userMention.user.tag}. Reason: ${reason}`);
      } catch (error) {
        message.reply(`❌ Failed to kick user: ${error.message}`);
      }
    }

    else if (message.content.startsWith('!ban ')) {
      if (message.author.id !== message.guild.ownerId) {
        return message.reply('❌ Only the server owner can use this command!');
      }

      const args = message.content.slice(5).trim().split(' ');
      const userMention = message.mentions.members.first();
      
      if (!userMention) {
        return message.reply('❌ Please mention a user to ban! Usage: !ban @user <reason>');
      }

      const reason = args.slice(1).join(' ') || 'No reason provided';

      if (!userMention.bannable) {
        return message.reply('❌ I cannot ban this user! They may have higher permissions.');
      }

      try {
        await userMention.ban({ reason: reason });
        message.reply(`✅ Successfully banned ${userMention.user.tag}. Reason: ${reason}`);
        console.log(`🔨 ${message.author.tag} (OWNER) banned ${userMention.user.tag}. Reason: ${reason}`);
      } catch (error) {
        message.reply(`❌ Failed to ban user: ${error.message}`);
      }
    }

    else if (message.content === '!help') {
      const helpEmbed = {
        color: 0x0099ff,
        title: '🤖 Bot Commands',
        description: 'Here are the available commands:',
        fields: [
          {
            name: '📢 !announce <message>',
            value: 'Send a custom announcement to all text channels in the server.\n*Requires: Administrator permission*'
          },
          {
            name: '📨 !send #channel <message>',
            value: 'Send a message to a specific channel.\n*Requires: Administrator permission*'
          },
          {
            name: '👢 !kick @user <reason>',
            value: 'Kick a member from the server.\n*Requires: Kick Members permission*'
          },
          {
            name: '🔨 !ban @user <reason>',
            value: 'Permanently ban a member from the server.\n*Requires: Server Owner only*'
          },
          {
            name: '❓ !help',
            value: 'Show this help message'
          }
        ],
        timestamp: new Date(),
      };

      message.reply({ embeds: [helpEmbed] });
    }
  });

  client.on('error', (error) => {
    console.error('Discord client error:', error);
  });

  await client.login(token);
}

console.log('🚀 Starting Discord bot...');
startBot().catch(error => {
  console.error('❌ Failed to start bot:', error);
  process.exit(1);
});
