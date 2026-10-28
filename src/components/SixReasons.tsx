/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Award, Zap, Ruler, Clock, HeartHandshake } from "lucide-react";

export function SixReasons() {
  const reasons = [
    {
      num: "01",
      icon: Clock,
      title: "100% Stress-Free Remote Coordination",
      desc: "For clients living abroad (UK, USA, Europe, Canada) building projects in Ghana, we offer a specialized remote transaction system. You receive regular photographic updates, drone site videos, and explicit supervision milestones with total transparency.",
    },
    {
      num: "02",
      icon: Award,
      title: "Diligent Timber Woodwork & Carpentry",
      desc: "A premium metal roof is only as good as its frame. Our dedicated timber carpenters construct fully cured, anti-insect treated wood structures that prevent sagging or alignment shifts for decades.",
    },
    {
      num: "03",
      icon: Ruler,
      title: "Precision Steel Truss Systems",
      desc: "We engineer and assemble heavy-duty, corrosion-coated structural steel truss platforms. Steel trusses eliminate termite degradation Risks and offer supreme architectural load endurance over standard timber.",
    },
    {
      num: "04",
      icon: Zap,
      title: "Comprehensive Sheeting Portfolio",
      desc: "Select from advanced concealed Selflock® profiles, classic inverted box rib IBR sheets, Mediterranean Step Tiles, or raw marine-grade plain Aluminium sheets configured to match your exact home geometry.",
    },
    {
      num: "05",
      icon: ShieldCheck,
      title: "Coastal Environmental Protection",
      desc: "Accra and coastal regions have heavy saline humidity that causes metal rot. We specialize in raw plain aluminum and advanced aluzinc finishes that resist salt-spray corrosion, saving you from expensive re-roofing.",
    },
    {
      num: "06",
      icon: HeartHandshake,
      title: "Consultancy & Guided Selection",
      desc: "Our expert consulting team analyzes your building slope, location, and budget to recommend the optimal profile gauge and alloy type. Zero guesswork, zero hidden bills, and 100% satisfaction guaranteed.",
    },
  ];

  return (
    <section id="reasons" className="py-22 bg-[#F3E5C8] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs text-blue-700 mb-4 select-none font-semibold">
            <HeartHandshake className="h-4 w-4 text-blue-600" />
            <span className="font-mono uppercase tracking-wider text-blue-700">The ZOF standard</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight leading-none mb-4">
            Six Reasons People Choose ZOF
          </h2>
          <p className="text-stone-605 text-stone-600 text-sm sm:text-base leading-relaxed">
            Zof Group has built its reputation on pristine metal profiling, structural carpentries, and absolute remote client trust. Here is why local and international clients count on us.
          </p>
        </div>

        {/* Benefits Grid representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r) => {
            const IconComponent = r.icon;
            return (
              <div
                key={r.num}
                className="group bg-white hover:bg-stone-50/50 border border-stone-200 hover:border-blue-500/50 p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-xl relative overflow-hidden text-left"
              >
                {/* Floating Huge Number Backdrop */}
                <div className="absolute top-0 right-0 p-4 font-mono font-black text-6xl text-stone-200/40 group-hover:text-blue-100/40 select-none transition-all">
                  {r.num}
                </div>

                <div className="h-12 w-12 bg-stone-50 group-hover:bg-blue-600 border border-stone-200 group-hover:border-blue-600 rounded-xl flex items-center justify-center mb-6 transition-all">
                  <IconComponent className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>

                <h3 className="font-sans font-extrabold text-lg text-stone-900 group-hover:text-blue-700 transition-colors tracking-tight mb-3">
                  {r.title}
                </h3>
                
                <p className="text-sm text-stone-600 transition-colors leading-relaxed">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Local Verification Badge banner */}
        <div className="mt-16 bg-blue-50 p-6 rounded-2xl border border-blue-200 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div>
            <p className="font-sans font-bold text-sm text-stone-900">Do you live abroad or want a convenient remote inspection?</p>
            <p className="text-xs text-stone-600 mt-1">Our remote coordination specialists handle your timber or truss projects from start to finish.</p>
          </div>
          <a
            href="tel:0242866658"
            className="px-5 py-3 hover:bg-blue-700 bg-blue-600 text-white rounded-xl text-sm font-bold transition-all shrink-0 shadow-md"
          >
            ☎ Click to Dial ZOF Support
          </a>
        </div>

      </div>
    </section>
  );
}
