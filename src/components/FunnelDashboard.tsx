"use client";

import { useState, type ComponentType } from "react";
import Image from "next/image";
import {
  Eye,
  MousePointerClick,
  FileText,
  ShoppingCart,
  CreditCard,
  BadgeCheck,
  Target,
  ArrowDown,
  type LucideProps,
} from "lucide-react";

/* ── Types ── */

interface Benchmark {
  min: number;
  max?: number;
}

/* ── Helpers ── */

function formatRaw(value: number): string {
  return value.toLocaleString("pt-BR");
}

function formatRate(value: number): string {
  return value.toFixed(2).replace(".", ",") + "%";
}

function isAboveBenchmark(value: number, benchmark: Benchmark): boolean {
  return value >= benchmark.min;
}

function benchmarkLabel(benchmark: Benchmark): string {
  if (benchmark.max !== undefined) {
    return `${formatRate(benchmark.min)} – ${formatRate(benchmark.max)}`;
  }
  return `> ${formatRate(benchmark.min)}`;
}

type Status = 'critical' | 'attention' | 'success';

function getPerformanceStatus(value: number, benchmark: Benchmark): Status {
  if (value < benchmark.min) return 'critical';
  if (value < benchmark.min * 1.1) return 'attention';
  return 'success';
}

function getStatusColor(status: Status, type: 'text' | 'bg' | 'border'): string {
  switch (status) {
    case 'critical':
      if (type === 'bg') return 'bg-red-500';
      if (type === 'text') return 'text-red-500';
      return 'border-red-500/30';
    case 'attention':
      if (type === 'bg') return 'bg-[#FFAA17]';
      if (type === 'text') return 'text-[#FFAA17]';
      return 'border-[#FFAA17]/30';
    case 'success':
      if (type === 'bg') return 'bg-rei-green';
      if (type === 'text') return 'text-rei-green';
      return 'border-rei-green/30';
  }
}

/* ── Components ── */

const InputRow = ({
  label,
  value,
  setter,
  icon: Icon,
}: {
  label: string;
  value: number;
  setter: (v: number) => void;
  icon: ComponentType<LucideProps>;
}) => {
  return (
    <div className="flex items-center justify-between bg-[#1A275E] border border-white/5 rounded-lg px-3 py-2 h-[50px] shadow-sm hover:border-[#FFAA17]/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0F1B4E] flex items-center justify-center border border-white/10 shrink-0">
          <Icon size={14} className="text-[#FFAA17]" />
        </div>
        <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wide leading-tight">
          {label}
        </span>
      </div>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          setter(raw === "" ? 0 : Math.max(0, Number(raw)));
        }}
        className="w-20 h-7 bg-[#0F1B4E] border border-white/10 rounded px-2 text-right text-white font-mono font-bold text-sm focus:outline-none focus:border-[#FFAA17] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
};

const BenchmarkBadge = ({ label, benchmark }: { label: string; benchmark: Benchmark }) => {
  return (
    <div className="flex items-center justify-center relative h-10 my-1 group/badge">
      {/* Vertical Line with Arrow */}
      <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#3b82f6]/50 to-transparent -z-10 group-hover/badge:via-[#3b82f6] transition-colors"></div>
      <div className="absolute bottom-[-6px] text-[#3b82f6]/50 group-hover/badge:text-[#3b82f6] transition-colors -z-10">
        <ArrowDown size={12} />
      </div>

      <div className="bg-[#1e3a8a] border border-blue-500/30 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm z-10 transition-transform hover:scale-105">
        <Target size={14} className="text-blue-300" />
        <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-white">{benchmarkLabel(benchmark)}</span>
      </div>
    </div>
  );
};

/* ── Main Dashboard ── */

export default function FunnelDashboard() {
  const [impressoes, setImpressoes] = useState<number>(0);
  const [cliques, setCliques] = useState<number>(0);
  const [visualizacoes, setVisualizacoes] = useState<number>(0);
  const [adicoesCarrinho, setAdicoesCarrinho] = useState<number>(0);
  const [inicializacaoCompra, setInicializacaoCompra] = useState<number>(0);
  const [compras, setCompras] = useState<number>(0);

  // Taxas
  const ctr = impressoes > 0 ? (cliques / impressoes) * 100 : 0;
  const connectRate = cliques > 0 ? (visualizacoes / cliques) * 100 : 0;
  const viewToCartRate = visualizacoes > 0 ? (adicoesCarrinho / visualizacoes) * 100 : 0;
  const cartToCheckoutRate = adicoesCarrinho > 0 ? (inicializacaoCompra / adicoesCarrinho) * 100 : 0;
  const checkoutToPurchaseRate = inicializacaoCompra > 0 ? (compras / inicializacaoCompra) * 100 : 0;

  // Global Metric
  const metaConversionRate = visualizacoes > 0 ? (compras / visualizacoes) * 100 : 0;

  // Configuration for Steps
  // Note: 'rate' property here belongs to the transition FROM the previous step TO this step.
  const funnelSteps = [
    { label: "Impressões", value: impressoes, setter: setImpressoes, icon: Eye, width: "100%", color: "bg-[#FFAA17]" },
    { label: "Cliques", value: cliques, setter: setCliques, icon: MousePointerClick, width: "90%", rate: ctr, benchmark: { min: 1 }, rateLabel: "CTR" },
    { label: "Visualizações", value: visualizacoes, setter: setVisualizacoes, icon: FileText, width: "80%", rate: connectRate, benchmark: { min: 70 }, rateLabel: "Connect Rate" },
    { label: "Add. Carrinho", value: adicoesCarrinho, setter: setAdicoesCarrinho, icon: ShoppingCart, width: "70%", rate: viewToCartRate, benchmark: { min: 15, max: 20 }, rateLabel: "Add Carrinho" },
    { label: "Checkout", value: inicializacaoCompra, setter: setInicializacaoCompra, icon: CreditCard, width: "60%", rate: cartToCheckoutRate, benchmark: { min: 20, max: 30 }, rateLabel: "Checkout" },
    { label: "Compras", value: compras, setter: setCompras, icon: BadgeCheck, width: "50%", rate: checkoutToPurchaseRate, benchmark: { min: 35, max: 50 }, rateLabel: "Taxa Compra" },
  ];

  const kpis = [
    { label: "Taxa de Cliques (CTR)", value: ctr, benchmark: { min: 1 } },
    { label: "Connect Rate", value: connectRate, benchmark: { min: 70 } },
    { label: "Taxa de Conversão", value: metaConversionRate, benchmark: { min: 1.5 } },
  ];

  return (
    <div className="h-screen w-full bg-[#0F1B4E] text-white selection:bg-[#FFAA17]/30 selection:text-[#FFAA17] flex flex-col font-sans overflow-hidden">

      {/* ── Fixed Header ── */}
      <header className="h-14 px-6 relative flex items-center justify-center border-b border-white/5 bg-[#0F1B4E] z-50 shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo-agencia-rei.png" alt="Agência Rei" className="h-6 w-auto opacity-90 object-contain" />
          <div className="w-px h-4 bg-white/10" />
          <h1 className="text-sm font-extrabold text-[#FFAA17] tracking-tight uppercase">Funil de Jornada do Cliente</h1>
        </div>
        <div className="absolute right-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ao Vivo</span>
        </div>
      </header>

      {/* ── Main Content (No Scroll) ── */}
      {/* ── Main Content (No Scroll) ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-x-2 gap-y-4 h-full min-h-0">

        {/* ── COL 1: Inputs & Benchmarks (Span 3) ── */}
        {/* ── COL 1: Inputs & Benchmarks (Span 3) ── */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full py-8">
          {funnelSteps.map((step, i) => {
            // Determine if we need to show a benchmark BETWEEN this step and the Previous one.
            // Actually, the request says "Between inputs". 
            // Let's render the Input, and if there is a next step with a rate, render the Benchmark below it.
            const nextStep = funnelSteps[i + 1];

            return (
              <div key={`input-group-${i}`} className="flex flex-col gap-2">
                <InputRow
                  label={step.label}
                  value={step.value}
                  setter={step.setter}
                  icon={step.icon}
                />

                {/* Render Benchmark for the NEXT step here, to bridge the gap */}
                {nextStep && nextStep.benchmark && (
                  <BenchmarkBadge
                    label={nextStep.rateLabel || "Meta"}
                    benchmark={nextStep.benchmark}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── COL 2: Visual Funnel (Span 6) ── */}
        {/* ── COL 2: Visual Funnel (Span 6) ── */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full py-8 px-4">
          {funnelSteps.map((step, i) => {
            // Color logic
            let status: Status = 'success'; // Default to success/yellow if no rate
            if (step.rate !== undefined && step.benchmark) {
              status = getPerformanceStatus(step.rate, step.benchmark);
            }
            const barColor = i === 0 ? "bg-[#FFAA17]" : getStatusColor(status, 'bg');

            // Previously we had connectors separate. To align perfectly with inputs (which are flex-between),
            // we should probably keep the connector logic inside the loop but handled carefully.
            // Actually, the Input Column has (Input + Badge). The element height is (50px + 24px + gap).
            // We should try to mirror that structure.

            const prevStep = i > 0 ? funnelSteps[i] : null;

            return (
              <div key={`funnel-step-${i}`} className="w-full flex flex-col items-center">
                {/* Bar */}
                <div
                  style={{ width: step.width }}
                  className={`h-[48px] ${barColor} rounded-lg shadow-lg flex flex-col items-center justify-center relative transition-all duration-500 ease-out border border-white/10`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className={`text-lg font-black leading-none ${barColor === "bg-[#FFAA17]" ? "text-[#0F1B4E]" : "text-white"}`}>
                      {formatRaw(step.value)}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${barColor === "bg-[#FFAA17]" ? "text-[#0F1B4E]/80" : "text-white/80"}`}>
                      {step.label}
                    </span>
                  </div>
                </div>

                {/* Connector (Below the bar, connecting to next) - Only if not last */}
                {i < funnelSteps.length - 1 && (
                  <div className="relative flex items-center justify-center my-3 h-8 z-0 group/connector">
                    {/* Vertical Connecting Line & Arrow */}
                    <div className="absolute top-[-10px] bottom-[-10px] w-0.5 bg-white/10 -z-10 group-hover/connector:bg-white/20 transition-colors"></div>
                    <div className="absolute bottom-[-14px] text-white/10 group-hover/connector:text-white/30 transition-colors z-0">
                      <ArrowDown size={14} />
                    </div>

                    {/* Only show rate if next step has one (which it strictly does in our data model) */}
                    {funnelSteps[i + 1].rate !== undefined && (
                      <span className={`text-xl font-extrabold px-1.5 py-0 rounded shadow-sm z-10 bg-[#0F1B4E] border transition-transform group-hover/connector:scale-110 ${getStatusColor(
                        getPerformanceStatus(funnelSteps[i + 1].rate!, funnelSteps[i + 1].benchmark!),
                        'text'
                      )
                        } ${getStatusColor(
                          getPerformanceStatus(funnelSteps[i + 1].rate!, funnelSteps[i + 1].benchmark!),
                          'border'
                        )
                        }`}>
                        {formatRate(funnelSteps[i + 1].rate!)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── COL 3: KPI Highlights (Span 3) ── */}
        <div className="lg:col-span-3 flex flex-col h-full gap-4 py-2">
          {kpis.map((kpi) => {
            const status = getPerformanceStatus(kpi.value, kpi.benchmark);
            return (
              <div key={kpi.label} className={`flex-1 bg-[#1A275E] border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-lg transition-all group relative overflow-hidden ${getStatusColor(status, 'border')}`}>
                <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${status === 'success' ? 'from-rei-green/5' : status === 'attention' ? 'from-[#FFAA17]/5' : 'from-red-500/5'}`} />

                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">
                  {kpi.label}
                </h3>

                <div className={`text-4xl lg:text-5xl font-black tracking-tight mb-2 relative z-10 ${getStatusColor(status, 'text')}`}>
                  {formatRate(kpi.value)}
                </div>

                <div className="bg-[#0F1B4E] rounded-full px-3 py-1 flex items-center gap-2 border border-white/5 relative z-10">
                  <Target size={10} className="text-slate-500" />
                  <span className="text-[10px] text-slate-400 font-bold">Meta:</span>
                  <span className="text-[11px] font-bold text-white">{benchmarkLabel(kpi.benchmark)}</span>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
