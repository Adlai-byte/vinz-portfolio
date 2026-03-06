import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { fetchVercelProjects, staticProjects } from "@/data/projects";

export default async function Home() {
  const vercelProjects = await fetchVercelProjects();
  const projects = [...vercelProjects, ...staticProjects];

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Projects projects={projects} />
      <Contact />
      <Footer />
    </main>
  );
}
