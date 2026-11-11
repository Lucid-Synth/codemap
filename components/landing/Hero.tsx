import React from "react";
import { SourceTabs } from "./SourceTabs";

export function Hero() {
  return (
    <section className="relative flex flex-1 flex-col justify-center overflow-hidden">
      <div
        className="grid-field pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-14 text-center sm:px-8 sm:pb-24 sm:pt-20">

        <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">
          Your codebase&rsquo;s dependency graph, in about 30 seconds
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted">
          Paste a GitHub URL or drop a ZIP archive. CodeMap resolves every
          import between your files, flags circular dependencies, and traces
          exactly what breaks when you change something.
        </p>

        <div id="try" className="mt-10 scroll-mt-24">
          <SourceTabs />
        </div>
      </div>
    </section>
  );
}
