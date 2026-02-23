"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { metricRegistry } from '@/lib/metricRegistry';

// Build default state from the registry
const defaultMetricsState = Object.keys(metricRegistry).reduce((acc, key) => {
    acc[key] = metricRegistry[key].defaultVisible;
    return acc;
}, {} as Record<string, boolean>);

interface DashboardContextType {
    dateRange: '7d' | '30d' | '90d';
    setDateRange: (range: '7d' | '30d' | '90d') => void;
    enabledMetrics: Record<string, boolean>;
    toggleMetric: (metricId: string) => void;
    metadataStatus: 'ok' | 'insufficient_data';
    setMetadataStatus: (status: 'ok' | 'insufficient_data') => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Initialize with defaults first (SSR-safe), then hydrate from localStorage in useEffect
    const [enabledMetrics, setEnabledMetrics] = useState<Record<string, boolean>>(defaultMetricsState);
    const [isHydrated, setIsHydrated] = useState(false);

    const [metadataStatus, setMetadataStatus] = useState<'ok' | 'insufficient_data'>('ok');

    // Hydrate from localStorage AFTER mount to prevent SSR mismatch
    useEffect(() => {
        try {
            const saved = localStorage.getItem('dashboard_metrics_prefs');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge: ensure all registry keys exist (new metrics get their defaults)
                const merged = { ...defaultMetricsState, ...parsed };
                setEnabledMetrics(merged);
            }
        } catch {
            // If localStorage is corrupted, use defaults
        }
        setIsHydrated(true);
    }, []);

    // Persist to localStorage when metrics change (but only after initial hydration)
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('dashboard_metrics_prefs', JSON.stringify(enabledMetrics));
        }
    }, [enabledMetrics, isHydrated]);

    const toggleMetric = (metricId: string) => {
        setEnabledMetrics((prev: Record<string, boolean>) => ({
            ...prev,
            [metricId]: !prev[metricId]
        }));
    };

    return (
        <DashboardContext.Provider value={{
            dateRange,
            setDateRange,
            enabledMetrics,
            toggleMetric,
            metadataStatus,
            setMetadataStatus
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
