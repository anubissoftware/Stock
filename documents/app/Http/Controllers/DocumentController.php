<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    public function generateDispatchPDF ($dispatch_id) {
        $dispatchData = DB::table('dispatching as d')
            ->select('d.id as dispatch_id','d.*', 'e.name as enterprise_name',
            'e.nit as nit', 'c.name as client_name', 'c.*',
            'u.name as user_name', 'q.*')
            ->join('quotation as q', 'q.id', '=', 'd.quotation_id')
            ->join('clients as c', 'c.id', '=', 'q.client_id')
            ->join('users as u', 'u.id', '=', 'q.user')
            ->join('enterprise as e', 'e.id', '=', 'q.enterprise_id')
            ->where('d.id', $dispatch_id)
            ->first();

        $dispatchDetail = DB::table('dispatchingDetail as dd')
            ->join('products as p', 'p.id', '=', 'dd.item_id')
            ->select(DB::raw("SUM(dd.amount) as total_debit"),'dd.item_id', 'dd.id', 'p.name', 'p.description',
            'p.id as product_id')
            //
            ->where('dd.dispatch_id', $dispatchData->dispatch_id)
            ->groupBy('dd.item_id')
            ->get();
        Log::info(json_decode(json_encode($dispatchData), true));
        Log::info($dispatchDetail);
        Log::info($dispatchDetail->groupBy('column')->toArray());
        return Pdf::loadView('dispatch', ['dispatch' => $dispatchData, 'detail' => $dispatchDetail])->setPaper("a4")->stream();
    }

    //
}
