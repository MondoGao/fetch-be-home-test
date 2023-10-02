FROM node:18 as build

WORKDIR /app

ADD ./ /app
RUN npm i && npm run build

FROM node:18
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
RUN npm i --omit=dev

ENTRYPOINT ["npm", "run", "start"]
