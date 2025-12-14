FROM node:20

# Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Zuerst package.json (und ggf. package-lock.json) kopieren
COPY package*.json ./

# Alle Dependencies installieren (inkl. express, bcrypt usw.)
RUN npm install

# Quellcode und Doku kopieren
COPY src ./src
COPY tests ./tests
COPY README.md ./

# Port wie in der App/ENV
EXPOSE 5000

ENV NODE_ENV=production

# App starten
CMD ["npm", "start"]