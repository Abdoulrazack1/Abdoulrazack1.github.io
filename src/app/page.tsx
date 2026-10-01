import Hero from "@/components/home/Hero";
import Work from "@/components/home/Work";
import Services from "@/components/home/Services";
import Marquee from "@/components/home/Marquee";
import About from "@/components/home/About";
import Lab from "@/components/home/Lab";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Work />
      <Services />
      <Marquee />
      <About />
      <Lab />
    </main>
  );
}
