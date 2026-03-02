import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { fetchVercelProjects } from "@/data/projects";

export default async function Home() {
  const projects = await fetchVercelProjects();

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Projects projects={projects} />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
