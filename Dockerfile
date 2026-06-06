FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SUPABASE_URL=https://fzopbexdrfzxyhetmsrt.supabase.co
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_e88m2FmDuPmg0BiSNOjWQQ_DkZGilNq

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV NEXT_PUBLIC_SUPABASE_URL=https://fzopbexdrfzxyhetmsrt.supabase.co
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_e88m2FmDuPmg0BiSNOjWQQ_DkZGilNq

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "start"]
