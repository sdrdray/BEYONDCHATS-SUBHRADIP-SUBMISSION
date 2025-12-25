<?php

return [
    'default' => env('DB_CONNECTION', 'mysql'),
    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'url' => env('MYSQL_URL'),
            'host' => env('MYSQLHOST', env('MYSQL_HOST', env('DB_HOST', '127.0.0.1'))),
            'port' => env('MYSQLPORT', env('MYSQL_PORT', env('DB_PORT', '3306'))),
            'database' => env('MYSQLDATABASE', env('MYSQL_DATABASE', env('DB_DATABASE', 'railway'))),
            'username' => env('MYSQLUSER', env('MYSQL_USER', env('DB_USERNAME', 'root'))),
            'password' => env('MYSQLPASSWORD', env('MYSQL_PASSWORD', env('DB_PASSWORD', ''))),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => false,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],
    ],
    'migrations' => 'migrations',
];
