<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

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

    public function generateQuotationPDF($quotation_id) {

        $quotationData = DB::table('quotation as q')
            ->select('q.id as quotation_id', 'q.*', 'c.name as client_name', 'c.*', 'e.name as enterprise_name', 'e.nit as nit',
                'u.name as user_name', 'e.prefix_quote'
            )
            ->join('clients as c', 'c.id', '=', 'q.client_id')
            ->join('enterprise as e', 'e.id', '=', 'q.enterprise_id')
            ->join('users as u', 'u.id', '=', 'q.user')
            ->where('deleted', '==', '0')
            ->where('q.id', $quotation_id)
            ->first();

        $quotationDetail = DB::table('quotationDetail as qd')
            ->join('products as p', 'p.id', '=', 'qd.item_id')
            ->where('qd.quotation_id', $quotationData->quotation_id)
            ->get();
        if($quotationData->isRenting){
            return Pdf::loadView('renting', ['quotation' => $quotationData, 'detail' => $quotationDetail])->setPaper("a4")->stream();
        }else{
            return Pdf::loadView('selling', ['quotation' => $quotationData, 'detail' => $quotationDetail])->setPaper("a4")->stream();
        }

    }

    //
}
