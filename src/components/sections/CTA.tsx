"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("done");
  };

  return (
    <section
      id="cta"
      className="relative isolate bg-[var(--color-panel)] px-5 pb-32 pt-40 sm:px-8"
    >

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="panel panel-gold relative px-6 py-16 sm:px-16">
          <div className="reveal mb-6 flex items-center justify-between">
            <p className="kicker">The Reserve List</p>
            <span className="section-index">03 — Join</span>
          </div>

          <h2 className="reveal display-xl max-w-2xl text-[clamp(2.4rem,6vw,5rem)]">
            Be first to the next
            <span className="italic font-normal text-gilded"> release.</span>
          </h2>
          <p className="reveal mt-5 max-w-md font-serif text-lg leading-relaxed text-cream-dim">
            Allocations are small. Members are notified the night before each
            vintage is poured.
          </p>

          {status === "done" ? (
            <p
              role="status"
              className="reveal mt-10 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.16em] text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              You&apos;re on the list — check your inbox.
            </p>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              className="reveal mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  aria-invalid={status === "error"}
                  aria-describedby={status === "error" ? "email-err" : undefined}
                  className="w-full border border-[var(--color-hairline)] bg-[var(--color-noir)] px-5 py-4 font-serif text-cream outline-none transition-colors placeholder:text-cream-mute focus:border-[var(--color-gold)]"
                />
                {status === "error" && (
                  <p
                    id="email-err"
                    role="alert"
                    className="mt-2 font-mono text-xs text-[#ff8a8a]"
                  >
                    Please enter a valid email address.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-gold justify-center py-3.5 disabled:opacity-60"
              >
                {status === "loading" ? "Reserving…" : "Join the list"}
                {status !== "loading" && (
                  <span className="arr" aria-hidden>
                    &rarr;
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
