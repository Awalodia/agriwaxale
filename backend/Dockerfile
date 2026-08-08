# Image PHP utilisée pour exécuter Laravel
FROM php:8.3-cli

# Installation des outils système et des bibliothèques nécessaires
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    && docker-php-ext-install \
    pdo_pgsql \
    mbstring \
    bcmath \
    zip \
    opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installation de Composer depuis son image officielle
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Dossier de travail de Laravel
WORKDIR /var/www/html

# Copie de tous les fichiers du backend
COPY . .

# Installation des dépendances PHP de production
RUN composer install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-interaction

# Création des dossiers nécessaires à Laravel
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Port utilisé par Render
EXPOSE 10000

# Préparation de Laravel, migrations et démarrage du serveur
CMD ["sh", "-c", "php artisan config:clear && php artisan config:cache && php artisan migrate --force && (php artisan storage:link || true) && exec php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]
