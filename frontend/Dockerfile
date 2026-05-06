FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV HOST=0.0.0.0
ENV PORT=3100
ENV VITE_API_BASE_URL=http://backend:8100

EXPOSE 3100

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3100", "--strictPort"]
