# Docker Setup for Laravel Application

This setup includes:
- PHP 8.2 FPM Alpine
- Nginx Alpine
- PostgreSQL 13.1 Alpine

## Prerequisites

- Docker
- Docker Compose

## Setup Instructions

1. Clone the repository
2. Navigate to the project directory
3. Copy the .env.docker file to .env:
   ```bash
   cp .env.docker .env
   ```
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```
6. Install PHP dependencies:
   ```bash
   docker-compose exec app composer install
   ```
7. Run database migrations:
   ```bash
   docker-compose exec app php artisan migrate
   ```
8. Access the application at http://localhost:8000

## Docker Services

- **app**: PHP 8.2 FPM Alpine service
- **webserver**: Nginx Alpine service
- **db**: PostgreSQL 13.1 Alpine service

## Useful Docker Commands

- Start services: `docker-compose up -d`
- Stop services: `docker-compose down`
- View logs: `docker-compose logs -f`
- Execute commands in app container: `docker-compose exec app [command]`
- Execute commands in db container: `docker-compose exec db [command]`

## Environment Variables

The .env.docker file contains the database configuration for the Docker environment:
- DB_HOST=db
- DB_PORT=5432
- DB_DATABASE=laravel
- DB_USERNAME=laraveluser
- DB_PASSWORD=laravelPASS

## Notes

- The application will be available at http://localhost:8000
- PostgreSQL will be available at localhost:5432
- All data is persisted in a Docker volume named `db_data`