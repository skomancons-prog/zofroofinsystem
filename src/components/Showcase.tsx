/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { SHOWCASE_PROJECTS } from "../data";
import { Hammer, MapPin, Ruler, CheckSquare, Play, X, Video, ExternalLink, Tv, SkipForward, SkipBack, ListVideo } from "lucide-react";
import { ShowcaseProject } from "../types";

export function Showcase() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [activeVideoProject, setActiveVideoProject] = useState<ShowcaseProject | null>(null);
  const [isContinuousPlay, setIsContinuousPlay] = useState<boolean>(true);

  const filterTabs = [
    "All",
    "Selflock & PVC",
    "Metal & Aluminium",
    "Step Tiles & Shingles",
    "Gutters & Polycarbonate"
  ];

  const filteredProjects = activeTab === "All"
    ? SHOWCASE_PROJECTS
    : SHOWCASE_PROJECTS.filter(p => p.category === activeTab);

  return (
    <section id="showcase" className="py-22 bg-[#F3E5C8] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-xs text-blue-750 mb-4 select-none font-semibold">
              <Hammer className="h-4 w-4 text-blue-600" />
              <span className="font-mono uppercase tracking-wider text-blue-700">Our Built Legacy</span>
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight leading-none mb-3">
              Success Project Showcase & Video Tours
            </h2>
            <p className="text-stone-605 text-stone-600 text-sm sm:text-base leading-relaxed">
              Explore our built structures across Accra, East Legon, Tema, and Kumasi. Click on any project below to watch dynamic **drone camera flyovers** and on-site walkthrough inspection videos showcasing our gold standards.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveVideoProject(SHOWCASE_PROJECTS[0]);
                  setIsContinuousPlay(true);
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-sans text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer select-none"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Continuous Play All Tours</span>
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 max-w-full overflow-x-auto pb-2 scrollbar-none shrink-0">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-sans font-bold rounded-lg border transition-all cursor-pointer select-none shrink-0 ${
                  activeTab === tab
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:border-blue-500/50 hover:shadow-xl"
            >
              <div>
                
                {/* Photo/Video Display Action Box */}
                <div 
                  onClick={() => p.videoUrl && setActiveVideoProject(p)}
                  className="relative h-48 sm:h-52 bg-stone-100 overflow-hidden select-none border-b border-stone-150 cursor-pointer group/img"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110 opacity-90"
                  />
                  
                  {/* Drone Video Tag */}
                  {p.videoUrl && (
                    <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-xs text-white font-mono text-[9px] font-black px-2 py-1 rounded flex items-center space-x-1 shadow-md">
                      <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping"></span>
                      <span>DRONE WALKTHROUGH</span>
                    </div>
                  )}

                  <span className="absolute top-4 left-4 text-[10px] bg-blue-50/95 backdrop-blur-xs border border-blue-150 text-blue-700 font-mono font-bold px-2.5 py-1 rounded shadow-md">
                    {p.category}
                  </span>

                  {/* Play Action Hover overlay */}
                  {p.videoUrl && (
                    <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-blue-600 hover:bg-blue-500 active:scale-90 text-white p-3.5 rounded-full shadow-2xl transition-all transform scale-75 group-hover/img:scale-100 flex items-center justify-center border border-blue-400">
                        <Play className="h-5 w-5 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Information contents */}
                <div className="p-6 text-left">
                  <div className="flex items-center space-x-2 text-stone-500 text-xs mb-2">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    <span className="font-mono">{p.location}</span>
                  </div>

                  <h3 className="font-sans font-extrabold text-lg text-stone-900 group-hover:text-blue-600 transition-colors tracking-tight mb-2">
                    {p.title}
                  </h3>

                  <p className="text-sm text-stone-605 text-stone-600 leading-relaxed mb-4">
                    {p.description}
                  </p>

                  {p.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setActiveVideoProject(p)}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-750 hover:text-blue-900 transition-colors cursor-pointer"
                    >
                      <Video className="h-4 w-4 text-emerald-605 text-emerald-600" />
                      <span>Watch Inspection Video Walkthrough &rarr;</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Stat footer banner */}
              <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-left text-xs text-stone-600 font-mono">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Ruler className="h-3.5 w-3.5 text-blue-600" />
                  <span>Size: {p.roofArea}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-stone-500 font-bold">
                  <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                  <span>{p.duration}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Cinema-Style Video Drone Player Modal */}
        {activeVideoProject && (() => {
          const currentIndex = SHOWCASE_PROJECTS.findIndex(p => p.id === activeVideoProject.id);
          
          const playNext = () => {
            const nextIndex = (currentIndex + 1) % SHOWCASE_PROJECTS.length;
            setActiveVideoProject(SHOWCASE_PROJECTS[nextIndex]);
          };

          const playPrev = () => {
            const prevIndex = (currentIndex - 1 + SHOWCASE_PROJECTS.length) % SHOWCASE_PROJECTS.length;
            setActiveVideoProject(SHOWCASE_PROJECTS[prevIndex]);
          };

          return (
            <div 
              className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all animate-fade-in overflow-y-auto"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-[#F3E5C8] border border-stone-300 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col justify-between text-left my-8">
                
                {/* Modal Top Header */}
                <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-white/75">
                  <div className="flex items-center space-x-3 text-stone-900">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200">
                      <Tv className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-mono font-black text-emerald-600 uppercase tracking-widest block leading-none">
                          ZOF Drone Site Security Feed
                        </span>
                        {isContinuousPlay && (
                          <span className="text-[9px] font-mono font-black text-blue-600 bg-blue-50 border border-blue-150 px-1.5 py-0.5 rounded uppercase animate-pulse">
                            Continuous Play Active
                          </span>
                        )}
                      </div>
                      <h4 className="font-sans font-black text-base sm:text-lg text-stone-900 leading-tight mt-1">
                        {activeVideoProject.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    {/* Continuous Play Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsContinuousPlay(!isContinuousPlay)}
                      className={`hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                        isContinuousPlay
                          ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                          : "bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-700"
                      }`}
                      title="Auto-play next project when current ends"
                    >
                      <span className={`h-2 w-2 rounded-full ${isContinuousPlay ? "bg-white animate-ping" : "bg-stone-400"}`} />
                      <span>{isContinuousPlay ? "Autoplay ON" : "Autoplay OFF"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveVideoProject(null)}
                      className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 rounded-full transition-colors cursor-pointer border border-stone-200"
                      aria-label="Close Walkthrough Player"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Grid split for Video & Playlist */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Left Column: Video screen & Spec specifications */}
                  <div className="lg:col-span-8 flex flex-col border-r border-stone-200/50">
                    
                    {/* Video Screen Container */}
                    <div className="relative bg-black aspect-video w-full">
                      <video
                        src={activeVideoProject.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        controls
                        playsInline
                        referrerPolicy="no-referrer"
                        loop={!isContinuousPlay} // only loop if continuous play is off, otherwise onEnded advances
                        onEnded={() => {
                          if (isContinuousPlay) {
                            playNext();
                          }
                        }}
                        onError={(e) => {
                          console.error("Video failed to play, attempting to advance to next...", e);
                          setTimeout(() => {
                            if (isContinuousPlay) {
                              playNext();
                            }
                          }, 2000);
                        }}
                      />
                      
                      {/* Visual Watermark Overlay styling */}
                      <div className="absolute top-4 left-4 bg-[#F3E5C8]/90 text-[10px] font-mono text-stone-700 px-3 py-1.5 rounded-md border border-stone-250 pointer-events-none uppercase">
                        <span>GPS: {activeVideoProject.location.split(',')[0]} // LIVE FEED</span>
                      </div>

                      {/* Video Player Floating Skip Controls Overlay */}
                      <div className="absolute bottom-16 right-4 flex items-center space-x-2 bg-stone-950/70 p-1.5 rounded-lg border border-stone-800 backdrop-blur-xs opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                        <button
                          type="button"
                          onClick={playPrev}
                          className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
                          title="Previous Tour"
                        >
                          <SkipBack className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={playNext}
                          className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
                          title="Next Tour"
                        >
                          <SkipForward className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Spec details / Walkthrough information block */}
                    <div className="p-5 sm:p-6 bg-white border-t border-stone-200 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        
                        <div className="md:col-span-8 space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded">
                              {activeVideoProject.category}
                            </span>
                            <span className="text-[10px] font-mono text-stone-500 font-semibold">
                              📍 {activeVideoProject.location}
                            </span>
                          </div>
                          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">
                            {activeVideoProject.description}
                          </p>
                        </div>

                        <div className="md:col-span-4 bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2 shrink-0">
                          <p className="text-[9px] font-mono uppercase font-black text-amber-700 leading-none">
                            Project Specifications
                          </p>
                          <div className="space-y-1.5 font-mono text-[11px] text-stone-500">
                            <div className="flex justify-between border-b border-stone-200 pb-1">
                              <span>Roof Area:</span>
                              <span className="text-stone-900 font-extrabold">{activeVideoProject.roofArea}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Speed:</span>
                              <span className="text-stone-900 font-extrabold">{activeVideoProject.duration}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Diaspora direct CTA */}
                      <div className="mt-5 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[#333] text-stone-600 font-sans text-xs text-center sm:text-left">
                          Are you a diaspora investor? Get remote super-inspections like this updated daily via WhatsApp.
                        </p>
                        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto justify-center">
                          <a
                            href="https://wa.me/233546331603?text=Hello%20Zof%20Group!%20I%20saw%20your%20drone%20video%20walkthrough%20of%20the%20Airport%20Residential%20Office%20Complex%20and%20want%20to%20arrange%20remote%20supervision."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold rounded-lg transition-colors inline-flex items-center space-x-1.5 shrink-0 select-none cursor-pointer"
                          >
                            <span>Get Drone Updates</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Playlist panel with all other tours */}
                  <div className="lg:col-span-4 bg-stone-50 p-4 sm:p-5 flex flex-col h-[350px] lg:h-auto overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 mb-3">
                      <div className="flex items-center space-x-2 text-stone-800">
                        <ListVideo className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-wider font-sans">
                          Video Walkthrough Playlist
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                        {currentIndex + 1}/{SHOWCASE_PROJECTS.length}
                      </span>
                    </div>

                    {/* Autoplay toggle for mobile */}
                    <div className="sm:hidden flex items-center justify-between bg-white border border-stone-200/80 rounded-xl p-2.5 mb-3">
                      <span className="text-xs font-semibold text-stone-700">Autoplay Continuous Mode</span>
                      <button
                        type="button"
                        onClick={() => setIsContinuousPlay(!isContinuousPlay)}
                        className={`px-3 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all ${
                          isContinuousPlay
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-stone-50 border-stone-200 text-stone-500"
                        }`}
                      >
                        {isContinuousPlay ? "ON" : "OFF"}
                      </button>
                    </div>

                    {/* Scrollable Project Items */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[250px] lg:max-h-[500px]">
                      {SHOWCASE_PROJECTS.map((proj) => {
                        const isCurrent = proj.id === activeVideoProject.id;
                        return (
                          <button
                            key={proj.id}
                            type="button"
                            onClick={() => setActiveVideoProject(proj)}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-start space-x-3 cursor-pointer select-none ${
                              isCurrent
                                ? "bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20"
                                : "bg-white/60 border-stone-200/70 hover:bg-white hover:border-stone-300"
                            }`}
                          >
                            {/* Small thumbnail with duration overlay */}
                            <div className="relative h-14 w-20 rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                              <img
                                src={proj.imageUrl}
                                alt={proj.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-1 right-1 bg-stone-950/70 text-[8px] font-mono text-white px-1 py-0.2 rounded-xs leading-none">
                                {proj.duration.split(' ')[0]} {proj.duration.includes('Days') ? 'Days' : 'Ins'}
                              </div>
                              {isCurrent && (
                                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                  <div className="bg-blue-600 text-white p-1 rounded-full shadow-xs animate-pulse">
                                    <Play className="h-3 w-3 fill-white translate-x-0.2" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Text attributes */}
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-bold leading-tight line-clamp-1 ${isCurrent ? "text-blue-700" : "text-stone-800"}`}>
                                {proj.title}
                              </p>
                              <p className="text-[10px] font-mono text-stone-500 mt-1 line-clamp-1">
                                {proj.location}
                              </p>
                              <span className="text-[9px] font-bold text-stone-400 block mt-0.5 uppercase tracking-tight">
                                Area: {proj.roofArea}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                      <span>⚡ Streamlined for Netlify</span>
                      <span>Drone Feed 1080p</span>
                    </div>

                  </div>

                </div>

                {/* Modal Footer Controls */}
                <div className="px-5 py-4 border-t border-stone-200 flex justify-between items-center bg-white/50">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={playPrev}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-all inline-flex items-center space-x-1 cursor-pointer border border-stone-200 select-none"
                    >
                      <SkipBack className="h-3.5 w-3.5" />
                      <span>Prev Tour</span>
                    </button>
                    <button
                      type="button"
                      onClick={playNext}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-all inline-flex items-center space-x-1 cursor-pointer border border-stone-200 select-none"
                    >
                      <span>Next Tour</span>
                      <SkipForward className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveVideoProject(null)}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white font-sans text-xs font-bold rounded-lg transition-colors cursor-pointer select-none"
                  >
                    Close Walkthrough
                  </button>
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
}
