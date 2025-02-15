const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  // const config = require("../../Config/config.json")
  module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
      .setName("reglas")
      .setDescription("Te mostrare todas las reglas")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`> Reglas del Servidor`)
        // .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        // .setImage(config.banner)
        .setDescription(
          `> **Aqui tienes el listado de reglas del servidor**\n\n> **Es muy importante que tengas conocimiento de estas para tenes una buena estadia y convivencia en el servidor.**`
        )
        .addFields(
          {
            name: `1.-Respeta a todo usuario.`,
            value:
              "`Independientemente si se trata de otra Nacionalidad/Lenguaje/Razas. Estamos aquí para pasar pasarla bien y entretenernos.`",
          },
          {
            name: `2.- No temas o imágenes NSFW.`,
            value:
              "`Esta prohibido la distribución de NSFW. Mantengamos este servidor apropiado para todos los miembros`",
          },
          {
            name: `3.- Hacer el uso de los canales de forma correcta.`,
            value:
              "`No uses los canales que no están hechos para lo que requieres ya que cada cosas tiene su canal correspondiente.`",
          },
          {
            name: `4.- No hagas Spam/Flood/Walltext/Menciones Excesivas.`,
            value: "`Cualquiera de estas acciones seran sancionadas`",
          },
          {
            name: `5.- Mantener una convivencia sana.`,
            value:
              "`Si algún usuario esta molestando en canales del servidor o al privado puede ser reportado y se tomaran las medidas correspondientes.`",
          },
          {
            name: `6.-  No enviar links o hagas promociones de tu servidor.`,
            value: "`Estas acciones seran sancionadas`",
          },
          {
            name: `7.-  Prohibido pasar un IP Logger.`,
            value: "`Esto resultará Ban PERMANwENTE de la cuenta.`",
          },
          {
            name: `8.-  No usar NICKNAMES, FOTOS de perfil inadecuadas.`,
            value:
              "`Esto incluye nombres con letras o números especiales, nombres largos y emojis excesivos. Evita que las personas se hagan pasar por otras o usen nombres y avatares ofensivos.`",
          },
          {
            name: `9.- No se tolerará ningún tipo de acoso, sexismo, racismo o discurso de odio.`,
            value: "`Todas estas acciones seran sancionadas`",
          },
          {
            name: `10.- Esta totalmente prohibido pedir codigos.`,
            value:
              "`La idea principal de este servidor es que puedas aprender a crear tu propio bot, por lo cual no pidas  codigos regalados.`",
          },
          {
            name: `Respeta la normativa de Discord`,
            value: `En este servidor respetamos la [Normativa de Discord](https://discord.com/guidelines)`,
          }
        )
        .setFooter({
          text: `En este servidor respetamos los ToS de Discord https://discord.com/terms`,
        });
  
      await interaction.channel.send({ embeds: [embed] });
      await interaction.reply({
        content: `Mensaje enviado correctamente`,
        ephemeral: true,
      });
    },
  };

  