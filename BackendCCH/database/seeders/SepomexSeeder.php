<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SepomexSeeder extends Seeder
{
    public function run(): void
    {
        ini_set('memory_limit', '256M');

        $txtPath = database_path('seeders/data/CPdescarga.txt');

        if (!file_exists($txtPath)) {
            $this->command->error("No se encontró el archivo: {$txtPath}");
            return;
        }

        $this->command->info('Limpiando tablas...');
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('colonias')->truncate();
        DB::table('codigos_postales')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $header = null;
        $codigosPostales = [];

        $handle = fopen($txtPath, 'r');
        fgets($handle);
        $header = explode('|', $this->limpiarLinea(fgets($handle)));

        while (($line = fgets($handle)) !== false) {
            $line = $this->limpiarLinea($line);
            if ($line === '') {
                continue;
            }

            $campos = explode('|', $line);
            if (count($campos) < count($header)) {
                continue;
            }

            $data = array_combine($header, $campos);
            $cp = str_pad(trim($data['d_codigo']), 5, '0', STR_PAD_LEFT);
            $ciudad = trim($data['d_ciudad']);
            $ciudad = $ciudad === '' ? null : $ciudad;

            if (!isset($codigosPostales[$cp]) || (empty($codigosPostales[$cp]['ciudad']) && $ciudad)) {
                $codigosPostales[$cp] = [
                    'cp' => $cp,
                    'estado' => trim($data['d_estado']),
                    'municipio' => trim($data['D_mnpio']),
                    'ciudad' => $ciudad,
                    'zona' => trim($data['d_zona']),
                ];
            }
        }
        fclose($handle);

        $this->command->info('Insertando ' . count($codigosPostales) . ' códigos postales...');
        foreach (array_chunk($codigosPostales, 1000, true) as $chunk) {
            DB::table('codigos_postales')->insert(array_values($chunk));
        }
        unset($codigosPostales);

        $handle = fopen($txtPath, 'r');
        fgets($handle);
        fgets($handle);

        $lote = [];
        $totalColonias = 0;

        while (($line = fgets($handle)) !== false) {
            $line = $this->limpiarLinea($line);
            if ($line === '') {
                continue;
            }

            $campos = explode('|', $line);
            if (count($campos) < count($header)) {
                continue;
            }

            $data = array_combine($header, $campos);
            $cp = str_pad(trim($data['d_codigo']), 5, '0', STR_PAD_LEFT);

            $lote[] = [
                'cp' => $cp,
                'nombre' => trim($data['d_asenta']),
                'tipo' => trim($data['d_tipo_asenta']) ?: null,
            ];
            $totalColonias++;

            if (count($lote) >= 1000) {
                DB::table('colonias')->insert($lote);
                $lote = [];
            }
        }
        fclose($handle);

        if (!empty($lote)) {
            DB::table('colonias')->insert($lote);
        }

        $this->command->info("Listo. {$totalColonias} colonias importadas.");
    }

    private function limpiarLinea(string|false $line): string
    {
        if ($line === false) {
            return '';
        }

        $line = rtrim($line, "\r\n");

        return mb_convert_encoding($line, 'UTF-8', 'ISO-8859-1');
    }
}
