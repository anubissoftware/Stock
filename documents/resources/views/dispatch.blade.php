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
    @php
        // dd($dispatch->enterprise_name);
    @endphp
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

                            <span style="font-size: 24px"> {{$dispatch->id}} </span> <br>


                        </div>
                    </th>
                    <th colspan="4">
                        <div style="min-height:80px; margin: 0px 0px 0px 40px; text-align: left">
                            <img style="height: 12px; width: 12px;"
                                src="http://localhost:8080/public/ourStock/ourStock.svg" alt="Fibiaan.png">
                        </div>
                    </th>
                </tr>
            </thead>
        </table>
    </header>

</body>

</html>
