# MyMoveries - Aplicativo de Organização de Filmes e Séries

## Descrição
MyMoveries é um aplicativo desenvolvido em React Native que permite organizar filmes e séries em listas editáveis. O aplicativo oferece funcionalidades como marcação de favoritos, status de assistido, ordenação por diferentes critérios e compartilhamento das listas em formato texto ou PDF.

## Funcionalidades Principais

- **Tela Inicial**: Navegação entre listas de Filmes e Séries
- **Listas Separadas**: Gerenciamento independente de filmes e séries
- **Adição de Itens**: Adicione novos filmes ou séries às suas listas
- **Edição e Exclusão**: Renomeie ou remova itens das listas
- **Favoritos**: Marque seus filmes e séries favoritos com estrelas
- **Status de Assistido**: Marque filmes e séries que você já assistiu
- **Ordenação**: Organize suas listas por nome, favoritos ou status de assistido
- **Compartilhamento**: Exporte e compartilhe suas listas em formato texto ou PDF

## Requisitos para Execução

- Node.js (versão 14 ou superior)
- npm ou yarn
- React Native CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS, apenas em macOS)

## Instalação e Execução

1. Descompacte o arquivo zip
2. Navegue até a pasta do projeto: `cd MyMoveries`
3. Instale as dependências: `npm install`
4. Execute o aplicativo:
   - Para Android: `npx react-native run-android`
   - Para iOS: `npx react-native run-ios`

## Estrutura do Projeto

```
MyMoveries/
├── android/          # Configurações nativas do Android
├── ios/              # Configurações nativas do iOS
├── src/
│   ├── components/   # Componentes reutilizáveis
│   ├── screens/      # Telas do aplicativo
│   ├── services/     # Serviços (compartilhamento, etc.)
│   ├── utils/        # Utilitários
│   └── assets/       # Recursos estáticos
├── App.tsx           # Componente principal e navegação
├── index.js          # Ponto de entrada do aplicativo
└── package.json      # Dependências e scripts
```

## Guia de Uso

1. **Tela Inicial**:
   - Selecione "Filmes" ou "Séries" para acessar as respectivas listas

2. **Adicionar Item**:
   - Toque no botão "+" na parte inferior da tela
   - Digite o nome do filme ou série
   - Toque em "Confirmar"

3. **Marcar como Favorito**:
   - Toque na estrela ao lado do nome do item

4. **Marcar como Assistido**:
   - Toque na caixa de seleção à direita do nome do item

5. **Editar ou Excluir**:
   - Toque no ícone de engrenagem (⚙️)
   - Selecione "Editar Itens"
   - Para editar: toque no ícone de lápis e digite o novo nome
   - Para excluir: toque no ícone de lixeira

6. **Ordenar Lista**:
   - Toque no ícone de engrenagem (⚙️)
   - Selecione "Ordenar Por"
   - Escolha o critério de ordenação (Nome, Favoritos ou Assistidos)

7. **Compartilhar Lista**:
   - Toque no ícone de compartilhamento (🔗)
   - Escolha o formato (Texto ou PDF)
   - Selecione o aplicativo para compartilhar
