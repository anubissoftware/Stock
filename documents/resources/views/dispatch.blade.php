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

    .totals {
        text-align: center;
        font-weight: bold;
    }

    .descriptions {
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
                    <th colspan="10">
                        <div style="min-height:80px; padding: 15px 0px">
                            <span style="font-size: 24px"> {{$dispatch->enterprise_name}} </span> <br>
                            <span style="font-style: italic; font-size: 20px;">Nit. {{$dispatch->nit}}</span> <br> <br>
                            <span style="font-style: italic"> Dispatch: {{$dispatch->dispatch_id}} </span> <br>
                            <span style="font-style: italic"> Alquiler </span>
                        </div>
                    </th>
                    <th colspan="4">
                        <div style="min-height:80px; margin: 0px 0px 0px 40px; text-align: left">
                            <img style="height: 12px; width: 12px;"
                                src="http://localhost:8080/public/ourStock/ourStock.svg" alt="logo.png">
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
                    <td colspan="3" style="text-align: left; font-size: 18px; font-weight: bold">Cliente:</td>
                    <td colspan="7" style="padding: 2px 15px">{{$dispatch->client_name}}</td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: left; font-size: 18px; font-weight: bold">Realizada:</td>
                    <td colspan="7" style="padding: 2px 15px"> {{$dispatch->user_name}} </td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: left; font-size: 18px; font-weight: bold">Fecha de salida:</td>
                    <td colspan="7" style="padding: 2px 15px"> {{$dispatch->out_store}} </td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: left; font-size: 18px; font-weight: bold">Fecha de entrega:</td>
                    <td colspan="7" style="padding: 2px 15px"> {{$dispatch->received}} </td>
                </tr>
                <tr>
                    <div style="min-height: 50px"></div>
                </tr>
                <tr class="heading">
                    <td colspan="5">Nombre</td>
                    <td colspan="3">Descripción</td>
                    <td colspan="2">Cantidad</td>
                </tr>

                @php
                    $total = 0
                @endphp

                @foreach ($detail as $dt)
                    @php
                        $total++;
                    @endphp
                    <tr class="products">
                        <td colspan="5"> {{$dt->name}} </td>
                        <td colspan="3"> {{$dt->description}} </td>
                        <td colspan="2"> {{$dt->amount}} </td>
                    </tr>
                @endforeach
                @for ($i = 0; $i < 3; $i++)
                <tr class="products-empty">
                    <td colspan="5"></td>
                    <td colspan="3"></td>
                    <td colspan="2"></td>
                </tr>
                @endfor

                <tr class="products">
                    <td colspan="6" style="text-align: center; font-size: 20px; font-weight: bold" class="descriptions"> Cantidad productos: </td>
                    @php
                        $total = $total;
                    @endphp
                    <td colspan="4" style="text-align: center; font-size: 20px" class="totals"> {{number_format($total, 1)}} </td>
                </tr>

                <br>
                <tr>

                    <td colspan="10" style="font-size: 14px; font-style: italic">
                        Los precios dispuestos en esta cotización están sujetos a la disponibilidad de los productos en
                        bodega, a los precios dados por nuestros socios y al estado en que se devuelvan los productos
                        que son entregados
                        en alquiler, es decir, se puede generar costos adicionales por mantenimiento o reparación.
                    </td>
                </tr>

                <tr>
                    <td colspan="4" style="padding:60px 0px;border-bottom: 1px solid black;" />
                </tr>
                <tr>
                    <td colspan="10" style="padding:10px 0px">
                        {{$dispatch->client_name}} <br> Nit: {{$dispatch->nit}}

                    </td>
                </tr>
            </tbody>
        </table>
    </main>

</body>

</html>
