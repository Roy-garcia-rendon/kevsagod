////echo por Alei Mitch

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const canvafy = require('canvafy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ship")
        .setDescription("nivel de ship con una persona")
        .addUserOption(option => option
            .setName("user")
            .setDescription("Menciona a alguien")
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName("member")
            .setDescription("Menciona a alguien")
            .setRequired(true)
        ),
    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser("user");
            const member = interaction.options.getUser("member");

            const userAvatar = user.displayAvatarURL({
                forceStatic: true,
                size: 1024,
                extension: "png"
            });
            const memberAvatar = member.displayAvatarURL({
                forceStatic: true,
                size: 1024,
                extension: "png"
            });

            if (!member) {
                return interaction.editReply({ content: "Por favor menciona a alguien." });
            }

            const ship = await new canvafy.Ship()
                .setAvatars(userAvatar, memberAvatar)
                .setBackground("image", "https://api.wantimg.xyz/wantporfile.png")
                .setBorder("#f0f0f0")
                .setOverlayOpacity(0.5)
                .build();

            const embed = new EmbedBuilder()
                .setTitle("Nivel de Ship")
                .setDescription(`El nivel de ship entre <@${user.id}> y <@${member.id}> es...`)
                .setColor("Random")
                .setImage("attachment://ship.png");

            await interaction.editReply({
                embeds: [embed.toJSON()],
                files: [{
                    attachment: ship,
                    name: `ship.png`
                }]
            });
        } catch (error) {
            console.error("Error al ejecutar el comando 'ship':", error);
            await interaction.editReply({ content: "Hubo un error al procesar tu solicitud." });
        }
    }
};