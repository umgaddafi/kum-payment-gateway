<?php

$projectRoot = __DIR__;
$appBuildPath = realpath($projectRoot.'/app') ?: $projectRoot.'/app';
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$scriptDirectory = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');

if ($scriptDirectory !== '' && $scriptDirectory !== '.' && str_starts_with($requestUri, $scriptDirectory)) {
    $requestUri = substr($requestUri, strlen($scriptDirectory)) ?: '/';
}

if (str_starts_with($requestUri, '/api')) {
    require $projectRoot.'/backend/public/index.php';
    return;
}

if ($requestUri === '/' || $requestUri === '') {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($appBuildPath.'/index.html');
    return;
}

$appFile = realpath($appBuildPath.$requestUri);

if ($appFile && str_starts_with($appFile, realpath($appBuildPath)) && is_file($appFile)) {
    return readfile($appFile);
}

header('Content-Type: text/html; charset=UTF-8');
readfile($appBuildPath.'/index.html');
