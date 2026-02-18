import { Converter } from "@/components/Converter";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow blobs */}
      <div
        className="pointer-events-none fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-[0.04] z-0"
        style={{
          background: "radial-gradient(circle, #3dffc0 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-[0.04] z-0"
        style={{
          background: "radial-gradient(circle, #7c6dff 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-10 pt-7 pb-0 animate-fade-down">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-extrabold text-xl tracking-tight">
              <span className="text-accent">curly</span>
            </h2>
          </div>
          <nav className="flex gap-2">
            <span className="text-xs font-mono text-muted border border-border2 bg-surface px-2 py-0.5 rounded-full">
              v1.0
            </span>
          </nav>
        </header>

        {/* Hero */}
        <section className="px-10 pt-9 pb-6 animate-fade-down [animation-delay:100ms] [animation-fill-mode:both]">
          <h1
            className="font-display font-extrabold tracking-tight leading-[1.05] text-white"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)" }}
          >
            CURL
            <br />
            <span className="text-accent">TO CODE.</span>
          </h1>
          <p className="mt-3 text-sm font-mono text-muted max-w-lg">
            instantly.
            <span className="text-white">fetch()</span> or{" "}
            <span className="text-white">axios</span> code in seconds.
          </p>
        </section>

        {/* Main Converter */}
        <Converter />

        {/* Footer */}
        <footer className="px-10 py-5 border-t border-border1 flex items-center justify-between">
          <span className="text-xs font-mono text-muted/40">
            Built for developers who have better things to do
          </span>
          <div className="flex gap-6">
            {[
              ["-X", "method"],
              ["-H", "headers"],
              ["-d", "body"],
              ["-u", "basic auth"],
              ["--data-raw", "raw body"],
            ].map(([flag, label]) => (
              <span
                key={flag}
                className="text-xs font-mono text-muted/40 hidden md:inline"
              >
                <span className="text-muted/70">{flag}</span> {label}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
