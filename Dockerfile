# Use a imagem oficial do Node.js 20.x
FROM node:20

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o projeto
COPY . .

# Exponha a porta na qual a aplicação vai rodar
EXPOSE 3333

# Comando para rodar a aplicação AdonisJS
CMD ["node", "ace", "serve", "--watch"]
