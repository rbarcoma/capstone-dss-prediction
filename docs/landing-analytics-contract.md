# Landing analytics data contract

The public landing page currently receives no analytics data from Laravel. It therefore uses the isolated sample in `resources/js/components/landing/landing-data.ts` and labels every value as illustrative.

To replace the sample without changing the landing components, pass an optional `landingAnalytics` prop from the `home` route with this shape:

```ts
type LandingAnalyticsContract = {
    asOf: string | null;
    trend: Array<{
        period: string;
        consumptionKwh: number | string;
        peakDemandKw: number | string;
    }>;
    comparison: Array<{
        period: string;
        actualKwh: number | string | null;
        predictedKwh: number | string | null;
    }>;
    peakDemand: Array<{
        period: string;
        peakDemandKw: number | string;
    }>;
    latestForecast: {
        period: string;
        predictedConsumptionKwh: number | string;
        changePercent: number | string | null;
        modelType: string;
        mae: number | string | null;
        rmse: number | string | null;
        r2Score: number | string | null;
    } | null;
    decisionSupport: {
        demandStatus: string;
        readinessLevel: string;
        basis?: {
            predictedConsumptionKwh: number | string;
            averageConsumptionKwh: number | string;
            peakDemandKw: number | string;
            solarIrradiance: number | string;
        };
    } | null;
};
```

Example Laravel handoff:

```php
return Inertia::render('welcome', [
    'landingAnalytics' => $publicAggregate,
]);
```

## Integration rules

- Publish only aggregates that are approved for public viewing. Existing analytics, forecast, and DSS routes remain authenticated.
- Use `null` for missing observations and model estimates; do not substitute zero.
- `consumptionKwh`, forecast errors, and estimates use kWh. `peakDemandKw` uses kW. R² is unitless.
- `asOf` should be a human-readable or ISO date associated with the dataset snapshot.
- Passing the prop—even with empty arrays—switches the page out of illustrative mode and enables its built-in empty states.
- Renewable readiness is a study-specific rule output, not a certification. Solar irradiance is an input signal, not a PV yield or feasibility result.

