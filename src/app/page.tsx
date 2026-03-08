import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import GitHubActivity from "@/components/GitHubActivity";
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
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-mono text-text-dimmed mb-6 text-center">
              // recent activity
            </h2>
            <GitHubActivity />
          </div>
        </section>
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
