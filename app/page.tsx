import Hero from "@/components/sections/Hero";
import SobreNos from "@/components/sections/SobreNos";
import Servicos from "@/components/sections/Servicos";
import Clube from "@/components/sections/Clube";
import Galeria from "@/components/sections/Galeria";
import Unidades from "@/components/sections/Unidades";
import Depoimentos from "@/components/sections/Depoimentos";

export default function Home() {
  return (
    <>
      <Hero />
      <SobreNos />
      <Servicos />
      <Clube />
      <Galeria />
      <Unidades />
      <Depoimentos />
    </>
  );
}
