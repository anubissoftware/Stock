<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/quotation/pdf/{quotation_id}', 'DocumentController@generateQuotationPDF');
$router->get('/dispatch/pdf/{dispatch_id}', 'DocumentController@generateDispatchPDF');
$router->get('/preview', function () {
    return view('wrapper');
});

$router->get('/', function () use ($router) {
    return $router->app->version();
});
