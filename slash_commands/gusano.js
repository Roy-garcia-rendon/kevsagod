const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ComponentType
  } = require('discord.js');
  
  const activeGames = new Map();
  
  const GAME_CONFIG = {
    boardSize: 10,
    emojis: {
      empty: '⬛',
      head: '🟢',
      body: '🟩',
      food: '🍎'
    },
    updateInterval: 1000, 
  };
  
  const DIRECTIONS = {
    up: { x: -1, y: 0 },
    down: { x: 1, y: 0 },
    left: { x: 0, y: -1 },
    right: { x: 0, y: 1 }
  };
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('snake')
      .setDescription('¡Juega al clásico juego de la serpiente!'),
      
    async execute(interaction) {
      if (activeGames.has(interaction.user.id)) {
        await interaction.reply({
          content: '¡Ya tienes un juego activo! Termínalo antes de comenzar uno nuevo.',
          ephemeral: true
        });
        return;
      }
  
      const gameState = {
        board: Array(GAME_CONFIG.boardSize).fill().map(() => Array(GAME_CONFIG.boardSize).fill(GAME_CONFIG.emojis.empty)),
        snake: [{ x: 5, y: 5 }],
        food: null,
        score: 0,
        gameOver: false,
        currentDirection: DIRECTIONS.right,
        lastDirection: DIRECTIONS.right,
        lastUpdate: Date.now()
      };
  
      const createControlButtons = (disabled = false) => {
        return [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('spacer1')
              .setLabel('⠀')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('up')
              .setEmoji('⬆️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(disabled),
            new ButtonBuilder()
              .setCustomId('spacer2')
              .setLabel('⠀')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true)
          ),
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('left')
              .setEmoji('⬅️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(disabled),
            new ButtonBuilder()
              .setCustomId('pause')
              .setEmoji('⏸️')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(disabled),
            new ButtonBuilder()
              .setCustomId('right')
              .setEmoji('➡️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(disabled)
          ),
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('spacer3')
              .setLabel('⠀')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('down')
              .setEmoji('⬇️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(disabled),
            new ButtonBuilder()
              .setCustomId('spacer4')
              .setLabel('⠀')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true)
          )
        ];
      };
  
      const spawnFood = () => {
        let foodPosition;
        do {
          foodPosition = {
            x: Math.floor(Math.random() * GAME_CONFIG.boardSize),
            y: Math.floor(Math.random() * GAME_CONFIG.boardSize)
          };
        } while (gameState.snake.some(segment => 
          segment.x === foodPosition.x && segment.y === foodPosition.y));
        return foodPosition;
      };
  
      const renderBoard = () => {
        const board = Array(GAME_CONFIG.boardSize).fill()
          .map(() => Array(GAME_CONFIG.boardSize).fill(GAME_CONFIG.emojis.empty));
  
        gameState.snake.forEach((segment, index) => {
          if (segment.x >= 0 && segment.x < GAME_CONFIG.boardSize &&
              segment.y >= 0 && segment.y < GAME_CONFIG.boardSize) {
            board[segment.x][segment.y] = index === 0 ? 
              GAME_CONFIG.emojis.head : GAME_CONFIG.emojis.body;
          }
        });
  
        if (gameState.food) {
          board[gameState.food.x][gameState.food.y] = GAME_CONFIG.emojis.food;
        }
  
        return board.map(row => row.join('')).join('\n');
      };
  
      const updateGameState = async (force = false) => {
        const now = Date.now();
        const timeSinceLastUpdate = now - gameState.lastUpdate;
  
        if (!force && timeSinceLastUpdate < GAME_CONFIG.updateInterval) {
          return false;
        }
  
        if (gameState.gameOver || isPaused) {
          return false;
        }
  
        const newHead = {
          x: gameState.snake[0].x + gameState.currentDirection.x,
          y: gameState.snake[0].y + gameState.currentDirection.y
        };
  
        if (
          newHead.x < 0 || newHead.x >= GAME_CONFIG.boardSize ||
          newHead.y < 0 || newHead.y >= GAME_CONFIG.boardSize ||
          gameState.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          gameState.gameOver = true;
          clearInterval(gameInterval);
          
          gameEmbed
            .setTitle(`🐍 ¡Juego Terminado!`)
            .setDescription(renderBoard())
            .setColor('#FF0000')
            .setFields([
              { 
                name: '📊 Estadísticas', 
                value: `Puntuación Final: ${gameState.score}\nNivel Alcanzado: ${Math.floor(gameState.score / 5) + 1}` 
              }
            ]);
  
          await gameMessage.edit({
            embeds: [gameEmbed],
            components: createControlButtons(true)
          });
  
          activeGames.delete(interaction.user.id);
          return true;
        }
  
        if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
          gameState.snake.unshift(newHead);
          gameState.food = spawnFood();
          gameState.score++;
          
          if (gameState.score % 5 === 0) {
            clearInterval(gameInterval);
            const newInterval = Math.max(
              GAME_CONFIG.updateInterval - (Math.floor(gameState.score / 5) * 100),
              300
            );
            gameInterval = setInterval(async () => {
              await updateGameState();
            }, newInterval);
          }
        } else {
          gameState.snake.pop();
          gameState.snake.unshift(newHead);
        }
  
        gameState.lastDirection = gameState.currentDirection;
        gameState.lastUpdate = now;
  
        gameEmbed
          .setDescription(renderBoard())
          .setFooter({ 
            text: `Puntuación: ${gameState.score} | Nivel: ${Math.floor(gameState.score / 5) + 1}` 
          });
  
        await gameMessage.edit({
          embeds: [gameEmbed],
          components: createControlButtons()
        });
  
        return true;
      };
  
      const gameEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(`🐍 Serpiente - ${interaction.user.username}`)
        .setDescription('¡Presiona los botones para comenzar!')
        .addFields({ 
          name: 'Controles', 
          value: '⬆️ ⬇️ ⬅️ ➡️ - Mover\n⏸️ - Pausar/Reanudar' 
        })
        .setFooter({ 
          text: `Puntuación: ${gameState.score} | Nivel: ${Math.floor(gameState.score / 5) + 1}` 
        });
  
      await interaction.reply({
        embeds: [gameEmbed],
        components: createControlButtons(),
        fetchReply: true
      });
  
      gameState.food = spawnFood();
      activeGames.set(interaction.user.id, true);
  
      let gameMessage = await interaction.fetchReply();
      let gameInterval = null;
      let isPaused = false;
  
      gameInterval = setInterval(async () => {
        await updateGameState();
      }, GAME_CONFIG.updateInterval);
  
      const collector = gameMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === interaction.user.id,
        time: 600000
      });
  
      collector.on('collect', async (i) => {
        await i.deferUpdate();
  
        if (gameState.gameOver) return;
  
        switch (i.customId) {
          case 'up':
            if (gameState.lastDirection !== DIRECTIONS.down) {
              gameState.currentDirection = DIRECTIONS.up;
              await updateGameState(true); 
            }
            break;
          case 'down':
            if (gameState.lastDirection !== DIRECTIONS.up) {
              gameState.currentDirection = DIRECTIONS.down;
              await updateGameState(true); 
            }
            break;
          case 'left':
            if (gameState.lastDirection !== DIRECTIONS.right) {
              gameState.currentDirection = DIRECTIONS.left;
              await updateGameState(true);
            }
            break;
          case 'right':
            if (gameState.lastDirection !== DIRECTIONS.left) {
              gameState.currentDirection = DIRECTIONS.right;
              await updateGameState(true); 
            }
            break;
          case 'pause':
            isPaused = !isPaused;
            if (isPaused) {
              gameEmbed.setTitle(`🐍 Serpiente - ${interaction.user.username} (Pausado)`);
            } else {
              gameEmbed.setTitle(`🐍 Serpiente - ${interaction.user.username}`);
            }
            await gameMessage.edit({ embeds: [gameEmbed] });
            break;
        }
      });
  
      collector.on('end', () => {
        if (!gameState.gameOver) {
          gameState.gameOver = true;
          clearInterval(gameInterval);
          activeGames.delete(interaction.user.id);
          
          gameEmbed
            .setTitle('🐍 Juego Terminado - Tiempo Expirado')
            .setColor('#FF0000');
          
          gameMessage.edit({
            embeds: [gameEmbed],
            components: createControlButtons(true)
          });
        }
      });
    }
  };