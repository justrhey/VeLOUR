import Experience from "@/components/Experience";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Collection from "@/components/sections/Collection";
import Tasting from "@/components/sections/Tasting";
import Story from "@/components/sections/Story";
import Proof from "@/components/sections/Proof";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <Experience>
      <Nav />
      <main className="relative">
        <Hero />
        <Collection />
        <Tasting />
        <Story />
        <Proof />
        <CTA />
      </main>
      <Footer />
    </Experience>
  );
}
