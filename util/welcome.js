const {
    Events,
    EmbedBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require('discord.js');
const config = require('../config.json');
const Canvas = require('canvas');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // --- ⚙️ Obtener datos de configuración, con valores por defecto ⚙️ ---
        const channelId = "1142737292176408638"; // 📣 Canal de bienvenida (obligatorio)
        const rulesChannelId = "1142738007783395368"; // 📜 Canal de reglas (obligatorio)
        const generalChannelId = "1142739894351966248"; // 💬 Canal general (opcional)
        const rolesChannelId = "1143360180852101180"; // 🎭 Canal de roles (opcional)
        const serverName = member.guild.name;
        const memberCount = member.guild.memberCount;
        const serverIconURL = member.guild.iconURL({ dynamic: true, size: 256 });
        const welcomeImageURL = config.welcome_image_url; // 🖼️ URL de imagen de bienvenida (opcional)
        const welcomeMessages = config.welcome_messages || [ // 🎉 Mensajes aleatorios (opcional)
            "¡Bienvenido/a a bordo! 👋",
            "¡Un nuevo miembro se une a la aventura! 🚀",
            "¡Hola y bienvenido/a a la comunidad! 😊",
        ];
        const staffRoles = config.staff_roles || []; // 🛡️ Roles del staff para mencionar (opcional)
        const privateWelcomeMessage = config.private_welcome_message || '¡Gracias por unirte a nuestra increíble comunidad! ❤️'; // ✉️ Mensaje privado (opcional)
        const featuredEvent = config.featured_event; // 📢 Evento destacado (opcional)

        // --- 🚦 Validar canales obligatorios 🚦 ---
        if (!channelId) return console.error('❌ Error: No se ha configurado el `welcome_channel` en config.json');
        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return console.error('❌ Error: El canal de bienvenida configurado no se encontró.');

        if (!rulesChannelId) return console.error('❌ Error: No se ha configurado el `rules_channel` en config.json');
        const rulesChannel = member.guild.channels.cache.get(rulesChannelId);
        if (!rulesChannel) return console.error('❌ Error: El canal de reglas configurado no se encontró.');

        // --- ✨ Crear la imagen de bienvenida (¡Aún más deslumbrante!) ✨ ---
        const canvas = Canvas.createCanvas(1800, 700); // ¡Más espacio para la magia!
        const context = canvas.getContext('2d');

        // 🌌 Fondo cósmico y moderno 🌌
        const backgroundGradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        backgroundGradient.addColorStop(0, '#34495E');
        backgroundGradient.addColorStop(1, '#2C3E50');
        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // ✨ Estrellas brillantes ✨
        context.fillStyle = '#ffffff80';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 2;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }

        // 🌠 Banner ondulado superior con el logo del servidor 🌠
        if (serverIconURL) {
            const logo = await Canvas.loadImage(serverIconURL);
            const bannerHeight = 180;
            context.fillStyle = '#ffffff15';
            context.beginPath();
            context.moveTo(0, 0);
            context.quadraticCurveTo(canvas.width / 4, bannerHeight, canvas.width / 2, 0);
            context.quadraticCurveTo(canvas.width * 3 / 4, bannerHeight, canvas.width, 0);
            context.lineTo(canvas.width, 0);
            context.lineTo(0, 0);
            context.fill();
            context.drawImage(logo, 50, 30, bannerHeight - 60, bannerHeight - 60);
            context.font = 'bold 60px "Segoe UI", sans-serif';
            context.fillStyle = 'white';
            context.fillText(serverName, bannerHeight + 65, 90);
        }

        // 👤 Avatar del usuario con aura mágica 👤
        const avatarSize = 400;
        const avatarX = 150;
        const avatarY = canvas.height / 2 - avatarSize / 2;
        context.shadowColor = '#00ffff';
        context.shadowBlur = 30;
        context.beginPath();
        context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        context.closePath();
        context.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png', size: 1024 }));
        context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        context.restore(); // Restaurar el clipping

        // ✨ Contorno del avatar brillante ✨
        const glowColors = ['#ccffff', '#80ffff', '#00ffff'];
        for (let i = 0; i < 3; i++) {
            context.strokeStyle = glowColors[i];
            context.lineWidth = 12 - i * 3;
            context.beginPath();
            context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + i * 3, 0, Math.PI * 2);
            context.stroke();
        }

        // 🌟 Mensaje de bienvenida deslumbrante y centrado 🌟
        context.shadowColor = '#ffffff';
        context.shadowBlur = 20;
        context.font = 'bold 100px "Arial Black", sans-serif';
        context.fillStyle = '#ffffff';
        const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        const textWidth = context.measureText(randomWelcome).width;
        context.fillText(randomWelcome, canvas.width / 2 + 100, canvas.height / 2 + 50);

        // ✨ Nombre de usuario brillante debajo del mensaje ✨
        context.shadowBlur = 15;
        context.font = 'italic 72px "Pacifico", cursive';
        context.fillStyle = '#b3e0ff';
        const usernameWidth = context.measureText(member.user.tag).width;
        context.fillText(member.user.tag, canvas.width / 2 + 100, canvas.height / 2 + 140);

        // ℹ️ Información adicional en la esquina inferior ℹ️
        context.shadowBlur = 8;
        context.font = '28px "Segoe UI", sans-serif';
        context.fillStyle = '#e0e0e0';
        context.fillText(`¡Eres el miembro número ${memberCount}!`, canvas.width - 350, canvas.height - 60);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-card.png' });

        // --- 💎 Crear el Embed de bienvenida 💎 ---
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#3498db') // Azul zafiro
            .setTitle(`✨ ¡Un nuevo miembro se une a nuestra aventura! ✨`)
            .setDescription(`¡Demos una cálida y brillante bienvenida a <@${member.id}>! Estamos muy felices de tenerte aquí. 😊`)
            .setImage('attachment://welcome-card.png')
            .setThumbnail(serverIconURL)
            .addFields(
                { name: '👋 ¡Hola y bienvenido/a!', value: 'Explora, participa y siéntete como en casa. ¡Tu opinión nos importa!' },
                {
                    name: '🚀 ¿Qué sigue en tu aventura?',
                    value: `
${rulesChannel ? `•  📜 Lee las <#${rulesChannelId}> para conocer las reglas del juego.` : ''}
${generalChannel ? `•  💬 Preséntate en <#${generalChannelId}> para que te conozcamos mejor.` : ''}
${rolesChannel ? `•  🎭 ¡Elige tus roles en <#${rolesChannelId}> y personaliza tu experiencia!` : ''}
                    `,
                },
                {
                    name: '🆘 ¿Necesitas ayuda en tu camino?',
                    value: staffRoles.length > 0 ? `No dudes en contactar con nuestro increíble staff: ${staffRoles.map(roleId => `<@&${roleId}>`).join(', ')}.` : '¡Cualquier miembro estará encantado de ayudarte!',
                },
                ...(featuredEvent ? [{ name: '📢 ¡Evento destacado!', value: featuredEvent }] : []),
            )
            .setTimestamp()
            .setFooter({ text: `Te da la bienvenida ${serverName} ✨`, iconURL: serverIconURL });

        // --- 🕹️ Crear botones interactivos 🕹️ ---
        const buttons = new ActionRowBuilder();
        if (rulesChannel) {
            buttons.addComponents(new ButtonBuilder().setCustomId('welcome_rules').setLabel('Leer Reglas 📜').setStyle(ButtonStyle.Secondary));
        }
        if (generalChannel) {
            buttons.addComponents(new ButtonBuilder().setCustomId('welcome_intro').setLabel('¡Preséntate! 👋').setStyle(ButtonStyle.Primary));
        }
        if (rolesChannel) {
            buttons.addComponents(new ButtonBuilder().setCustomId('welcome_roles').setLabel('Obtener Roles 🎭').setStyle(ButtonStyle.Secondary));
        }
        buttons.addComponents(new ButtonBuilder().setCustomId('welcome_help').setLabel('Necesito Ayuda ❓').setStyle(ButtonStyle.Danger));

        try {
            await channel.send({
                content: `¡Bienvenido/a a nuestro servidor, <@${member.id}>! 🎉`,
                embeds: [welcomeEmbed],
                files: [attachment],
                components: [buttons],
            });
            console.log(`✅ Mensaje de bienvenida avanzado enviado a ${member.user.tag}`);

            // --- ✉️ Enviar mensaje privado (si está configurado) ✉️ ---
            if (member.dmChannel) {
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#9b59b6') // Morado amatista
                            .setTitle(`¡Bienvenido/a a la mágica comunidad de ${serverName}! ✨`)
                            .setDescription(privateWelcomeMessage)
                    ]
                }).catch(error => console.error(`⚠️ No se pudo enviar DM a ${member.user.tag}`, error));
            }
        } catch (error) {
            console.error('🚨 Error al enviar el mensaje de bienvenida:', error);
        }
    },
};