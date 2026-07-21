<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ResponseHelper;
use App\Models\Productos;
use Illuminate\Support\Facades\Validator;

class ProductosController extends Controller
{
    //Obtener Productos Registrados
    public function ObtenerProductos()
    {
        $productos = Productos::with([
            'linea',
            'marca',
            'unidadMedida'
        ])->get();

        $productosFormateados = $productos->map(function ($producto) {
            return [
                'IDProducto' => $producto->IDProducto,
                'codigo' => $producto->Codigo,
                'nombre' => $producto->Nombre,
                'claveSAT' => $producto->ClaveSAT,
                'fechaRegistro' => $producto->FechaRegistro,
                'activo' => $producto->Activo,

                'linea' => [
                    'id' => $producto->linea?->IDLinea,
                    'nombre' => $producto->linea?->Nombre,
                ],
                'marca' => [
                    'id' => $producto->marca?->IDMarca,
                    'nombre' => $producto->marca?->Nombre,
                ],
                'unidadMedida' => [
                    'id' => $producto->unidadMedida?->IDUnidadMedida,
                    'nombre' => $producto->unidadMedida?->Nombre,
                ],
            ];
        });

        return ResponseHelper::success($productosFormateados, 'Catálogo de productos obtenido correctamente');
    }

    //Ver Producto
    public function VerProducto($id)
    {
        $producto = Productos::with('linea', 'marca', 'unidadMedida')->findOrFail($id);
        $productoFormateado = [
            'IDProducto' => $producto->IDProducto,
            'codigo' => $producto->Codigo,
            'nombre' => $producto->Nombre,
            'claveSAT' => $producto->ClaveSAT,
            'fechaRegistro' => $producto->FechaRegistro,
            'activo' => $producto->Activo,

            'linea' => [
                'id' => $producto->linea?->IDLinea,
                'nombre' => $producto->linea?->Nombre,
            ],
            'marca' => [
                'id' => $producto->marca?->IDMarca,
                'nombre' => $producto->marca?->Nombre,
            ],
            'unidadMedida' => [
                'id' => $producto->unidadMedida?->IDUnidadMedida,
                'nombre' => $producto->unidadMedida?->Nombre,
            ],
        ];

        return ResponseHelper::success($productoFormateado, "Detalles del producto obtenidos correctamente.");
    }






    //Registrar Productos
    public function CrearProducto(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'Codigo' => 'required|string|max:100|unique:productos,Codigo',
                'Nombre' => 'required|string|max:255',
                'IDLinea' => 'required|exists:linea_productos,IDLinea',
                'IDMarca' => 'required|exists:marca_productos,IDMarca',
                'IDUnidadMedida' => 'required|exists:unidades_medida,IDUnidadMedida',
                'ClaveSAT' => 'required|string|max:50',
            ]
        );

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $producto = new Productos();
        $producto->Codigo = $request->input('Codigo');
        $producto->Nombre = $request->input('Nombre');
        $producto->IDLinea = $request->input('IDLinea');
        $producto->IDMarca = $request->input('IDMarca');
        $producto->IDUnidadMedida = $request->input('IDUnidadMedida');
        $producto->ClaveSAT = $request->input('ClaveSAT');
        $producto->FechaRegistro = now()->toDateString();
        $producto->Activo = true;

        if ($producto->save()) {
            return ResponseHelper::success($producto, 'Producto registrado exitosamente', 201);
        } else {
            return ResponseHelper::error('Error al registrar producto', 500);
        }
    }


    // Actualizar Productos
    public function ActualizarProducto(Request $request, $id)
    {
        $producto = Productos::find($id);

        if (!$producto) {
            return ResponseHelper::error('Producto no encontrado', 404);
        }

        $validator = Validator::make($request->all(), [
            'Codigo' => 'required|string|max:100|unique:productos,Codigo,' . $id . ',IDProducto',
            'Nombre' => 'required|string|max:255',
            'IDLinea' => 'required|exists:linea_productos,IDLinea',
            'IDMarca' => 'required|exists:marca_productos,IDMarca',
            'IDUnidadMedida' => 'required|exists:unidades_medida,IDUnidadMedida',
            'ClaveSAT' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors()->first(), 400);
        }

        $producto->Codigo = $request->input('Codigo');
        $producto->Nombre = $request->input('Nombre');
        $producto->IDLinea = $request->input('IDLinea');
        $producto->IDMarca = $request->input('IDMarca');
        $producto->IDUnidadMedida = $request->input('IDUnidadMedida');
        $producto->ClaveSAT = $request->input('ClaveSAT');

        if ($producto->save()) {
            return ResponseHelper::success($producto, 'Producto actualizado correctamente');
        }

        return ResponseHelper::error('Error al actualizar el producto', 500);
    }

    //Eliminar Producto
    public function EliminarProducto($id)
    {
        $producto = Productos::findOrFail($id);
        $producto->delete();

        return ResponseHelper::success('Producto eliminado correctamente');
    }
}
