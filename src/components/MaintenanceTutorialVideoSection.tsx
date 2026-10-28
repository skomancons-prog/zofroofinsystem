/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  FastForward,
  Rewind,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Droplets,
  Sun,
  FileText,
  Printer,
  RefreshCw,
  Clock,
  Layers,
  Video,
  ChevronRight,
  Info,
  Check,
  X,
  Send,
  Zap,
  SlidersHorizontal,
  Compass
} from "lucide-react";

export interface TutorialScene {
  sceneNumber: number;
  title: string;
  durationSeconds: number;
  visualDescription: string;
  narration: string;
  actionTip: string;
  doNotDo: string;
  graphicType: "wash_spray" | "gutter_clear" | "screw_check" | "corrosion_inspect" | "solar_mount" | "scratch_touchup";
}

export interface AluzincTutorial {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: "DIY Safe" | "Intermediate" | "Professional Crew";
  frequency: string;
  summary: string;
  safetyGear: string[];
  toolsRequired: string[];
  scenes: TutorialScene[];
  proTips: string[];
  aiGenerated?: boolean;
}

const PRESET_TOPICS = [
  "How to safely wash coastal salt crust off Aluzinc sheets",
  "Clearing box gutters and valley flashings before rainy season",
  "Checking roofing screw rubber washers for water leaks",
  "Preventing galvanic corrosion from copper AC pipes and wires",
  "Cleaning Aluzinc roofing around solar panel mounting brackets"
];

export function MaintenanceTutorialVideoSection() {
  const [tutorials, setTutorials] = useState<AluzincTutorial[]>([]);
  const [activeTutorialIndex, setActiveTutorialIndex] = useState<number>(0);
  const [isLoadingCurated, setIsLoadingCurated] = useState<boolean>(true);
  
  // Video playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAudioNarrating, setIsAudioNarrating] = useState<boolean>(false);
  
  // Custom Gemini Generation state
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isGeneratingTutorial, setIsGeneratingTutorial] = useState<boolean>(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);
  
  // Gemini Omni Video Render state
  const [isRenderingOmniVideo, setIsRenderingOmniVideo] = useState<boolean>(false);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [omniNotice, setOmniNotice] = useState<string | null>(null);

  // Active scene calculation
  const theaterRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Load curated tutorials from backend
  useEffect(() => {
    async function fetchTutorials() {
      try {
        const res = await fetch("/api/tutorials/curated");
        if (res.ok) {
          const data = await res.json();
          if (data.tutorials && data.tutorials.length > 0) {
            setTutorials(data.tutorials);
          }
        }
      } catch (err) {
        console.warn("Could not load curated tutorials from API, using built-in defaults:", err);
      } finally {
        setIsLoadingCurated(false);
      }
    }
    fetchTutorials();
  }, []);

  const currentTutorial = tutorials[activeTutorialIndex] || null;

  // Calculate total duration in seconds from scenes
  const totalDurationSeconds = currentTutorial
    ? currentTutorial.scenes.reduce((acc, sc) => acc + sc.durationSeconds, 0)
    : 45;

  // Find currently playing scene based on currentTime
  let accumulatedTime = 0;
  let activeSceneIndex = 0;
  let sceneProgress = 0;

  if (currentTutorial && currentTutorial.scenes.length > 0) {
    for (let i = 0; i < currentTutorial.scenes.length; i++) {
      const scene = currentTutorial.scenes[i];
      if (currentTime >= accumulatedTime && currentTime < accumulatedTime + scene.durationSeconds) {
        activeSceneIndex = i;
        sceneProgress = (currentTime - accumulatedTime) / scene.durationSeconds;
        break;
      }
      accumulatedTime += scene.durationSeconds;
    }
    if (currentTime >= totalDurationSeconds) {
      activeSceneIndex = currentTutorial.scenes.length - 1;
      sceneProgress = 1;
    }
  }

  const activeScene = currentTutorial?.scenes[activeSceneIndex] || null;

  // Initialize browser speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Play narration audio when scene changes if narration is toggled on and not muted
  useEffect(() => {
    if (!isPlaying || isMuted || !isAudioNarrating || !activeScene || !synthRef.current) return;

    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(activeScene.narration);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      synthRef.current.speak(utterance);
    } catch {
      // Speech synthesis unsupported or blocked
    }

    return () => {
      synthRef.current?.cancel();
    };
  }, [activeSceneIndex, isPlaying, isMuted, isAudioNarrating, playbackSpeed]);

  // Video playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      synthRef.current?.cancel();
      return;
    }

    lastTickRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const deltaSec = ((now - lastTickRef.current) / 1000) * playbackSpeed;
      lastTickRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= totalDurationSeconds) {
          setIsPlaying(false);
          synthRef.current?.cancel();
          return 0; // reset to beginning for loop
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, totalDurationSeconds]);

  // Jump to specific scene
  const jumpToScene = (targetIdx: number) => {
    if (!currentTutorial) return;
    let time = 0;
    for (let i = 0; i < targetIdx; i++) {
      time += currentTutorial.scenes[i].durationSeconds;
    }
    setCurrentTime(time);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(ratio * totalDurationSeconds);
  };

  const handleTogglePlay = () => {
    if (currentTime >= totalDurationSeconds - 0.5) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSkip = (seconds: number) => {
    setCurrentTime((t) => Math.max(0, Math.min(totalDurationSeconds, t + seconds)));
  };

  const toggleFullscreen = () => {
    if (!theaterRef.current) return;
    if (!document.fullscreenElement) {
      theaterRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Generate tutorial using Gemini API
  const handleGenerateCustomTutorial = async (topicToUse?: string) => {
    const query = (topicToUse || customPrompt).trim();
    if (!query) return;

    setIsGeneratingTutorial(true);
    setGenerationNotice(null);

    try {
      const response = await fetch("/api/tutorials/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: query,
          environmentContext: "Accra, Ghana coastal tropical climate (salt spray, intense sunlight, torrential rainy season)"
        })
      });

      const data = await response.json();
      if (data.success && data.tutorial) {
        setTutorials((prev) => [data.tutorial, ...prev]);
        setActiveTutorialIndex(0);
        setCurrentTime(0);
        setIsPlaying(true);
        setRenderedVideoUrl(null);
        setGenerationNotice(`Generated new AI tutorial: "${data.tutorial.title}" via Gemini!`);
        setTimeout(() => setGenerationNotice(null), 5000);
      } else {
        setGenerationNotice(data.error || "Could not generate tutorial with Gemini. Please try again.");
      }
    } catch (err: any) {
      setGenerationNotice(err.message || "Failed to reach Gemini tutorial engine.");
    } finally {
      setIsGeneratingTutorial(false);
    }
  };

  // Render actual video via Gemini Omni API
  const handleRenderOmniVideo = async () => {
    if (!activeScene) return;
    setIsRenderingOmniVideo(true);
    setOmniNotice("Requesting AI video clip generation via Gemini Omni (gemini-omni-1.1-flash)...");

    try {
      const response = await fetch("/api/tutorials/video-render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Scene: ${activeScene.title}. ${activeScene.visualDescription}`,
          duration: "5s",
          resolution: "720p"
        })
      });

      const data = await response.json();
      if (data.success && data.videoUrl) {
        setRenderedVideoUrl(data.videoUrl);
        setOmniNotice("Video clip generated successfully with Gemini Omni!");
        setTimeout(() => setOmniNotice(null), 6000);
      } else {
        setOmniNotice(data.message || "Interactive simulated video active.");
        setTimeout(() => setOmniNotice(null), 7000);
      }
    } catch (err: any) {
      setOmniNotice("Video rendering server notice: " + (err.message || "Unable to render video."));
      setTimeout(() => setOmniNotice(null), 6000);
    } finally {
      setIsRenderingOmniVideo(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePrintGuide = () => {
    window.print();
  };

  return (
    <section id="maintenance-tutorials" className="py-20 bg-stone-950 text-stone-100 scroll-mt-20 border-t border-stone-800 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-4 font-mono shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Gemini AI • Maintenance Video Tutorial Studio</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white tracking-tight mb-4 drop-shadow-md">
            Aluzinc Care & Preservation Videos
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-sans max-w-2xl mx-auto">
            Brief, high-impact instructional video lessons powered by Gemini. Master verified professional methods to eliminate salt-crust corrosion, clear monsoon gutters, and preserve your 50-year warranty.
          </p>
        </div>

        {/* Status Notification Banner if applicable */}
        {(generationNotice || omniNotice) && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs sm:text-sm font-mono flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-amber-400 shrink-0" />
              <span>{generationNotice || omniNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setGenerationNotice(null);
                setOmniNotice(null);
              }}
              className="text-amber-300 hover:text-white ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* MAIN VIDEO THEATER + TUTORIAL DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT 7 COLS: WIDESCREEN VIDEO THEATER */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* The Video Screen Frame */}
            <div
              ref={theaterRef}
              className={`relative bg-stone-900 border-2 border-stone-700 rounded-3xl overflow-hidden shadow-2xl group ${
                isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "aspect-video"
              }`}
            >
              {/* Either Rendered Real Video from Gemini Omni OR Animated Interactive Scene Canvas */}
              {renderedVideoUrl ? (
                <div className="w-full h-full bg-black relative flex items-center justify-center">
                  <video
                    src={renderedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setRenderedVideoUrl(null)}
                    className="absolute top-4 right-4 bg-stone-950/80 hover:bg-stone-800 text-white text-xs px-3 py-1.5 rounded-xl border border-stone-700 flex items-center space-x-1"
                  >
                    <span>Switch to Interactive Simulation</span>
                  </button>
                </div>
              ) : (
                /* INTERACTIVE ANIMATED SCENE CANVAS */
                <div className="w-full h-full relative bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden">
                  
                  {/* Procedural Visual Animated Backdrop matching Scene Graphic Type */}
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="corrugation-lines" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 0 20 Q 10 5, 20 20 T 40 20" fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.3" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#corrugation-lines)" />
                    </svg>
                  </div>

                  {/* Scene Graphic Simulation Centerpiece */}
                  <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
                    
                    {/* Dynamic Graphic Icon & Wave Animation */}
                    <div className="relative mb-4">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border-2 shadow-2xl transition-all duration-500 ${
                        isPlaying 
                          ? "bg-amber-500/20 border-amber-400 text-amber-300 scale-105 shadow-amber-500/20" 
                          : "bg-stone-800 border-stone-600 text-stone-400"
                      }`}>
                        {activeScene?.graphicType === "wash_spray" && <Droplets className="h-10 w-10 text-cyan-400 animate-pulse" />}
                        {activeScene?.graphicType === "gutter_clear" && <Wrench className="h-10 w-10 text-amber-400" />}
                        {activeScene?.graphicType === "screw_check" && <CheckCircle2 className="h-10 w-10 text-emerald-400" />}
                        {activeScene?.graphicType === "corrosion_inspect" && <ShieldCheck className="h-10 w-10 text-rose-400" />}
                        {activeScene?.graphicType === "solar_mount" && <Sun className="h-10 w-10 text-amber-300" />}
                        {activeScene?.graphicType === "scratch_touchup" && <Sparkles className="h-10 w-10 text-indigo-400" />}
                      </div>

                      {/* Animated Water Spray / Action Ripple effect when playing */}
                      {isPlaying && (
                        <div className="absolute -inset-2 rounded-3xl border border-amber-400/40 animate-ping pointer-events-none" />
                      )}
                    </div>

                    {/* Scene Title in Video Theater */}
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-stone-950/80 px-3 py-1 rounded-full border border-amber-500/40 mb-2">
                      Scene {activeSceneIndex + 1} of {currentTutorial?.scenes.length || 4}: {activeScene?.title}
                    </span>

                    {/* Live Visual Storyboard Action Text */}
                    <p className="text-xs sm:text-sm md:text-base text-stone-200 font-sans max-w-xl leading-relaxed drop-shadow-md">
                      {activeScene?.visualDescription}
                    </p>

                    {/* Action Directive Overlay Badge */}
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-xl text-[11px] font-mono font-bold">
                        <Check className="h-3.5 w-3.5" />
                        <span>DO: {activeScene?.actionTip}</span>
                      </div>
                      <div className="inline-flex items-center space-x-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-xl text-[11px] font-mono font-bold">
                        <X className="h-3.5 w-3.5" />
                        <span>DO NOT: {activeScene?.doNotDo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Bar inside Screen: Category Tag & Duration */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
                    <span className="bg-slate-950/90 text-amber-300 border border-amber-500/50 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg flex items-center space-x-1.5">
                      <Video className="h-3.5 w-3.5 text-amber-400" />
                      <span>{currentTutorial?.category || "Aluzinc Care"}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      {currentTutorial?.aiGenerated && (
                        <span className="bg-blue-500/30 text-blue-300 border border-blue-400/50 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1">
                          <Sparkles className="h-3 w-3" />
                          <span>Gemini Flash</span>
                        </span>
                      )}
                      <span className="bg-slate-950/80 text-stone-300 border border-stone-700 px-2.5 py-1 rounded-xl text-xs font-mono font-bold">
                        {formatTime(currentTime)} / {formatTime(totalDurationSeconds)}
                      </span>
                    </div>
                  </div>

                  {/* Subtitle / Closed Caption Bar Overlay */}
                  {showCaptions && activeScene && (
                    <div className="relative z-20 mx-auto max-w-2xl w-full bg-slate-950/90 border border-stone-700/80 rounded-2xl p-2.5 sm:p-3 text-center mb-1 backdrop-blur-md shadow-2xl transition-all">
                      <div className="flex items-center justify-center space-x-2">
                        {isAudioNarrating && (
                          <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                        )}
                        <p className="text-xs sm:text-sm font-sans font-medium text-amber-200 leading-snug">
                          "{activeScene.narration}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Center Overlay Big Play Button when Paused */}
                  {!isPlaying && (
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer z-30 ring-4 ring-amber-400/30"
                      title="Play Tutorial Video"
                    >
                      <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1 fill-slate-950" />
                    </button>
                  )}

                </div>
              )}

              {/* Bottom Video Controls Overlay Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950 via-stone-950/95 to-transparent p-3 sm:p-4 z-30 transition-opacity">
                
                {/* Scrubbing Progress Bar with Chapter Markers */}
                <div 
                  className="relative h-2.5 bg-stone-800 hover:h-3.5 rounded-full mb-3 cursor-pointer transition-all overflow-hidden border border-stone-700/80"
                  onClick={handleSeek}
                  title="Click to seek"
                >
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (currentTime / totalDurationSeconds) * 100)}%` }}
                  />
                  
                  {/* Chapter Dividers */}
                  {currentTutorial?.scenes.map((sc, i) => {
                    let markTime = 0;
                    for (let j = 0; j < i; j++) markTime += currentTutorial.scenes[j].durationSeconds;
                    const pct = (markTime / totalDurationSeconds) * 100;
                    if (pct === 0) return null;
                    return (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 w-0.5 bg-stone-950/80 pointer-events-none"
                        style={{ left: `${pct}%` }}
                      />
                    );
                  })}
                </div>

                {/* Control Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  
                  {/* Left: Playback & Navigation */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="p-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition-all font-bold cursor-pointer shadow-md"
                      title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4 fill-slate-950" /> : <Play className="h-4 w-4 fill-slate-950 ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestart}
                      className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 transition-colors cursor-pointer"
                      title="Replay from start"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSkip(-5)}
                      className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 transition-colors cursor-pointer hidden sm:block"
                      title="Rewind 5s"
                    >
                      <Rewind className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSkip(5)}
                      className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 transition-colors cursor-pointer hidden sm:block"
                      title="Fast forward 5s"
                    >
                      <FastForward className="h-4 w-4" />
                    </button>

                    <span className="text-stone-300 font-bold ml-2">
                      {formatTime(currentTime)} / {formatTime(totalDurationSeconds)}
                    </span>
                  </div>

                  {/* Right: Audio Narration, CC, Speed & Fullscreen */}
                  <div className="flex items-center space-x-2">
                    
                    {/* Voiceover Speech Synthesis Audio Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsAudioNarrating(!isAudioNarrating)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        isAudioNarrating
                          ? "bg-amber-500/20 border-amber-500 text-amber-300"
                          : "bg-stone-900 border-stone-700 text-stone-400 hover:text-white"
                      }`}
                      title={isAudioNarrating ? "Voiceover Audio is ON" : "Turn Voiceover Audio ON"}
                    >
                      {isAudioNarrating ? <Volume2 className="h-3.5 w-3.5 text-amber-400" /> : <VolumeX className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">Voiceover</span>
                    </button>

                    {/* Closed Captions CC */}
                    <button
                      type="button"
                      onClick={() => setShowCaptions(!showCaptions)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                        showCaptions
                          ? "bg-amber-400 text-slate-950 border-amber-300"
                          : "bg-stone-900 border-stone-700 text-stone-400 hover:text-white"
                      }`}
                      title="Toggle Subtitles"
                    >
                      CC
                    </button>

                    {/* Speed Selector */}
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="bg-stone-900 border border-stone-700 text-stone-200 rounded-xl px-2 py-1 text-[11px] font-mono cursor-pointer focus:outline-none"
                    >
                      <option value="0.75">0.75x</option>
                      <option value="1.0">1.0x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                    </select>

                    {/* Fullscreen Button */}
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 transition-colors cursor-pointer"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* Scene Timeline Chapter Badges */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 flex flex-wrap gap-2 items-center justify-between text-xs font-mono">
              <span className="text-stone-400 font-bold uppercase text-[10px] tracking-wider ml-1">
                Video Chapters:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentTutorial?.scenes.map((sc, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => jumpToScene(sIdx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                      activeSceneIndex === sIdx
                        ? "bg-amber-400 text-slate-950 shadow-md font-black"
                        : "bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800"
                    }`}
                  >
                    <span>{sIdx + 1}. {sc.title.slice(0, 22)}...</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Gemini Omni Video Clip Render Request */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3 text-stone-300">
                <Video className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Gemini Omni Flash Video Render Option</span>
                  <span className="text-stone-400 text-[11px]">Generate a photorealistic 720p/1080p video clip demonstrating this scene via Gemini Omni.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRenderOmniVideo}
                disabled={isRenderingOmniVideo}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 text-amber-300 rounded-xl font-bold font-mono text-xs whitespace-nowrap transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isRenderingOmniVideo ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
                    <span>Rendering with Omni...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Render Video Clip</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* RIGHT 4 COLS: TUTORIAL SPECIFICATIONS & CHECKLIST */}
          <div className="lg:col-span-4 space-y-4 text-left">
            
            {/* Active Tutorial Info Card */}
            <div className="bg-stone-900 border-2 border-stone-700 rounded-3xl p-6 shadow-xl space-y-5">
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-lg">
                    {currentTutorial?.difficulty || "DIY Safe"}
                  </span>
                  <span className="text-xs font-mono text-stone-400 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>{currentTutorial?.duration || "45s"}</span>
                  </span>
                </div>

                <h3 className="font-sans font-black text-xl text-white tracking-tight leading-snug">
                  {currentTutorial?.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                  {currentTutorial?.summary}
                </p>
              </div>

              {/* Required Tools & Safety Gear Pills */}
              <div className="space-y-3 pt-3 border-t border-stone-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block mb-1.5">
                    Recommended Safety Gear:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTutorial?.safetyGear.map((gear, gIdx) => (
                      <span key={gIdx} className="bg-stone-950 text-stone-200 border border-stone-800 px-2.5 py-1 rounded-lg text-[11px] font-mono">
                        🛡️ {gear}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block mb-1.5">
                    Tools & Materials:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTutorial?.toolsRequired.map((tool, tIdx) => (
                      <span key={tIdx} className="bg-stone-950 text-stone-200 border border-stone-800 px-2.5 py-1 rounded-lg text-[11px] font-mono">
                        🔧 {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ghana Climate Pro-Tips */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-black block">
                  Ghana Tropical Defense Tips:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-300 font-sans">
                  {currentTutorial?.proTips.map((tip, pIdx) => (
                    <li key={pIdx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrintGuide}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer w-full justify-center"
                >
                  <Printer className="h-3.5 w-3.5 text-amber-400" />
                  <span>Print Care Checklist</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* SECTION 2: VERIFIED ALUZINC TUTORIAL LIBRARY CARDS */}
        <div className="mb-14 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h3 className="font-sans font-black text-2xl text-white tracking-tight">
                Curated Aluzinc Care Video Lessons
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Select any instructional module below to load it into the Video Theater above.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold">
              {tutorials.length} Video Lessons Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tutorials.map((tut, idx) => {
              const isSelected = idx === activeTutorialIndex;
              return (
                <div
                  key={tut.id}
                  onClick={() => {
                    setActiveTutorialIndex(idx);
                    setCurrentTime(0);
                    setIsPlaying(true);
                    setRenderedVideoUrl(null);
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left group ${
                    isSelected
                      ? "bg-stone-900 border-amber-400 shadow-xl ring-2 ring-amber-400/20"
                      : "bg-stone-900/60 hover:bg-stone-900 border-stone-800 hover:border-stone-600"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-mono uppercase font-extrabold px-2 py-0.5 rounded-lg border ${
                        isSelected 
                          ? "bg-amber-400 text-slate-950 border-amber-300" 
                          : "bg-stone-950 text-stone-400 border-stone-800"
                      }`}>
                        Lesson {idx + 1}
                      </span>
                      <span className="text-xs font-mono text-stone-400 flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-amber-400" />
                        <span>{tut.duration}</span>
                      </span>
                    </div>

                    <h4 className="font-sans font-black text-base text-white group-hover:text-amber-300 transition-colors leading-snug mb-2">
                      {tut.title}
                    </h4>

                    <p className="text-xs text-stone-300 font-sans line-clamp-3 leading-relaxed mb-4">
                      {tut.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">{tut.scenes.length} Video Scenes</span>
                    <span className="flex items-center space-x-1 text-stone-300 group-hover:text-white font-semibold">
                      <span>{isSelected ? "Now Playing" : "Load Video"}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: "GENERATE CUSTOM VIDEO TUTORIAL WITH GEMINI" STUDIO */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-900/90 to-stone-950 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 text-left shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-48 h-48 text-amber-400" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Interactive Gemini Video Generator</span>
            </div>

            <h3 className="font-sans font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
              Generate a Custom Aluzinc Care Video Tutorial
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans mb-6">
              Have a specific roof scenario, local environment question, or renovation issue? Ask Gemini to generate a tailored, multi-scene instructional video with narration, tools list, and safety protocols for immediate playback.
            </p>

            {/* Quick Prompt Pills */}
            <div className="mb-4">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-bold block mb-2">
                Click any common scenario to generate:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_TOPICS.map((topic, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setCustomPrompt(topic);
                      handleGenerateCustomTutorial(topic);
                    }}
                    disabled={isGeneratingTutorial}
                    className="bg-stone-950 hover:bg-amber-400 hover:text-slate-950 text-stone-300 border border-stone-800 hover:border-amber-400 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer text-left disabled:opacity-50"
                  >
                    + {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input Box & Submit Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateCustomTutorial();
              }}
              className="flex flex-col sm:flex-row gap-3 mt-4"
            >
              <input
                type="text"
                placeholder="e.g. How to inspect and clean step tiles after heavy Harmattan dust..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                disabled={isGeneratingTutorial}
                className="flex-1 px-4 py-3 bg-stone-950 border-2 border-stone-700 focus:border-amber-400 rounded-xl text-xs sm:text-sm font-sans text-white placeholder-stone-500 focus:outline-none shadow-inner"
              />
              <button
                type="submit"
                disabled={isGeneratingTutorial || !customPrompt.trim()}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-sans font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isGeneratingTutorial ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Generating with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-slate-950" />
                    <span>Generate Video Tutorial</span>
                  </>
                )}
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
}
