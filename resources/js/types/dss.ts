export type Dataset = {
    id: number;
    type: string;
    original_name: string;
    status: string;
    record_count: number;
    validation_errors?: string[];
    created_at: string;
};

export type ProcessedRecord = {
    id: number;
    year: number;
    month: number;
    consumption_kwh: number;
    temperature: number;
    humidity: number;
    rainfall: number;
    solar_irradiance: number;
    peak_demand_kw: number;
};

export type ForecastResult = {
    id: number;
    user_id?: number;
    user?: {
        id: number;
        name: string;
    } | null;
    predicted_at?: string;
    year: number;
    month: number;
    predicted_consumption_kwh: number;
    previous_consumption_kwh?: number;
    change_percent?: number;
    mae?: number;
    rmse?: number;
    r2_score?: number;
    model_type?: string;
    created_at: string;
};

export type DssResult = {
    id: number;
    demand_status: string;
    readiness_level: string;
    recommendations: string[];
    priority_actions: string[];
    basis?: Record<string, number>;
    created_at: string;
};

export type Report = {
    id: number;
    title: string;
    type: string;
    summary: Record<string, unknown>;
    created_at: string;
};
