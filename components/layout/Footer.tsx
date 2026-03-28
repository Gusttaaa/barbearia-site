import Link from "next/link";
import Image from "next/image";
import { Share2, MessageCircle, MapPin, Clock } from "lucide-react";
import { unidades } from "@/lib/data/unidades";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/logo.png"
                  alt="Barbearia de Primeira"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display text-base tracking-wider text-[#f5f0eb] leading-none">
                  BARBEARIA
                </p>
                <p className="font-display text-base tracking-wider text-[#3aab4a] leading-none">
                  DE PRIMEIRA
                </p>
              </div>
            </Link>
            <p className="text-[#a8a8a8] text-sm leading-relaxed mt-4 mb-6">
              De primeira qualidade. Sempre. Três unidades para atender você no
              Rio de Janeiro.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/barbearia.de.primeira"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-sm bg-white/5 text-[#a8a8a8] hover:bg-[#3aab4a] hover:text-[#111111] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
                aria-label="Instagram"
              >
                <Share2 size={16} />
              </a>
              <a
                href={`https://wa.me/${unidades[0].whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-sm bg-white/5 text-[#a8a8a8] hover:bg-[#3aab4a] hover:text-[#111111] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display tracking-widest text-[#f5f0eb] mb-4 text-sm">
              NAVEGAÇÃO
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/servicos", label: "Serviços" },
                { href: "/clube", label: "Clube de Assinaturas" },
                { href: "/loja", label: "Loja" },
                { href: "/agendar", label: "Agendar" },
                { href: "/#unidades", label: "Nossas Unidades" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#a8a8a8] hover:text-[#3aab4a] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Unidades */}
          <div className="lg:col-span-2">
            <h3 className="font-display tracking-widest text-[#f5f0eb] mb-4 text-sm">
              NOSSAS UNIDADES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {unidades.map((u) => (
                <div key={u.id}>
                  <p className="font-display tracking-wider text-[#3aab4a] text-sm mb-1">
                    {u.nome.toUpperCase()}
                  </p>
                  <div className="flex items-start gap-1.5 mb-1">
                    <MapPin
                      size={12}
                      className="text-[#a8a8a8] mt-0.5 shrink-0"
                    />
                    <p className="text-[#a8a8a8] text-xs leading-relaxed">
                      {u.bairro}
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5 mb-2">
                    <Clock
                      size={12}
                      className="text-[#a8a8a8] mt-0.5 shrink-0"
                    />
                    <p className="text-[#a8a8a8] text-xs leading-relaxed">
                      {u.horarios.semana}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${u.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#3aab4a] hover:text-[#4ec55e] transition-colors duration-200"
                  >
                    <MessageCircle size={11} />
                    WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#a8a8a8] text-xs">
            © {new Date().getFullYear()} Barbearia de Primeira. Todos os
            direitos reservados.
          </p>
          <p className="text-[#a8a8a8] text-xs">
            Recreio · Barra · Guanabara — Rio de Janeiro, RJ
          </p>
        </div>
      </div>
    </footer>
  );
}
