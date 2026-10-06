"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSuccessMsg(data.message || "Thank you. Your message has been sent successfully.");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 sm:pt-40 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="max-w-3xl mb-12 sm:mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 block">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Contact Gagan Electronics Lab.
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
          Have an inquiry regarding machine capabilities, batch pricing, or custom hardware assembly? Send us a note or contact us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-card-xl p-8 sm:p-10 shadow-soft">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            Send an Inquiry
          </h2>

          {successMsg ? (
            <div className="p-6 rounded-card-md bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm">Message Sent</h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{successMsg}</p>
              <button
                type="button"
                onClick={() => setSuccessMsg("")}
                className="mt-2 text-xs font-semibold underline text-emerald-800"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              {errorMsg && (
                <div className="p-3.5 rounded-card-sm bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gurpreet Singh"
                    className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. gurpreet@example.com"
                    className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Enclosure batch quotation"
                    className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry, machine questions, or timeline requirements..."
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3.5 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <span>Send message</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF8F3] border border-stone-200 rounded-card-xl p-8 space-y-6">
            <h2 className="text-lg font-bold text-stone-900">
              Direct Contact Details
            </h2>

            <ul className="space-y-4 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block font-semibold">Email Quotes & Engineering</strong>
                  <span className="text-stone-600 font-mono select-all">quotes@gaganelectronicslab.com</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block font-semibold">Phone & WhatsApp</strong>
                  <span className="text-stone-600">+91 98765 43210</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block font-semibold">Workshop Studio</strong>
                  <span className="text-stone-600 leading-relaxed block">
                    Electronics & Additive Manufacturing Lab, Punjab / Delhi NCR Region, India
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block font-semibold">Working Hours</strong>
                  <span className="text-stone-600">Monday to Saturday: 9:00 AM – 7:00 PM IST</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-sage-50/70 border border-sage-200 rounded-card-md p-6 text-xs text-stone-600 space-y-1.5">
            <h3 className="font-bold text-stone-900">
              Need a quotation for 3D printing right away?
            </h3>
            <p>
              Use our dedicated quotation flow to upload your STL files or share a Google Drive link directly.
            </p>
            <a
              href="/request-quote"
              className="inline-block pt-2 font-semibold text-stone-900 underline"
            >
              Go to Quote Request Flow →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
