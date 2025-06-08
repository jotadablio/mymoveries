# MyMoveries

Um aplicativo para organizar suas listas de filmes e séries favoritos.

## Versão 2.0.0

Esta versão apresenta um novo design visual com uma paleta de cores elegante em tons de vermelho escuro e dourado, além de melhorias na interface do usuário e na experiência de adição de itens.

## Funcionalidades

- **Listas Separadas**: Organize filmes e séries em listas distintas
- **Favoritos**: Marque seus filmes e séries favoritos com estrelas
- **Status de Assistido**: Acompanhe o que você já assistiu
- **Edição e Exclusão**: Gerencie facilmente os itens da sua lista
- **Ordenação**: Organize por nome, favoritos ou status de assistido
- **Compartilhamento**: Compartilhe suas listas em formato texto ou PDF

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app no seu dispositivo móvel (disponível na App Store ou Google Play)

### Passos para Execução

1. **Instale as dependências**:
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npx expo start
   ```

3. **Visualize no seu dispositivo**:
   - Escaneie o QR code exibido no terminal com o app Expo Go (Android) ou com a câmera (iOS)
   - Ou execute em um emulador usando as opções exibidas no terminal

## Estrutura do Projeto

- `App.js` - Ponto de entrada do aplicativo e configuração de navegação
- `src/screens/` - Telas principais do aplicativo
  - `HomeScreen.jsx` - Tela inicial com navegação para filmes e séries
  - `MoviesListScreen.jsx` - Tela de lista de filmes
  - `SeriesListScreen.jsx` - Tela de lista de séries
- `src/components/` - Componentes reutilizáveis
  - `EditItemsModal.jsx` - Modal para edição de itens
  - `SortModal.jsx` - Modal para ordenação de listas
- `src/utils/` - Utilitários e configurações
  - `colors.js` - Paleta de cores do aplicativo

## Publicação

Para gerar um APK para Android ou um arquivo IPA para iOS, consulte a documentação oficial do Expo:
- [Construindo APKs/AABs para Android](https://docs.expo.dev/build/setup/)
- [Construindo para iOS](https://docs.expo.dev/build-reference/ios/)

## Notas de Atualização (v3.0.0)

- Novo design visual com paleta de cores em vermelho escuro e dourado
- Interface de adição de itens melhorada com campo de entrada inline
- Botão de adição agora alterna entre "+" e "×" para melhor feedback visual
- Menus flutuantes para compartilhamento e configurações
- Persistência de dados com AsyncStorage
- Melhorias gerais na interface do usuário e experiência do usuário
