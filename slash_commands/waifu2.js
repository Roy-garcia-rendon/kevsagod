const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Comandos relacionados con anime e interacciones')
    .addSubcommand(subcommand => 
      subcommand
        .setName('interaccion')
        .setDescription('Interactúa con otro usuario')
        .addStringOption(option =>
          option.setName('tipo')
            .setDescription('Tipo de interacción')
            .setRequired(true)
            .addChoices(
              { name: 'Abrazo', value: 'hug' },
              { name: 'Beso', value: 'kiss' },
              { name: 'acariciar', value: 'pat' },
              { name: 'Golpe', value: 'bonk' },
              { name: 'Baile', value: 'dance' }
            ))
        .addUserOption(option => 
          option.setName('usuario')
            .setDescription('Usuario con el que interactuar')
            .setRequired(true)))
    .addSubcommand(subcommand => 
      subcommand
        .setName('imagen')
        .setDescription('Obtiene una imagen de anime')
        .addStringOption(option =>
          option.setName('tipo')
            .setDescription('Tipo de imagen')
            .setRequired(true)
            .addChoices(
              { name: 'Waifu', value: 'waifu' },
              { name: 'Neko', value: 'neko' },
              { name: 'Shinobu', value: 'shinobu' },
              { name: 'Megumin', value: 'megumin' }
            ))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const tipo = interaction.options.getString('tipo');

    switch (subcommand) {
      case 'interaccion':
        const usuario = interaction.options.getUser('usuario');
        await manejarInteraccion(interaction, tipo, usuario);
        break;
      case 'imagen':
        await manejarImagen(interaction, tipo);
        break;
      default:
        await interaction.reply('Subcomando no reconocido.');
    }
  },
};

async function manejarInteraccion(interaction, tipo, usuario) {
  const fetchInteraccion = await fetch(`https://api.waifu.pics/sfw/${tipo}`);
  if (!fetchInteraccion.ok) {
    return interaction.reply(`La solicitud a la API falló con estado ${fetchInteraccion.status}.`);
  }

  const datosInteraccion = await fetchInteraccion.json();
  const embedInteraccion = new EmbedBuilder()
    .setImage(datosInteraccion.url)
    .setColor("Random")
    .setTimestamp();

  const usuarioEmisor = interaction.user.username;
  const usuarioReceptor = usuario.username;

  let mensaje;
  switch (tipo) {
    case 'hug':
      mensaje = `**${usuarioEmisor}** le dio un abrazo a **${usuarioReceptor}**`;
      break;
    case 'kiss':
      mensaje = `**${usuarioEmisor}** le dio un rico beso a **${usuarioReceptor}**`;
      break;
    case 'pat':
      mensaje = `**${usuarioEmisor}** acarició a **${usuarioReceptor}**.`;
      break;
    case 'bonk':
      mensaje = `¡**${usuarioEmisor}** le dio un golpe a **${usuarioReceptor}**!`;
      break;
    case 'dance':
      mensaje = `¡**${usuarioEmisor}** se puso a bailar con **${usuarioReceptor}**!`;
      break;
    default:
      mensaje = `**${usuarioEmisor}** interactúa con **${usuarioReceptor}**.`;
  }

  await interaction.reply({
    content: mensaje,
    embeds: [embedInteraccion],
  });
}

async function manejarImagen(interaction, tipo) {
  const fetchImagen = await fetch(`https://api.waifu.pics/sfw/${tipo}`);
  if (!fetchImagen.ok) {
    return interaction.reply({content: `La solicitud a la API falló con estado ${fetchImagen.status}.`, ephemeral: true});
  }

  const datosImagen = await fetchImagen.json();
  const embedImagen = new EmbedBuilder()
    .setImage(datosImagen.url)
    .setColor("DarkButNotBlack")
    .setTimestamp();

  await interaction.reply({
    content: `**❤️ ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:**`,
    embeds: [embedImagen],
  });
}