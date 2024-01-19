FROM chatwoot/chatwoot:v3.5.2

# Instala o nodejs e o yarn para que possamos recompilar os assets do rails
RUN apk update && apk add --no-cache \
  nodejs-current \
  yarn

# Coloca o diretório de trabalho na pasta app
WORKDIR /app

# Informa o ambiente de build como produção
ENV RAILS_ENV=production

# Copia os arquivos de branding
COPY . /app

# install depedencias precompile 
RUN SECRET_KEY_BASE=precompile_placeholder RAILS_ENV=production bundle install

# Limpa os assets do rails
RUN SECRET_KEY_BASE=precompile_placeholder RAILS_ENV=production bundle exec rake assets:clean

# Recompila os assets do rails
RUN SECRET_KEY_BASE=precompile_placeholder RAILS_ENV=production bundle exec rake assets:precompile