"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PhoneInput } from "@/components/ui/phoneInput";

type Mode = "magic" | "google" | "email";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("magic");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const reset = (m: Mode) => {
    setMode(m);
    setError("");
    setSent(false);
  };

  const handleMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/cliente` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/cliente` },
    });
  };

  const handleEmailPassword = async () => {
    if (!email || !password || (isSignUp && !name) || (isSignUp && !phone)) return;

    setLoading(true);
    setError("");
    const result = isSignUp
      ? await supabase.auth.signUp({ email, password, options: { data: { display_name: name, phone } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (result.error) {
      console.log(result.error.code);
      switch (result.error.code) {
        case "email_exists":
          setError("E-mail já cadastrado");
          break;
        case "weak_password":
          setError("Senha deve conter pelo menos 6 caracteres");
          break;
        case "validation_failed":
          setError("E-mail inválido");
          break;
        case "user_already_exists":
          setError("Usuário já cadastrado");
          break;
        default:
          setError(result.error.message);
      }
    } else if (isSignUp) {
      setError("Conta criada! Verifique seu e-mail para confirmar.");
    } else {
      router.push("/cliente");
    }
  };

  const options = [
    { id: "magic" as Mode, label: "Magic Link", short: "Magic", Icon: Zap },
    { id: "google" as Mode, label: "Google", short: "Google", Icon: GoogleIcon },
    { id: "email" as Mode, label: "E-mail + Senha", short: "Senha", Icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-1 ring-white/10 mx-auto mb-4">
            <Image src="/logo.png" alt="Logo" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-3xl text-[#f5f0eb] tracking-wider">ÁREA DO CLIENTE</h1>
          <p className="text-[#a8a8a8] text-sm mt-2">Acesse seus agendamentos e muito mais</p>
        </div>

        {/* Method selector */}
        <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 mb-6">
          {options.map(({ id, label, short, Icon }) => (
            <button
              key={id}
              onClick={() => reset(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-all duration-200 ${
                mode === id ? "bg-[#3aab4a] text-[#111111]" : "text-[#a8a8a8] hover:text-[#f5f0eb]"
              }`}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{short}</span>
            </button>
          ))}
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Magic Link */}
            {mode === "magic" && (
              <div>
                {sent ? (
                  <div className="text-center py-10 px-6 bg-[#272727] rounded-sm ring-1 ring-white/5">
                    <div className="w-14 h-14 rounded-full bg-[#3aab4a]/10 ring-1 ring-[#3aab4a]/30 flex items-center justify-center mx-auto mb-4">
                      <Mail size={24} className="text-[#3aab4a]" />
                    </div>
                    <h3 className="font-display text-xl text-[#f5f0eb] mb-2">Verifique seu e-mail</h3>
                    <p className="text-[#a8a8a8] text-sm">
                      Enviamos um link para{" "}
                      <span className="text-[#f5f0eb]">{email}</span>.
                      <br />Clique nele para entrar automaticamente.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 text-xs text-[#a8a8a8] hover:text-[#3aab4a] transition-colors"
                    >
                      Usar outro e-mail
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[#a8a8a8] text-sm">
                      Receba um link mágico no seu e-mail — entra com um clique, sem precisar criar senha.
                    </p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
                      placeholder="seu@email.com"
                      className="w-full bg-[#272727] ring-1 ring-white/10 rounded-sm px-4 py-3 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all"
                    />
                    <button
                      onClick={handleMagicLink}
                      disabled={loading || !email}
                      className="w-full py-3 bg-[#3aab4a] text-[#111111] font-semibold text-sm tracking-widest uppercase rounded-sm hover:bg-[#4ec55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Enviando..." : "Enviar link"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Google */}
            {mode === "google" && (
              <div className="space-y-4">
                <p className="text-[#a8a8a8] text-sm">
                  Entre com sua conta Google de forma rápida e segura.
                </p>
                <button
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#272727] ring-1 ring-white/10 text-[#f5f0eb] font-medium text-sm rounded-sm hover:ring-white/30 hover:bg-[#2e2e2e] transition-all"
                >
                  <GoogleIcon size={18} />
                  Entrar com Google
                </button>
              </div>
            )}

            {/* Email + Senha */}
            {mode === "email" && (
              <div className="space-y-4">
                {isSignUp && (
                  <>
                    <input type="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="w-full bg-[#272727] ring-1 ring-white/10 rounded-sm px-4 py-3 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all" />

                    <PhoneInput
                      placeholder="Telefone"
                      value={phone}
                      onChange={(val) => setPhone(val)}
                    />
                  </>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="w-full bg-[#272727] ring-1 ring-white/10 rounded-sm px-4 py-3 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailPassword()}
                  placeholder="Senha"
                  className="w-full bg-[#272727] ring-1 ring-white/10 rounded-sm px-4 py-3 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all"
                />
                <button
                  onClick={handleEmailPassword}
                  disabled={loading || !email || !password}
                  className="w-full py-3 bg-[#3aab4a] text-[#111111] font-semibold text-sm tracking-widest uppercase rounded-sm hover:bg-[#4ec55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Aguarde..." : isSignUp ? "Criar conta" : "Entrar"}
                </button>
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                  className="w-full text-xs text-[#a8a8a8] hover:text-[#f5f0eb] transition-colors py-1"
                >
                  {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar agora"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className={`mt-4 text-sm text-center ${error.includes("Conta criada") ? "text-[#3aab4a]" : "text-red-400"}`}>
            {error}
          </p>
        )}
      </motion.div>
    </div>
  );
}

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
