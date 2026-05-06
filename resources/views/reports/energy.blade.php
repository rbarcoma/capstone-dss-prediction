<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $report->title }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #111827; }
        h1 { font-size: 24px; }
        h2 { margin-top: 28px; font-size: 18px; }
        pre { white-space: pre-wrap; background: #f3f4f6; padding: 16px; border-radius: 8px; }
        @media print { button { display: none; } }
    </style>
</head>
<body>
    <button onclick="window.print()">Print / Save as PDF</button>
    <h1>{{ $report->title }}</h1>
    <p>Generated on {{ $report->created_at->format('F d, Y h:i A') }}</p>
    <h2>Report Summary</h2>
    <pre>{{ json_encode($report->summary, JSON_PRETTY_PRINT) }}</pre>
</body>
</html>
