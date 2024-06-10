FROM mcr.microsoft.com/devcontainers/typescript-node:latest

# Install packages
# RUN apt-get update && apt-get install -y PACKAGE_NAME \
# 	&& rm -rf /var/lib/apt/lists/*

# Node.js
RUN npm install -g npm@latest pnpm@latest

# Deno
USER node
RUN curl -fsSL https://deno.land/install.sh | sh \
	&& echo '\n\n# deno.land\n' >> ~/.profile \
	&& echo 'DENO_INSTALL="$HOME/.deno"\n' >> ~/.profile \
	&& echo 'PATH="$DENO_INSTALL/bin:$PATH"\n' >> ~/.profile
USER root
