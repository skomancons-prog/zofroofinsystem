/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { EstimateInput, EstimateResult } from "../types";
import { 
  Calendar, 
  CheckCircle2, 
  Award, 
  Phone, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  AlertCircle, 
  XCircle,
  Radio
} from "lucide-react";
import { WarrantyActivationSection } from "./WarrantyActivationSection";

interface ConsultationFormProps {
  currentEstimateInput: EstimateInput | null;
  currentEstimateResult: EstimateResult | null;
  initialNotes?: string;
}

export function ConsultationForm({ currentEstimateInput, currentEstimateResult, initialNotes }: ConsultationFormProps) {
  // Input fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Accra");
  const [preferredDate, setPreferredDate] = useState("");
  const [roofCondition, setRoofCondition] = useState<"good" | "leaking" | "missing_shingles" | "storm_damage" | "old_aged">("leaking");
  const [undertakings, setUndertakings] = useState<string[]>(["Free Estimate"]);
  const [notes, setNotes] = useState(initialNotes || "");

  useEffect(() => {
    if (initialNotes) {
      setNotes(initialNotes);
    }
  }, [initialNotes]);

  // Voice-to-Text Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Check Web Speech API support on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore cleanup error
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle Recording Timer
  useEffect(() => {
    if (isListening) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening]);

  const toggleVoiceToText = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setVoiceError("Voice-to-text is not supported in this browser. Please type your notes or try Chrome / Edge / Safari.");
      setIsSpeechSupported(false);
      return;
    }

    setVoiceError(null);

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      setInterimTranscript("");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // Try Ghanaian English first, standard English fallback
      recognition.lang = "en-GH";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcriptChunk;
          } else {
            currentInterim += transcriptChunk;
          }
        }

        setInterimTranscript(currentInterim);

        if (finalChunk) {
          setNotes((prevNotes) => {
            const trimmed = prevNotes.trim();
            const chunkFormatted = finalChunk.trim();
            if (!trimmed) {
              return chunkFormatted.charAt(0).toUpperCase() + chunkFormatted.slice(1);
            }
            // Append with space and proper punctuation
            const endsWithPunctuation = /[.!?]$/.test(trimmed);
            return `${trimmed}${endsWithPunctuation ? " " : ". "} ${chunkFormatted.charAt(0).toUpperCase() + chunkFormatted.slice(1)}`;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setVoiceError("Microphone permission was denied. Please allow microphone access in your browser settings.");
        } else if (event.error === "network") {
          setVoiceError("Network issue encountered with speech engine. Please check connection.");
        } else if (event.error !== "no-speech") {
          setVoiceError(`Voice input issue: ${event.error}. You can continue typing.`);
        }
        setIsListening(false);
        setInterimTranscript("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err);
      setVoiceError("Could not initialize microphone. Please check your browser audio permissions.");
      setIsListening(false);
    }
  };

  const handleInsertPrompt = (text: string) => {
    setNotes((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      return `${trimmed}. ${text}`;
    });
  };

  // Booking result status
  const [loading, setLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const localCities = [
    "Accra",
    "Tema",
    "Kumasi",
    "Koforidua",
    "Takoradi",
    "Cape Coast",
    "Tamale",
    "Sunyani",
    "Ho"
  ];

  const toggleUndertaking = (val: string) => {
    if (undertakings.includes(val)) {
      setUndertakings(undertakings.filter((u) => u !== val));
    } else {
      setUndertakings([...undertakings, val]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const payload = {
      fullName,
      email,
      phone,
      city,
      preferredDate,
      roofCondition,
      undertakings,
      notes,
      estimateDetails: currentEstimateInput && currentEstimateResult ? {
        ...currentEstimateInput,
        ...currentEstimateResult
      } : undefined
    };

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to secure scheduled appointment slot. Please try again.");
      }

      const data = await res.json();
      setBookingConfirmation(data);
    } catch (error: any) {
      setErr(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consultation" className="py-20 bg-slate-50 border-t border-slate-220 border-slate-200 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {bookingConfirmation ? (
          // Receipt confirmation box
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden text-white">
            
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CheckCircle2 className="h-40 w-40 text-emerald-400" />
            </div>

            <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-2">
              Appointment Logged Successfully!
            </h3>
            <p className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold mb-6">
              Reference Code: {bookingConfirmation.booking.id}
            </p>

            <div className="max-w-2xl mx-auto bg-slate-950/85 border border-slate-900 rounded-2xl p-5 text-left space-y-4 mb-8">
              <p className="text-slate-300 text-sm leading-relaxed">
                {bookingConfirmation.message}
              </p>

              <div className="border-t border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Scheduled Site Address:</span>
                  <span className="text-white font-sans text-sm font-semibold">{city}, Ghana</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Preferred Date Selected:</span>
                  <span className="text-white font-sans text-sm font-semibold">
                    {preferredDate ? new Date(preferredDate).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Immediate Callback"}
                  </span>
                </div>
              </div>

              {currentEstimateInput && currentEstimateResult && (
                <div className="border-t border-slate-900 pt-4">
                  <span className="text-slate-500 block font-mono text-xs mb-1.5">Captured Estimate Integration:</span>
                  <div className="bg-slate-900 p-3.5 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Material & Sizing</span>
                      <span className="text-xs font-sans font-bold text-white uppercase">{currentEstimateInput.roofType.replace(/_/g, " ")} ({currentEstimateInput.areaSqFt} sq ft)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-sans">Projected Range</span>
                      <span className="text-sm font-sans font-extrabold text-blue-400">
                        GHC {currentEstimateResult.totalEstimatedMin.toLocaleString()} - GHC {currentEstimateResult.totalEstimatedMax.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Golden Shield Warranty Activation Section */}
            <WarrantyActivationSection
              consultationId={bookingConfirmation.booking?.id || "ROOF-2026"}
              initialOwnerName={fullName}
              initialPhone={phone}
              initialEmail={email}
              initialCity={city}
              estimateInput={currentEstimateInput}
              estimateResult={currentEstimateResult}
            />

            <div className="space-y-3 pt-6">
              <div className="flex justify-center items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-400" />
                <span>Certified Master installation technicians, fully bonded & insured.</span>
              </div>
              <button
                type="button"
                onClick={() => setBookingConfirmation(null)}
                className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Schedule Another Inspection
              </button>
            </div>
          </div>
        ) : (
          // Main Input Consultation scheduler form
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl text-slate-900">
            
            {/* Header section details */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-950 tracking-tight mb-2">
                Book a Free Inspection & Consultation
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Need a certified inspector to walk your deck? Receive a precise diagnostic, digital roof reports, and fully binding warranties. No-obligation and zero hidden fees.
              </p>
              <div className="inline-flex flex-wrap items-center justify-center gap-3">
                <span className="text-xs text-slate-500 font-semibold font-sans">Or reach us instantly via WhatsApp Chat:</span>
                <a 
                  href="https://wa.me/233546331603?text=Hello%20Zof%20Group!%20I%20am%20interested%20in%2520arranging%20a%20free%20roofing%20inspection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-emerald-55 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold leading-none transition-all duration-150 shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>💬 Message +233 (0) 54 633 1603</span>
                </a>
              </div>
            </div>

            {/* Sourced estimate notice */}
            {currentEstimateInput && currentEstimateResult && (
              <div className="mb-8 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-9 w-9 bg-blue-150 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-blue-700 font-bold block">Integrations Live</span>
                    <span className="text-xs text-slate-700">Applying cost estimate: <strong className="font-bold text-blue-700">GHC {currentEstimateResult.totalEstimatedMin.toLocaleString()} - GHC {currentEstimateResult.totalEstimatedMax.toLocaleString()}</strong></span>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-600 text-white font-mono px-2.5 py-1 rounded font-bold">
                  {currentEstimateInput.roofType.replace(/_/g, " ")}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full name input */}
                <div className="text-left">
                  <label className="block text-xs font-mono uppercase text-slate-500 tracking-wider mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter first & last name"
                    className="w-full p-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-900 rounded-xl font-sans text-sm focus:outline-none focus:border-blue-600 transition-colors focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Email address input */}
                <div className="text-left">
                  <label className="block text-xs font-mono uppercase text-slate-500 tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full p-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-900 rounded-xl font-sans text-sm focus:outline-none focus:border-blue-600 transition-colors focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Contact Phone number */}
                <div className="text-left">
                  <label className="block text-xs font-mono uppercase text-slate-500 tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0242 866 658"
                    className="w-full p-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-900 rounded-xl font-sans text-sm focus:outline-none focus:border-blue-600 transition-colors focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* City of property selection */}
                <div className="text-left">
                  <label className="block text-xs font-mono uppercase text-slate-500 tracking-wider mb-2">
                    Ghana Service Town *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-900 rounded-xl font-sans text-sm focus:outline-none focus:border-blue-600 cursor-pointer transition-colors focus:ring-1 focus:ring-blue-600"
                  >
                    {localCities.map((c) => (
                      <option key={c} value={c}>
                        {c}, Ghana
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Desired schedule build date */}
                <div className="text-left">
                  <label className="block text-xs font-mono uppercase text-slate-500 tracking-wider mb-2">
                    Preferred Assessment Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-900 rounded-xl font-sans text-sm focus:outline-none focus:border-blue-600 cursor-pointer transition-colors focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Diagnostic condition status */}
                <div className="text-left">
                  <label className="block text-xs font-mono uppercase text-slate-500 tracking-wider mb-2">
                    Current Roof State Diagnostic
                  </label>
                  <select
                    value={roofCondition}
                    onChange={(e) => setRoofCondition(e.target.value as any)}
                    className="w-full p-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-900 rounded-xl font-sans text-sm focus:outline-none focus:border-blue-600 cursor-pointer transition-colors focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="good">Looking for preventative maintenance & audits</option>
                    <option value="leaking">Active leaks occurring on weather storms</option>
                    <option value="missing_shingles">Visible wind erosion & missing shingles</option>
                    <option value="storm_damage">Localized hail or tree fracture damages</option>
                    <option value="old_aged">Old roof nearing lifecycle end limits</option>
                  </select>
                </div>
              </div>

              {/* Scope of Undertakings checkboxes */}
              <div className="text-left bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                <label className="block text-xs font-mono uppercase text-slate-600 tracking-wider mb-3">
                  Scope of Undertakings Required
                </label>
                <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
                  Select all service types you require. Our division specialists will prepare localized solutions for your site.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { id: "Free Estimate", label: "Free Diagnostic Site Estimate", desc: "Digital inspection logs" },
                    { id: "Woodwork", label: "Timber Woodwork & Structural Carpentry", desc: "Bracings, trusses & framework framing" },
                    { id: "Consultancy", label: "Professional Metal & Aluzinc Consultancy", desc: "Atmospheric & marine durability analysis" },
                    { id: "Project Supervision", label: "Project Supervision & Remote Diaspora Logs", desc: "Camera updates & coordinate verification logs" }
                  ].map((item) => {
                    const isChecked = undertakings.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-start p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          isChecked
                            ? "border-blue-600 bg-blue-50/40 text-slate-900"
                            : "border-slate-200 bg-white text-slate-650 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-slate-305 text-blue-600 focus:ring-blue-500 h-4 w-4 shrink-0 transition-colors"
                          checked={isChecked}
                          onChange={() => toggleUndertaking(item.id)}
                        />
                        <div className="ml-3">
                          <p className={`text-xs font-bold ${isChecked ? "text-blue-700" : "text-slate-950"}`}>
                            {item.label}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Extra feedback notes & Voice-to-Text field */}
              <div className="text-left space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-mono uppercase text-slate-600 font-bold tracking-wider">
                    Structural Requirements & Notes
                  </label>

                  <div className="flex items-center space-x-2">
                    {/* Voice to text button */}
                    <button
                      type="button"
                      onClick={toggleVoiceToText}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer shadow-sm ${
                        isListening
                          ? "bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-red-500/30 ring-2 ring-red-400"
                          : "bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 shadow-amber-500/20"
                      }`}
                      title={isListening ? "Click to stop recording" : "Click to speak your roofing & structural requirements"}
                    >
                      {isListening ? (
                        <>
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                          </span>
                          <MicOff className="h-3.5 w-3.5" />
                          <span>Stop Listening ({recordingSeconds}s)</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-3.5 w-3.5" />
                          <span>Voice-to-Text</span>
                        </>
                      )}
                    </button>

                    {/* Clear text button if notes exist */}
                    {notes && (
                      <button
                        type="button"
                        onClick={() => setNotes("")}
                        className="text-[11px] font-mono text-slate-400 hover:text-slate-700 px-1.5 py-1 rounded hover:bg-slate-100 transition-colors"
                        title="Clear notes text"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Textarea container with relative positioning for voice feedback */}
                <div className="relative">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your structural needs, timber truss specifications, sheet thickness preferences, or site locations (or click 'Voice-to-Text' above to speak hands-free)..."
                    rows={4}
                    className={`w-full p-3.5 bg-white border text-slate-900 rounded-xl font-sans text-sm focus:outline-none transition-all ${
                      isListening
                        ? "border-red-400 ring-2 ring-red-100 bg-red-50/20"
                        : "border-slate-200 hover:border-slate-350 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    }`}
                  />

                  {/* Active Recording Overlay Bar */}
                  {isListening && (
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-sm border border-red-500/40 rounded-xl p-2.5 text-white flex items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {/* Animated sound wave bars */}
                        <div className="flex items-center space-x-0.5 shrink-0">
                          <span className="w-1 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                          <span className="w-1 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-red-400 font-bold block leading-tight">
                            Live Voice Dictation Active
                          </span>
                          <p className="text-xs text-slate-200 truncate italic font-sans">
                            {interimTranscript ? `"${interimTranscript}"` : "Speak clearly into your microphone..."}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={toggleVoiceToText}
                        className="shrink-0 text-[10px] font-mono font-bold bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>

                {/* Voice Error notice if any */}
                {voiceError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2 text-xs text-amber-900">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Voice Dictation Note:</span>
                      <span>{voiceError}</span>
                    </div>
                  </div>
                )}

                {/* Quick structural tags / speech shortcut chips */}
                <div className="pt-1">
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mb-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span className="font-mono uppercase font-bold text-[10px]">Quick Structural Need Presets:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Timber Truss & Hardwood Framing",
                      "0.45mm Aluzinc IBR Sheets",
                      "Standing Seam Concealed Fix",
                      "Valley Gutter Leak Diagnostic",
                      "Coastal Marine PVDF Anti-Corrosion",
                      "Rainwater Harvesting Gutter Integration"
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleInsertPrompt(preset)}
                        className="text-[10.5px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-sans"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {err && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
                  <span className="text-xs text-red-600 font-mono">Error: {err}</span>
                </div>
              )}

              {/* Secure booking Button layout */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-sans text-sm font-extrabold bg-amber-500 hover:bg-amber-600 active:scale-[0.99] disabled:opacity-50 text-slate-950 shadow-xl flex items-center justify-center space-x-2.5 select-none cursor-pointer transition-colors shadow-amber-500/10"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    <span>Secure Inspection Schedule Slot</span>
                  </>
                )}
              </button>

            </form>

            <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <MapPin className="h-4.5 w-4.5 text-blue-600 mb-1" />
                <span className="text-[11px] font-mono text-slate-500">Headquarters</span>
                <span className="text-xs text-slate-900 mt-0.5 font-semibold">Accra, Ghana</span>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="h-4.5 w-4.5 text-blue-600 mb-1" />
                <span className="text-[11px] font-mono text-slate-500">Direct Support</span>
                <a href="tel:0242866658" className="text-xs text-slate-900 hover:text-blue-700 hover:underline mt-0.5 font-bold">
                  0242 866 658
                </a>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="h-4.5 w-4.5 text-blue-600 mb-1" />
                <span className="text-[11px] font-mono text-slate-500">Inbound Mail</span>
                <span className="text-xs text-slate-900 mt-0.5 font-semibold">info@zofroofing.com</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
