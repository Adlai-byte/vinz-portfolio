"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const customerTypes = [
  "Student",
  "Researcher",
  "Startup",
  "Small Business",
  "Enterprise",
  "Other",
];

const projectTypes = ["Web App", "Mobile App", "Web + Mobile", "Other"];

const aiSuggestions = [
  "AI Chatbot",
  "AI Agent System",
  "AI-Powered App",
  "ML Pipeline",
  "RAG System",
  "Custom GPT / Fine-tuning",
  "None",
  "Other",
];

const timeframes = [
  "ASAP",
  "1-2 Weeks",
  "1 Month",
  "2-3 Months",
  "Flexible",
];

const inputClass =
  "w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-dimmed focus:outline-none focus:ring-2 focus:ring-text-dimmed/50 font-mono text-sm";

const labelClass = "block text-sm text-text-muted mb-1 font-mono";

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [projectType, setProjectType] = useState("");
  const [aiSelections, setAiSelections] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [timeframe, setTimeframe] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  function handleAiToggle(value: string) {
    setAiSelections((prev) => {
      if (value === "None") {
        return prev.includes("None") ? [] : ["None"];
      }
      const without = prev.filter((s) => s !== "None");
      if (prev.includes(value)) {
        return without.filter((s) => s !== value);
      }
      return [...without, value];
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = `Quote Request — ${projectType || "General"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Customer Type: ${customerType}`,
      `Project Type: ${projectType}`,
      `AI Suggestions: ${aiSelections.length > 0 ? aiSelections.join(", ") : "None"}`,
      ``,
      `Project Description:`,
      description,
      ``,
      `Expected Budget: ${budget || "Not specified"}`,
      `Timeframe: ${timeframe || "Not specified"}`,
    ].join("\n");

    const mailto = `mailto:vinzlloydalferez@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b border-border bg-background rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs font-mono text-text-dimmed">
                  vinz@dev ~ % ./quote-request.sh
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-text-dimmed hover:text-text-primary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <p className="text-xs font-mono text-text-dimmed">
                {"// fill in the fields below to request a quote"}
              </p>

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Customer Type & Project Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Customer Type</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    {customerTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AI Suggestions */}
              <div>
                <label className={labelClass}>AI Project Suggestion</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiSuggestions.map((suggestion) => (
                    <label
                      key={suggestion}
                      className="flex items-center gap-2 cursor-pointer text-sm text-text-muted hover:text-text-primary transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={aiSelections.includes(suggestion)}
                        onChange={() => handleAiToggle(suggestion)}
                        className="accent-text-primary"
                      />
                      <span className="font-mono">{suggestion}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Project Description *</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project idea, goals, and any specific requirements..."
                  rows={4}
                  className={inputClass + " resize-y"}
                />
              </div>

              {/* Budget */}
              <div>
                <label className={labelClass}>Expected Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. PHP 50,000"
                  className={inputClass}
                />
                <p className="text-xs font-mono text-text-dimmed mt-1">
                  {"// minimum: PHP 10,000 for simple apps"}
                </p>
              </div>

              {/* Timeframe */}
              <div>
                <label className={labelClass}>Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {timeframes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-text-primary text-background font-mono font-medium rounded-lg hover:bg-text-muted transition-colors duration-200 text-sm"
              >
                $ send_quote_request
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
