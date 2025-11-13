FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    oniguruma-dev \
    postgresql-dev \
    unzip

# Install PHP extensions
RUN docker-php-ext-install \
    bcmath \
    ctype \
    dom \
    fileinfo \
    mbstring \
    pdo \
    pdo_pgsql \
    tokenizer \
    xml \
    zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory contents
COPY . /var/www/html

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www/html

# Change current user to www-data
USER www-data

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]