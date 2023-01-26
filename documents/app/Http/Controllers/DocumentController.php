<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function generateQuotationPDF() {
        return Pdf::loadView('wrapper')->stream();
    }

    //
}
