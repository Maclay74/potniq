FROM node:22 as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack use pnpm@latest
COPY . /app
WORKDIR /app

CMD ["tail", "-f", "/dev/null"]