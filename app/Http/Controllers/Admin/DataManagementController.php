<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClimateRecord;
use App\Models\ConsumptionRecord;
use App\Support\AuditLogger;
use App\Models\Dataset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DataManagementController extends Controller
{
    private array $required = [
        'electricity' => ['year', 'month', 'consumption_kwh', 'peak_demand_kw'],
        'climate' => ['year', 'month', 'temperature', 'humidity', 'rainfall', 'solar_irradiance'],
    ];

    public function index()
    {
        return Inertia::render('Admin/DataManagement', [
            'datasets' => Dataset::latest()->get(),
            'consumptionRecords' => ConsumptionRecord::query()->orderByDesc('year')->orderByDesc('month')->take(20)->get(),
            'climateRecords' => ClimateRecord::query()->orderByDesc('year')->orderByDesc('month')->take(20)->get(),
            'requiredColumns' => $this->required,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'in:electricity,climate'],
            'dataset' => ['required', 'file', 'mimes:csv,txt'],
            'replace_existing' => ['nullable', 'boolean'],
        ]);

        $path = $request->file('dataset')->store('datasets');
        $dataset = Dataset::create([
            'user_id' => $request->user()->id,
            'type' => $data['type'],
            'original_name' => $request->file('dataset')->getClientOriginalName(),
            'path' => $path,
            'status' => 'validating',
        ]);

        [$headers, $rows] = $this->readCsv(Storage::path($path));
        $missing = array_values(array_diff($this->required[$data['type']], $headers));

        if ($missing !== []) {
            $dataset->update([
                'status' => 'invalid',
                'validation_errors' => ['Missing columns: '.implode(', ', $missing)],
            ]);

            return back()->with('error', 'Dataset is invalid. Missing: '.implode(', ', $missing));
        }

        if ($request->boolean('replace_existing')) {
            $data['type'] === 'electricity' ? ConsumptionRecord::truncate() : ClimateRecord::truncate();
        }

        $count = 0;
        foreach ($rows as $row) {
            if ($data['type'] === 'electricity') {
                ConsumptionRecord::updateOrCreate(
                    ['year' => (int) $row['year'], 'month' => (int) $row['month']],
                    [
                        'dataset_id' => $dataset->id,
                        'consumption_kwh' => (float) $row['consumption_kwh'],
                        'peak_demand_kw' => (float) ($row['peak_demand_kw'] ?? 0),
                    ]
                );
            } else {
                ClimateRecord::updateOrCreate(
                    ['year' => (int) $row['year'], 'month' => (int) $row['month']],
                    [
                        'dataset_id' => $dataset->id,
                        'temperature' => (float) ($row['temperature'] ?? 0),
                        'humidity' => (float) ($row['humidity'] ?? 0),
                        'rainfall' => (float) ($row['rainfall'] ?? 0),
                        'solar_irradiance' => (float) ($row['solar_irradiance'] ?? 0),
                    ]
                );
            }
            $count++;
        }

        $dataset->update(['status' => 'valid', 'record_count' => $count]);

        AuditLogger::log(
            'Data Management',
            'Upload Dataset',
            'Uploaded ' . $data['type'] . ' dataset CSV with ' . $count . ' records.'
        );

        return back()->with('success', "{$count} {$data['type']} records uploaded.");
    }

    public function destroy(Dataset $dataset)
    {
        $fileName = $dataset->original_name;
        $type = $dataset->type;

        Storage::delete($dataset->path);
        $dataset->delete();

        AuditLogger::log(
            'Data Management',
            'Delete Dataset',
            'Deleted ' . $type . ' dataset: ' . $fileName . '.'
        );

        return back()->with('success', 'Dataset entry deleted.');
    }

    private function readCsv(string $path): array
    {
        $handle = fopen($path, 'r');
        $headers = array_map(fn ($value) => strtolower(trim($value)), fgetcsv($handle) ?: []);
        $rows = [];

        while (($line = fgetcsv($handle)) !== false) {
            if (count(array_filter($line, fn ($value) => $value !== null && $value !== '')) === 0) {
                continue;
            }
            $rows[] = array_combine($headers, array_pad($line, count($headers), null));
        }

        fclose($handle);

        return [$headers, $rows];
    }
}
