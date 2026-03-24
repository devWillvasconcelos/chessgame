# ♜ Jogo de Xadrez com Cronômetro Oficial

![Xadrez Game](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

Um jogo de xadrez completo com sistema de cronômetro oficial, desenvolvido em Node.js e JavaScript puro. O projeto simula um relógio de xadrez profissional onde cada jogador precisa confirmar sua jogada para parar seu tempo e iniciar o do oponente.

## 🎮 Demonstração

![Chess Game Demo](https://via.placeholder.com/800x400?text=Chess+Game+Screenshot)

## ✨ Funcionalidades

### 🎯 Sistema de Jogo
- **Regras completas do xadrez**: Movimentação válida para todas as peças (peão, torre, cavalo, bispo, rainha, rei)
- **Verificação de xeque**: Detecta automaticamente quando o rei está em xeque
- **Xeque-mate**: Identifica fim de jogo por xeque-mate
- **Promoção de peão**: Peão é automaticamente promovido a rainha ao chegar na última fileira
- **Histórico de movimentos**: Registra todas as jogadas em tempo real

### ⏱️ Sistema de Cronômetro
- **Relógio oficial**: Cada jogador começa com 10 minutos
- **Controle manual**: Jogador deve apertar "Confirmar Jogada" após mover a peça
- **Timer ativo destacado**: O timer do jogador atual fica em destaque verde
- **Alerta de tempo baixo**: Quando faltar 1 minuto, o timer fica vermelho e pisca
- **Fim de jogo por tempo**: Vitória automática quando o tempo do oponente acaba

### 🎨 Interface
- **Design moderno**: Gradientes, sombras e animações suaves
- **Emojis como peças**: Peças em Unicode (♔♚♕♛♖♜♗♝♘♞♙♟) sem necessidade de imagens
- **Quadrados perfeitamente iguais**: Tabuleiro com tamanho fixo e responsivo
- **Feedback visual**: 
  - Círculo pulsante em movimentos válidos
  - Animação de captura
  - Efeito de xeque no rei
  - Botão do próximo jogador piscando
- **Totalmente responsivo**: Funciona em desktop, tablet e mobile

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Frontend**: JavaScript ES6+
- **Estilização**: CSS3 com Grid, Flexbox e Animations
- **Ícones**: Emojis Unicode

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- NPM ou Yarn

### Passos para rodar o projeto

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/chess-game.git
cd chess-game
npm run dev
