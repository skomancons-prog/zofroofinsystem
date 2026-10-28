import React, { useState } from "react";
import { Mail, User, Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorStatus(null);

    // URL-encode form body for Netlify Forms AJAX processor
    const formBody = new URLSearchParams({
      "form-name": "contact",
      name,
      email,
      message: message || "General quick inquiry from website",
    }).toString();

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry to Netlify. Please try again.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setErrorStatus(err.message || "An unknown error occurred during form submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-inbound" className="py-20 bg-[#F3E5C8] border-t border-stone-200/60 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden text-stone-850 flex flex-col md:flex-row md:items-stretch gap-8">
          
          {/* Decorative backdrop alignment */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Send className="h-60 w-60 text-stone-900" />
          </div>

          <div className="flex-1 space-y-4 flex flex-col justify-center text-left">
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full w-max font-bold">
              Netlify Captured Channels
            </span>
            <h3 className="font-sans font-black text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
              Submit a Quick Inquiry
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              Have general questions regarding our West African branch coordinates, Selflock® delivery, or custom steel dimensions? Drop us a prompt message!
            </p>
          </div>

          <div className="flex-1 bg-stone-50 p-6 rounded-2xl border border-stone-200">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="h-12 w-12 bg-emerald-50 border border-emerald-250 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6 text-emerald-605 text-emerald-600" />
                </div>
                <h4 className="font-sans font-extrabold text-lg text-stone-900">Inquiry Received!</h4>
                <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
                  Thank you for starting this channel. Your submission has been captured directly via Netlify Forms and our coordinating team expects to follow up with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} data-netlify="true" name="contact" className="space-y-4">
                {/* Netlify explicit form identifying input */}
                <input type="hidden" name="form-name" value="contact" />

                <div className="text-left">
                  <label className="block text-[10px] font-mono uppercase text-stone-500 tracking-wider mb-1.5 font-semibold">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Samuel Osei"
                      className="w-full pl-9 pr-4 py-3 bg-white border border-stone-200 text-stone-900 placeholder-stone-400 rounded-xl font-sans text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </div>

                <div className="text-left">
                  <label className="block text-[10px] font-mono uppercase text-stone-500 tracking-wider mb-1.5 font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="samuel@gmail.com"
                      className="w-full pl-9 pr-4 py-3 bg-white border border-stone-200 text-stone-900 placeholder-stone-400 rounded-xl font-sans text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                    />
                  </div>
                </div>

                <div className="text-left">
                  <label className="block text-[10px] font-mono uppercase text-stone-500 tracking-wider mb-1.5 font-semibold">
                    Your Message / Inquiry Details (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry topic..."
                    rows={2}
                    className="w-full p-3 bg-white border border-stone-200 text-stone-900 placeholder-stone-400 rounded-xl font-sans text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none shadow-xs"
                  />
                </div>

                {errorStatus && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-left">
                    <p className="text-[10px] text-red-600 font-mono">Error: {errorStatus}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Inbound Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
