
#!/bin/sh
set -e

echo "Menunggu database MySQL..."

until mysqladmin ping \
    -h "${DB_HOST:-order-db}" \
    -P "${DB_PORT:-3306}" \
    -u "${DB_USERNAME:-appuser}" \
    --password="${DB_PASSWORD:-}" \
    --silent; do
    echo "Database belum siap, mencoba lagi..."
    sleep 2
done

echo "Database siap."

if [ -z "${APP_KEY:-}" ]; then
    export APP_KEY="$(php artisan key:generate --show)"
fi

echo "Menjalankan migrasi database..."
php artisan migrate --force

echo "Menjalankan Order Service..."
exec php artisan serve --host=0.0.0.0 --port=3003
