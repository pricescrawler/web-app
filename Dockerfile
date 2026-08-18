FROM node:22 as build
WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps
COPY . .

FROM node:22
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "run", "start"]
