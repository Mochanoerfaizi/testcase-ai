<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'taiga' => [
        'url' => env('TAIGA_URL'),
        'username' => env('TAIGA_USERNAME'),
        'password' => env('TAIGA_PASSWORD'),
    ],

    'openai_custom' => [
        'url' => env('OPENAI_CUSTOM_URL'),
        'key' => env('OPENAI_CUSTOM_KEY'),
        'model' => env('OPENAI_CUSTOM_MODEL', 'gpt-3.5-turbo'),
    ],

];
