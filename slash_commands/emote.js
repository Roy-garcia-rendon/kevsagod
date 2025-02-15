const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emote")
        .setDescription("Obtener un emote en formato de imagen.")
        .addStringOption(option => option
            .setName("emote_id")
            .setDescription("ID del emote a obtener.")
            .setRequired(true)
        ),
    async execute(interaction) {
        const emoteId = interaction.options.getString("emote_id");

        const emoteUrl = `https://cdn.discordapp.com/emojis/${emoteId}.png`;

        const embed = new EmbedBuilder()
            .setColor('#1E8449')
            .setTitle('Emote')
            .setDescription('Aquí está tu emote: [Por favor escoja el formato de su emote]')
            .setImage(emoteUrl)
            .setTimestamp();

        const png = new ButtonBuilder()
            .setLabel('PNG')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://cdn.discordapp.com/emojis/${emoteId}.png`);

        const jpg = new ButtonBuilder()
            .setLabel('JPG')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://cdn.discordapp.com/emojis/${emoteId}.jpg`);

        const gif = new ButtonBuilder()
            .setLabel('GIF (Solo si es animado)')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://cdn.discordapp.com/emojis/${emoteId}.gif`);

        const row = new ActionRowBuilder()
            .addComponents(png, jpg, gif);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};