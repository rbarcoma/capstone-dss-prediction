<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClimateRecord;
use App\Models\ConsumptionRecord;
use App\Support\AuditLogger;
use App\Support\EnergyPreprocessor;
use App\Models\Dataset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use RuntimeException;

class DataManagementController extends Controller
{
    private array $required = [
        'year',
        'month',
        'consumption_kwh',
        'peak_demand_kw',
        'temperature',
        'humidity',
        'rainfall',
        'solar_irradiance',
    ];

    public function index()
    {
        return Inertia::render('Admin/DataManagement', [
            'datasets' => Dataset::with('user:id,name')->latest()->get(),
            'consumptionRecords' => ConsumptionRecord::query()->orderByDesc('year')->orderByDesc('month')->take(20)->get(),
            'climateRecords' => ClimateRecord::query()->orderByDesc('year')->orderByDesc('month')->take(20)->get(),
            'requiredColumns' => $this->required,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'dataset' => ['required', 'file', 'mimes:csv,txt'],
            'replace_existing' => ['nullable', 'boolean'],
        ]);

        $path = $request->file('dataset')->store('datasets');
        $dataset = Dataset::create([
            'user_id' => $request->user()->id,
            'type' => 'combined',
            'original_name' => $request->file('dataset')->getClientOriginalName(),
            'path' => $path,
            'status' => 'validating',
        ]);

        [$headers, $rows] = $this->readCsv(Storage::path($path));
        $missing = array_values(array_diff($this->required, $headers));

        if ($missing !== []) {
            $dataset->update([
                'status' => 'invalid',
                'validation_errors' => ['Missing columns: '.implode(', ', $missing)],
            ]);

            return back()->with('error', 'Dataset is invalid. Missing: '.implode(', ', $missing));
        }

        if ($request->boolean('replace_existing')) {
            ConsumptionRecord::truncate();
            ClimateRecord::truncate();
        }

        $monthlyRows = $this->aggregateMonthlyRows($rows);

        foreach ($monthlyRows as $row) {
            ConsumptionRecord::updateOrCreate(
                ['year' => $row['year'], 'month' => $row['month']],
                [
                    'dataset_id' => $dataset->id,
                    'consumption_kwh' => $row['consumption_kwh'],
                    'peak_demand_kw' => $row['peak_demand_kw'],
                ]
            );

            ClimateRecord::updateOrCreate(
                ['year' => $row['year'], 'month' => $row['month']],
                [
                    'dataset_id' => $dataset->id,
                    'temperature' => $row['temperature'],
                    'humidity' => $row['humidity'],
                    'rainfall' => $row['rainfall'],
                    'solar_irradiance' => $row['solar_irradiance'],
                ]
            );
        }

        $rawCount = count($rows);
        $monthlyCount = count($monthlyRows);

        $dataset->update(['status' => 'valid', 'record_count' => $rawCount]);

        AuditLogger::log(
            'Data Management',
            'Upload Dataset',
            'Uploaded combined electricity and climate dataset CSV with ' . $rawCount . ' raw records aggregated into ' . $monthlyCount . ' monthly records.'
        );

        try {
            $processedCount = EnergyPreprocessor::run();

            AuditLogger::log(
                'Preprocessing',
                'Auto Run Preprocessing',
                $processedCount . ' processed records generated after dataset upload.'
            );

            return back()->with(
                'success',
                "{$rawCount} daily records uploaded and aggregated into {$monthlyCount} monthly records. {$processedCount} processed records generated automatically."
            );
        } catch (RuntimeException $exception) {
            return back()->with(
                'success',
                "{$rawCount} daily records uploaded and aggregated into {$monthlyCount} monthly records. Preprocessing was not run: {$exception->getMessage()}"
            );
        }
    }

    public function destroy(Request $request, Dataset $dataset)
    {
        $data = $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (! Hash::check($data['password'], $request->user()->password)) {
            throw ValidationException::withMessages([
                'password' => 'The password is incorrect.',
            ]);
        }

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

    private function aggregateMonthlyRows(array $rows): array
    {
        $groups = [];

        foreach ($rows as $row) {
            $year = (int) $row['year'];
            $month = (int) $row['month'];
            $key = "{$year}-{$month}";

            $groups[$key] ??= [
                'year' => $year,
                'month' => $month,
                'days' => 0,
                'consumption_kwh' => 0.0,
                'peak_demand_kw' => 0.0,
                'temperature' => 0.0,
                'humidity' => 0.0,
                'rainfall' => 0.0,
                'solar_irradiance' => 0.0,
            ];

            $groups[$key]['days']++;
            $groups[$key]['consumption_kwh'] += (float) $row['consumption_kwh'];
            $groups[$key]['peak_demand_kw'] = max(
                $groups[$key]['peak_demand_kw'],
                (float) ($row['peak_demand_kw'] ?? 0)
            );
            $groups[$key]['temperature'] += (float) ($row['temperature'] ?? 0);
            $groups[$key]['humidity'] += (float) ($row['humidity'] ?? 0);
            $groups[$key]['rainfall'] += (float) ($row['rainfall'] ?? 0);
            $groups[$key]['solar_irradiance'] += (float) ($row['solar_irradiance'] ?? 0);
        }

        return collect($groups)
            ->sortBy([['year', 'asc'], ['month', 'asc']])
            ->map(function (array $group) {
                return [
                    'year' => $group['year'],
                    'month' => $group['month'],
                    'consumption_kwh' => $group['consumption_kwh'],
                    'peak_demand_kw' => $group['peak_demand_kw'],
                    'temperature' => $group['temperature'] / $group['days'],
                    'humidity' => $group['humidity'] / $group['days'],
                    'rainfall' => $group['rainfall'],
                    'solar_irradiance' => $group['solar_irradiance'] / $group['days'],
                ];
            })
            ->values()
            ->all();
    }
}
