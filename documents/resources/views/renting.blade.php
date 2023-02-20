<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    @page {
        margin: 190px 50px 100px;
    }

    header {
        position: fixed;
        top: -150px;
        left: 0px;
        right: 0px;
        height: 50px;

    }

    th,
    td {
        /* border: 1px solid red */
    }

    .heading {
        font-size: 18px;
        font-style: italic;
        font-weight: bold;
        text-align: center;
    }

    .heading>td {
        border: 1px solid black;
        padding: 5px 5px;
    }

    .products>td {
        font-style: italic;
        border: 0.5px solid black;
        padding: 3px;
    }
    .products-empty>td {
        font-style: italic;
        border: 0.5px solid black;
        padding: 10px 0px;
    }
    .totals{
        text-align: center;
        font-weight: bold;
    }
    .descriptions{
        text-align: right;
    }
</style>

<body>

    <header>
        <table style="width: 100%; border-spacing: 0px; border-collapse: inherit">
            <thead>
                <tr>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                </tr>
                <tr>
                    <th colspan="8">
                        <div style="min-height:80px; padding: 15px 0px">
                            <span style="font-size: 24px"> {{$quotation->enterprise_name}} </span> <br>
                            <span style="font-style: italic; font-size: 20px;">Nit. {{$quotation->nit}}</span> <br> <br>
                            <span style="font-style: italic"> Serial de cotización: {{$quotation->prefix_quote}} {{strtoupper(dechex($quotation->serial))}} </span> <br>
                            <span style="font-style: italic"> Alquiler </span>

                        </div>
                    </th>
                    <th colspan="4">
                        <div style="min-height:80px; margin: 0px 0px 0px 40px; text-align: left">
                            <img style="height: 12px; width: 12px;"
                                src="http://localhost:8012/public/ourStock/ourStock.svg" alt="Fibiaan.png">
                        </div>
                    </th>
                </tr>
            </thead>
        </table>
    </header>

    <main>
        <table style="width: 100%; border-spacing: 0px; border-collapse: inherit">
            <thead>
                <tr>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                    <th style="width: 10%;"></th>
                </tr>
            </thead>
            <tbody style="margin-top: 50px">
                <tr>
                    <div style="min-height: 30px"></div>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: center; font-size: 18px; font-weight: bold">Cliente:</td>
                    <td colspan="7" style="padding: 2px 15px">{{$quotation->client_name}}</td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: center; font-size: 18px; font-weight: bold">Solicitada:</td>
                    <td colspan="7" style="padding: 2px 15px"> {{$quotation->contact_name}} </td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: center; font-size: 18px; font-weight: bold">Realizada:</td>
                    <td colspan="7" style="padding: 2px 15px"> {{$quotation->user_name}} </td>
                </tr>
                <tr>
                    <div style="min-height: 50px"></div>
                </tr>
                <tr class="heading">
                    <td colspan="3">Nombre</td>
                    <td colspan="2">Descripción</td>
                    <td colspan="1">Cantidad</td>
                    <td colspan="2">Precio Unitario</td>
                    <td colspan="2">Precio por día</td>
                </tr>

                @php
                    $total = 0
                @endphp

                @foreach ($detail as $dt)
                    @php
                        $total += ($dt->value * $dt->amount);
                    @endphp
                    <tr class="products">
                        <td colspan="3"> {{$dt->name}} </td>
                        <td colspan="2"> {{$dt->description}} </td>
                        <td colspan="1"> {{$dt->amount}} </td>
                        <td colspan="2"> {{'$ '. number_format($dt->value, 1)}} </td>
                        <td colspan="2"> {{'$ '. number_format($dt->amount * $dt->value)  }} </td>
                    </tr>
                @endforeach
                @for ($i = 0; $i < 5; $i++)
                <tr class="products-empty">
                    <td colspan="3"></td>
                    <td colspan="2"></td>
                    <td colspan="1"></td>
                    <td colspan="2"></td>
                    <td colspan="2"></td>
                </tr>
                @endfor
                <tr class="products">
                    <td colspan="6" class="descriptions"> Subtotal:  </td>
                    <td colspan="4" class="totals"> $ {{number_format($total, 1)}} </td>
                </tr>
                <tr class="products">
                    <td colspan="6" class="descriptions"> Descuento: ({{$quotation->discount}}%) </td>
                    @php
                        $discount = $total * ($quotation->discount / 100);
                    @endphp
                    <td colspan="4" class="totals"> $ {{number_format($discount, 1)}} </td>
                </tr>
                <tr class="products">
                    <td colspan="6" class="descriptions"> Impuesto: ({{$quotation->taxing}}%) </td>
                    @php
                        $taxing = ($total - $discount) * ($quotation->taxing / 100);
                    @endphp
                    <td colspan="4" class="totals"> $ {{number_format($taxing, 1)}} </td>
                </tr>
                <tr class="products">
                    <td colspan="6" class="descriptions"> Total cotizado: </td>
                    @php
                        $total = ($total - $discount + $taxing);
                    @endphp
                    <td colspan="4" class="totals"> $ {{number_format($total, 1)}} </td>
                </tr>

                <tr>
                    <td colspan="10" style="font-size: 14px; font-style: italic">
                        Los precios dispuestos en esta cotización están sujetos a la disponibilidad de los productos en
                        bodega, a los precios dados por nuestros socios y al estado en que se devuelvan los productos
                        que son entregados
                        en alquiler, es decir, se puede generar costos adicionales por mantenimiento o reparación.
                    </td>
                </tr>

            </tbody>
        </table>
    </main>
</body>

</html>
