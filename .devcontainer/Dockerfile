FROM mcr.microsoft.com/devcontainers/typescript-node:latest

ARG NONROOT_USER=node

# Update npm and pnpm
RUN npm install -g npm@latest pnpm@latest

# Install deno
ENV DENO_INSTALL=/deno
RUN mkdir -p /deno \
	&& curl -fsSL https://deno.land/x/install/install.sh | sh \
	&& chown -R $NONROOT_USER /deno

# Setup PATH
ENV PATH=${DENO_INSTALL}/bin:${PATH} \
	DENO_DIR=${DENO_INSTALL}/.cache/deno
