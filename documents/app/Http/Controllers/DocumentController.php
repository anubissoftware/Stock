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
                'u.name as user_name', 'e.prefix_quote', 'cc.name as contact_name', 'e.shortcut'
            )
            ->join('clients as c', 'c.id', '=', 'q.client_id')
            ->join('enterprise as e', 'e.id', '=', 'q.enterprise_id')
            ->join('users as u', 'u.id', '=', 'q.user')
            ->leftJoin('clientsContact as cc', 'cc.id', '=', 'q.contact_id')
            ->where('deleted', '==', '0')
            ->where('q.id', $quotation_id)
            ->first();

        if(!$quotationData){
            return response()->json([
                'message' => 'The quotation is not registered'
            ], 404);
        }

        $conditionsId = json_decode($quotationData->conditions);

        $conditions = DB::table('quotationTerms as qt')
            ->whereIn('qt.id', $conditionsId)
            ->get();

        $quotationDetail = DB::table('quotationDetail as qd')
            ->join('products as p', 'p.id', '=', 'qd.item_id')
            ->where('qd.quotation_id', $quotationData->quotation_id)
            ->get();
        if($quotationData->isRenting){
            $document = Pdf::loadView('renting', [
                    'quotation' => $quotationData,
                    'detail' => $quotationDetail,
                    'conditions' => $conditions
                ])
                ->setPaper("a4");
            return $document
                ->stream();
        }else{
            $document = Pdf::loadView('selling', ['quotation' => $quotationData, 'detail' => $quotationDetail])->setPaper("a4");
            return $document->stream();
        }

    }

    public function generateDispatchPDF ($dispatch_id) {
        $dispatchData = DB::table('dispatching as d')
            ->select('d.id as dispatch_id','d.*', 'e.name as enterprise_name',
            'e.nit as enterprise_nit', 'c.name as client_name', 'c.*', 'e.shortcut',
            'u.name as user_name', 'q.*', 'cc.name as contact_name', 'cc.phone as contact_phone')
            ->join('quotation as q', 'q.id', '=', 'd.quotation_id')
            ->join('clients as c', 'c.id', '=', 'q.client_id')
            ->join('users as u', 'u.id', '=', 'q.user')
            ->join('enterprise as e', 'e.id', '=', 'q.enterprise_id')
            ->leftJoin('clientsContact as cc', 'cc.id', '=', 'd.contact_received')
            ->where('d.id', $dispatch_id)
            ->first();

        if(!$dispatchData){
            return response()->json([
                'message' => 'The dispatch is not registered'
            ], 404);
        }

        $dispatchDetail = DB::table('dispatchingDetail as dd')
            ->select(DB::raw("SUM(dd.amount) as total_debit"),'dd.item_id', 'dd.id', 'p.name', 'p.description',
            'p.id as product_id', 'p.ref')
            ->join('products as p', 'p.id', '=', 'dd.item_id')
            ->where('dd.dispatch_id', $dispatchData->dispatch_id)
            ->groupBy('dd.item_id')
            ->get();

        if(count($dispatchDetail) == 0){
            $dispatchDetail = DB::table('dispatchingDetail as dd')
            ->select(DB::raw("SUM(dd.amount) as total_debit"),'dd.item_id', 'dd.id', 'p.name', 'p.description',
            'p.id as product_id', 'p.ref')
            ->join('quotationDetail as qd', 'qd.id', '=', 'dd.quotation_detail_id')
            ->join('products as p', 'p.id', '=', 'qd.item_id')
            ->where('dd.dispatch_id', $dispatchData->dispatch_id)
            ->groupBy('dd.quotation_detail_id')
            ->get();
        }

        // dd($dispatchDetail);


        return Pdf::loadView('dispatch', ['dispatch' => $dispatchData, 'detail' => $dispatchDetail])->setPaper("a4")->stream();
    }

    //
}
