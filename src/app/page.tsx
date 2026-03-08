import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowIWork from "@/components/HowIWork";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AsciiDivider from "@/components/AsciiDivider";
import { fetchVercelProjects, staticProjects } from "@/data/projects";

export default async function Home() {
  const vercelProjects = await fetchVercelProjects();
  const projects = [...vercelProjects, ...staticProjects];

  return (
    <main>
      <Navbar />
      <PageTransition>
        <Hero />
        <AsciiDivider variant="code" />
        <About />
        <AsciiDivider variant="dots" />
        <HowIWork />
        <AsciiDivider variant="code" />
        <Projects projects={projects} />
        <AsciiDivider variant="wave" />
        <Testimonials />
        <AsciiDivider variant="code" />
        <BlogPreview />
        <AsciiDivider variant="dashed" />
        <Contact />
      </PageTransition>
      <Footer />
    </main>
  );
}
