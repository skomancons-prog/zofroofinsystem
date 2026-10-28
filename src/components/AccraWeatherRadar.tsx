/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun, 
  CloudLightning, 
  CloudSun, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Info,
  Calendar,
  Compass,
  Wrench,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AccraWeatherData } from "../types";

interface AccraWeatherRadarProps {
  onOpenConsultation?: (notes?: string) => void;
  onOpenEstimator?: () => void;
  variant?: "hero-card" | "header-chip" | "compact";
}

export function AccraWeatherRadar({
  onOpenConsultation,
  onOpenEstimator,
  variant = "hero-card"
}: AccraWeatherRadarProps) {
  const [weather, setWeather] = useState<AccraWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [simulationMode, setSimulationMode] = useState<string>("live");
  const [checklistOpen, setChecklistOpen] = useState<boolean>(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Keep live Accra local time updated
  useEffect(() => {
    const updateAccraTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Accra",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateAccraTime();
    const interval = setInterval(updateAccraTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data
  const fetchWeather = useCallback(async (mode: string = "live") => {
    try {
      if (mode === "live") {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const url = mode === "live" ? "/api/weather/accra" : `/api/weather/accra?mode=${mode}`;
      const res = await fetch(url);
      if (res.ok) {
        const data: AccraWeatherData = await res.json();
        setWeather(data);
      }
    } catch {
      // Graceful fallback: UI retains current weather state if offline or interrupted
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(simulationMode);
    // Auto-refresh every 5 minutes if on live mode
    if (simulationMode === "live") {
      const interval = setInterval(() => fetchWeather("live"), 300000);
      return () => clearInterval(interval);
    }
  }, [fetchWeather, simulationMode]);

  const handleModeChange = (mode: string) => {
    setSimulationMode(mode);
    fetchWeather(mode);
  };

  const toggleChecklist = (id: string) => {
    setCompletedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getWeatherIcon = (code: number, isRaining: boolean, size: string = "h-5 w-5") => {
    if (code >= 95) return <CloudLightning className={`${size} text-amber-400 animate-bounce`} />;
    if (isRaining || code >= 51) return <CloudRain className={`${size} text-blue-400 animate-pulse`} />;
    if (code === 0) return <Sun className={`${size} text-amber-500 animate-spin-slow`} />;
    return <CloudSun className={`${size} text-amber-400`} />;
  };

  const getAlertBadge = () => {
    if (!weather) return null;
    if (weather.alertLevel === "critical_rain") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/20 text-red-700 border border-red-500/40 animate-pulse">
          <AlertTriangle className="h-3 w-3 text-red-600" />
          <span>Heavy Rain Alert</span>
        </span>
      );
    }
    if (weather.alertLevel === "rain_alert") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-700 border border-blue-500/40">
          <CloudRain className="h-3 w-3 text-blue-600" />
          <span>Active Rain Alert</span>
        </span>
      );
    }
    if (weather.alertLevel === "high_humidity") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 border border-amber-500/40">
          <Droplets className="h-3 w-3 text-amber-700" />
          <span>High Humidity ({weather.humidity}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-800 border border-emerald-500/40">
        <ShieldCheck className="h-3 w-3 text-emerald-700" />
        <span>Favorable Weather</span>
      </span>
    );
  };

  // 1. Header Chip Variant (Compact navigation status bar pill)
  if (variant === "header-chip") {
    if (!weather && loading) {
      return (
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 text-stone-300 text-xs font-mono border border-stone-700">
          <RefreshCw className="h-3 w-3 animate-spin text-amber-400" />
          <span>Accra Weather...</span>
        </div>
      );
    }

    const isRain = weather?.isRaining;
    const isHighHum = weather?.isHighHumidity;

    return (
      <div 
        onClick={() => {
          const radar = document.getElementById("accra-weather-defense-radar");
          if (radar) {
            radar.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }}
        className="flex items-center space-x-2 px-3 py-1 bg-stone-900/95 hover:bg-stone-850 border border-stone-700/90 rounded-full text-xs font-mono text-stone-200 cursor-pointer shadow-xs transition-all group select-none"
        title="Accra Live Weather & Rainy Season Defense Radar"
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isRain ? "bg-red-400" : isHighHum ? "bg-amber-400" : "bg-emerald-400"
          }`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            isRain ? "bg-red-500" : isHighHum ? "bg-amber-500" : "bg-emerald-500"
          }`} />
        </span>

        <span className="font-bold text-stone-100 flex items-center space-x-1">
          <span>🇬🇭 Accra:</span>
          <span className="text-amber-400">{weather?.temperature}°C</span>
        </span>

        <span className="text-stone-400 hidden sm:inline">•</span>

        <span className="text-stone-300 hidden sm:inline flex items-center space-x-1">
          <Droplets className="h-3 w-3 text-blue-400 inline" />
          <span>{weather?.humidity}%</span>
        </span>

        {isRain && (
          <span className="bg-red-950/80 text-red-300 border border-red-600/50 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase hidden md:inline">
            🌧️ Rain Alert
          </span>
        )}

        {!isRain && isHighHum && (
          <span className="bg-amber-950/80 text-amber-300 border border-amber-600/50 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase hidden md:inline">
            💧 Humid Coastal
          </span>
        )}
      </div>
    );
  }

  // 2. Full Hero Card Variant (Rich interactive dashboard with live telemetry and defense tips)
  return (
    <div 
      id="accra-weather-defense-radar"
      className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all text-left"
    >
      {/* Background ambient gradient glow */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none ${
        weather?.isRaining 
          ? "bg-blue-600" 
          : weather?.isHighHumidity 
            ? "bg-amber-500" 
            : "bg-emerald-500"
      }`} />

      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-200/80 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60 uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5 text-blue-600 animate-spin-slow" />
              <span>Greater Accra Climate Telemetry</span>
            </span>
            {getAlertBadge()}
          </div>

          <h3 className="font-sans font-black text-xl text-stone-900 mt-2 tracking-tight flex items-center space-x-2">
            <span>Accra Live Weather & Rainy Season Defense</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-mono">
            Location: 5.6037° N, 0.1870° W • Local Time: <span className="font-bold text-stone-800">{currentTime || "Loading..."}</span> (GMT)
          </p>
        </div>

        {/* Live / Refresh & Simulator Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="bg-stone-100 p-1 rounded-xl border border-stone-200/80 flex items-center space-x-1 text-[11px] font-mono font-bold">
            <button
              type="button"
              onClick={() => handleModeChange("live")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                simulationMode === "live"
                  ? "bg-stone-900 text-amber-400 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              📡 Live Accra
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("rain")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                simulationMode === "rain"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-stone-600 hover:text-blue-700"
              }`}
              title="Test heavy rain storm response"
            >
              🌧️ Test Downpour
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("humidity")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                simulationMode === "humidity"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-stone-600 hover:text-amber-800"
              }`}
              title="Test coastal humidity & mist response"
            >
              💧 Test High Humidity
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("clear")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                simulationMode === "clear"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-stone-600 hover:text-emerald-700"
              }`}
              title="Test dry season response"
            >
              ☀️ Test Clear Sky
            </button>
          </div>

          <button
            type="button"
            onClick={() => fetchWeather(simulationMode)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
            title="Refresh Live Accra Weather"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Weather Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-5 relative z-10">
        {/* Temperature Metric */}
        <div className="bg-stone-50/90 border border-stone-200/90 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Temperature</span>
            <Thermometer className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display font-black text-2xl text-stone-900">
              {weather ? `${weather.temperature}°C` : "--"}
            </span>
            <span className="text-[10px] text-stone-500 font-mono font-semibold">
              Feels {weather?.apparentTemperature}°C
            </span>
          </div>
          <p className="text-[10px] text-stone-600 font-medium mt-1 truncate">
            {weather?.condition || "Loading condition..."}
          </p>
        </div>

        {/* Relative Humidity Metric */}
        <div className={`p-3.5 rounded-2xl border transition-colors ${
          (weather?.humidity ?? 0) >= 72
            ? "bg-amber-50/70 border-amber-300/80"
            : "bg-stone-50/90 border-stone-200/90"
        }`}>
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Humidity</span>
            <Droplets className={`h-4 w-4 ${(weather?.humidity ?? 0) >= 72 ? "text-amber-600" : "text-blue-500"}`} />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display font-black text-2xl text-stone-900">
              {weather ? `${weather.humidity}%` : "--"}
            </span>
            {(weather?.humidity ?? 0) >= 72 && (
              <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold font-mono">
                HIGH MOISTURE
              </span>
            )}
          </div>
          <p className="text-[10px] text-stone-600 font-medium mt-1">
            {(weather?.humidity ?? 0) >= 72 ? "Coastal moisture elevated" : "Normal atmospheric range"}
          </p>
        </div>

        {/* Rainfall / Precipitation Metric */}
        <div className={`p-3.5 rounded-2xl border transition-colors ${
          weather?.isRaining
            ? "bg-blue-50 border-blue-300"
            : "bg-stone-50/90 border-stone-200/90"
        }`}>
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Precipitation</span>
            <CloudRain className={`h-4 w-4 ${weather?.isRaining ? "text-blue-600" : "text-stone-400"}`} />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display font-black text-2xl text-stone-900">
              {weather ? `${weather.precipitation} mm` : "--"}
            </span>
            {weather?.isRaining && (
              <span className="text-[9px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-bold font-mono animate-pulse">
                DOWNPOUR
              </span>
            )}
          </div>
          <p className="text-[10px] text-stone-600 font-medium mt-1">
            {weather?.isRaining ? "Active rain over Accra" : "Dry surface conditions"}
          </p>
        </div>

        {/* Wind Speed Metric */}
        <div className="bg-stone-50/90 border border-stone-200/90 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Wind Gusts</span>
            <Wind className="h-4 w-4 text-stone-500" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display font-black text-2xl text-stone-900">
              {weather ? `${weather.windSpeed} km/h` : "--"}
            </span>
          </div>
          <p className="text-[10px] text-stone-600 font-medium mt-1">
            Gulf of Guinea Sea Breeze
          </p>
        </div>
      </div>

      {/* Dynamic Condition-Aware Rainy Season Defense Card */}
      <div className={`p-5 rounded-2xl border transition-all mb-5 relative z-10 ${
        weather?.alertLevel === "critical_rain"
          ? "bg-red-50/80 border-red-200 text-red-950"
          : weather?.alertLevel === "rain_alert"
            ? "bg-blue-50/80 border-blue-200 text-blue-950"
            : weather?.alertLevel === "high_humidity"
              ? "bg-amber-50/80 border-amber-200 text-amber-950"
              : "bg-emerald-50/80 border-emerald-200 text-emerald-950"
      }`}>
        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
            weather?.alertLevel === "critical_rain" || weather?.alertLevel === "rain_alert"
              ? "bg-blue-600 text-white"
              : weather?.alertLevel === "high_humidity"
                ? "bg-amber-600 text-white"
                : "bg-emerald-600 text-white"
          }`}>
            {getWeatherIcon(weather?.weatherCode ?? 0, weather?.isRaining ?? false, "h-6 w-6")}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-sans font-black text-base tracking-tight text-stone-900">
                {weather?.alertTitle || "Analyzing Accra Climate Conditions..."}
              </h4>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-stone-200 text-stone-700">
                Real-Time Defense AI
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {weather?.alertSummary}
            </p>
          </div>
        </div>

        {/* Dynamic Suggested Defense Checklist Items */}
        <div className="mt-4 pt-4 border-t border-stone-200/60 grid grid-cols-1 md:grid-cols-3 gap-3">
          {weather?.defenseTips.map((tip) => (
            <div 
              key={tip.id}
              className="bg-white/90 border border-stone-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    tip.urgency === "high"
                      ? "bg-red-100 text-red-800"
                      : tip.urgency === "medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {tip.urgency} priority
                  </span>
                  {tip.recommendedProfile && (
                    <span className="text-[9px] text-blue-700 font-bold font-mono truncate max-w-[120px]">
                      {tip.recommendedProfile}
                    </span>
                  )}
                </div>

                <h5 className="font-sans font-bold text-xs text-stone-900 leading-snug">
                  {tip.title}
                </h5>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {tip.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleChecklist(tip.id)}
                  className={`flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                    completedItems.includes(tip.id)
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  <Check className={`h-3 w-3 ${completedItems.includes(tip.id) ? "text-emerald-700" : "text-stone-400"}`} />
                  <span>{completedItems.includes(tip.id) ? "Audited" : "Mark as Checked"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenConsultation) {
                      onOpenConsultation(`Rainy Season Defense Inquiry: ${tip.title} (Accra Weather Alert: ${weather?.condition}, ${weather?.temperature}°C, ${weather?.humidity}% Humidity).`);
                    }
                  }}
                  className="text-[10px] font-sans font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Request Fix</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 relative z-10">
        <div className="flex items-center space-x-2 text-xs text-stone-600">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
          <span className="font-medium">
            ZOF 0.50mm Selflock & AZ150 Aluzinc engineered specifically for Ghana's tropical rainfall belts.
          </span>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onOpenConsultation) {
                onOpenConsultation(`Immediate Rainy Season Roof Inspection Booking for Accra site. Current conditions: ${weather?.condition}, Temp: ${weather?.temperature}°C, Humidity: ${weather?.humidity}%.`);
              }
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-sans font-bold text-xs tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Wrench className="h-3.5 w-3.5 text-amber-300" />
            <span>Book Rainy Season Roof Inspection</span>
          </button>

          {onOpenEstimator && (
            <button
              type="button"
              onClick={onOpenEstimator}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-sans font-black text-xs tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Get Waterproof Quote</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
