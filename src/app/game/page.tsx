import Navbar from "@/components/Navbar";
import CodeBreaker from "@/components/CodeBreaker";

export const metadata = {
  title: "Code Breaker | Vinz",
  description: "Crack the code — a terminal-styled Mastermind game.",
};

export default function GamePage() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <CodeBreaker />
      </section>
    </main>
  );
}
