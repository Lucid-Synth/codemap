import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
    </div>
  );
}
