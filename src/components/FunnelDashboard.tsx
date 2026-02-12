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
  HelpCircle,
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

/* ── Tooltip Component ── */

const Tooltip = ({ text }: { text: string }) => {
  return (
    <div className="group relative flex items-center justify-center">
      <HelpCircle size={12} className="text-slate-500 cursor-help hover:text-[#FFAA17] transition-colors" />
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-48 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] p-2 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999] pointer-events-none min-w-max">
        {text}
        {/* Arrow */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
      </div>
    </div>
  );
};

const InputRow = ({
  label,
  value,
  setter,
  icon: Icon,
  tooltip,
}: {
  label: string;
  value: number;
  setter: (v: number) => void;
  icon: ComponentType<LucideProps>;
  tooltip?: string;
}) => {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      <div className="flex items-center justify-between bg-[#1A275E] border border-white/5 rounded-lg px-2 lg:px-3 py-1 lg:py-2 h-10 lg:h-[50px] max-h-[800px]:h-9 shadow-sm hover:border-[#FFAA17]/30 transition-colors gap-2 overflow-visible relative group/input">

        {/* Group 1: Left - Icon + Label (Flex Grow) */}
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
          <div className="hidden lg:flex w-8 h-8 rounded-lg bg-[#0F1B4E] items-center justify-center border border-white/10 shrink-0">
            <Icon size={14} className="text-[#FFAA17]" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0 relative">
            <span className="text-[10px] lg:text-[11px] font-bold text-slate-200 uppercase tracking-widest leading-tight truncate">
              {label}
            </span>
            {tooltip && <Tooltip text={tooltip} />}
          </div>
        </div>

        {/* Group 2: Right - Input (Flex Shrink) */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="number"
            min={0}
            value={value}
            onChange={(e) => {
              const raw = e.target.value;
              setter(raw === "" ? 0 : Math.max(0, Number(raw)));
            }}
            className="w-16 lg:w-20 h-6 lg:h-7 bg-[#0F1B4E] border border-white/10 rounded px-2 text-right text-white font-mono font-bold text-xs lg:text-sm focus:outline-none focus:border-[#FFAA17] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
};



const BenchmarkBadge = ({ label, benchmark }: { label: string; benchmark: Benchmark }) => {
  return null; // Deprecated
};

export default function FunnelDashboard() {
  const [impressoes, setImpressoes] = useState<number>(0);
  const [cliques, setCliques] = useState<number>(0);
  const [visualizacoes, setVisualizacoes] = useState<number>(0);
  const [adicoesCarrinho, setAdicoesCarrinho] = useState<number>(0);
  const [inicializacaoCompra, setInicializacaoCompra] = useState<number>(0);
  const [compras, setCompras] = useState<number>(0);

  const [benchmarks, setBenchmarks] = useState({
    ctr: 1,
    connectRate: 70,
    viewToCart: 15,
    cartToCheckout: 20,
    checkoutToPurchase: 35,
    metaConversion: 1.5,
  });

  const updateBenchmark = (key: keyof typeof benchmarks, value: number) => {
    setBenchmarks(prev => ({ ...prev, [key]: value }));
  };

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
    { label: "Impressões", value: impressoes, setter: setImpressoes, icon: Eye, width: "100%", color: "bg-[#FFAA17]", tooltip: "Quantidade total de vezes que seus anúncios foram exibidos." },
    { label: "Cliques", value: cliques, setter: setCliques, icon: MousePointerClick, width: "90%", rate: ctr, benchmarkKey: 'ctr', rateLabel: "CTR", tooltip: "Número de vezes que usuários clicaram no seu anúncio.", rateTooltip: "Taxa de Cliques (CTR): Porcentagem de impressões que geraram um clique." },
    { label: "Visualizações", value: visualizacoes, setter: setVisualizacoes, icon: FileText, width: "80%", rate: connectRate, benchmarkKey: 'connectRate', rateLabel: "Connect Rate", tooltip: "Número de visitas qualificadas que carregaram a página.", rateTooltip: "Connect Rate: Porcentagem de cliques que efetivamente carregaram o site." },
    { label: "Add. Carrinho", value: adicoesCarrinho, setter: setAdicoesCarrinho, icon: ShoppingCart, width: "70%", rate: viewToCartRate, benchmarkKey: 'viewToCart', rateLabel: "Add Carrinho", tooltip: "Número de usuários que adicionaram um produto ao carrinho.", rateTooltip: "Taxa de Adição: Visitantes que colocaram produtos no carrinho." },
    { label: "Checkout", value: inicializacaoCompra, setter: setInicializacaoCompra, icon: CreditCard, width: "60%", rate: cartToCheckoutRate, benchmarkKey: 'cartToCheckout', rateLabel: "Checkout", tooltip: "Número de usuários que iniciaram o processo de pagamento.", rateTooltip: "Taxa de Checkout: Usuários com carrinho que iniciaram o pagamento." },
    { label: "Compras", value: compras, setter: setCompras, icon: BadgeCheck, width: "50%", rate: checkoutToPurchaseRate, benchmarkKey: 'checkoutToPurchase', rateLabel: "Taxa Compra", tooltip: "Porcentagem de sessões que resultaram em uma venda real.", rateTooltip: "Taxa de Conversão de Checkout: Pagamentos iniciados que foram concluídos." },
  ];

  const kpis = [
    { label: "Taxa de Cliques (CTR)", value: ctr, benchmarkKey: 'ctr', tooltip: "Porcentagem de impressões que resultaram em um clique (Cliques ÷ Impressões)." },
    { label: "Connect Rate", value: connectRate, benchmarkKey: 'connectRate', tooltip: "Porcentagem de cliques que aguardaram o carregamento do site (Sessões ÷ Cliques)." },
    { label: "Taxa de Conversão", value: metaConversionRate, benchmarkKey: 'metaConversion', tooltip: "Porcentagem de sessões que resultaram em uma venda real." },
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
      </header>

      {/* ── Main Content (No Scroll) ── */}
      {/* ── Main Content (No Scroll) ── */}
      {/* ── Main Content (No Scroll) ── */}
      {/* ── Main Content (No Scroll) ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-2 lg:p-8 lg:pb-8 max-h-[800px]:p-2 grid grid-cols-1 lg:grid-cols-12 gap-x-2 gap-y-2 lg:gap-y-4 max-h-[800px]:gap-y-1 h-full min-h-0 overflow-y-auto lg:overflow-visible">

        {/* ── COL 1: Inputs & Benchmarks (Span 3) ── */}
        {/* ── COL 1: Inputs & Benchmarks (Span 3) ── */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full py-8 max-h-[800px]:py-2 relative z-30">
          {/* Vertical Connector Line (Left Column) */}
          <div className="absolute left-[28px] top-[56px] bottom-[56px] max-h-[800px]:top-[26px] max-h-[800px]:bottom-[26px] w-[2px] bg-slate-700/30 -z-10 hidden lg:block" />
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
                  tooltip={step.tooltip}
                />
              </div>
            );
          })}
        </div>

        {/* ── COL 2: Visual Funnel (Span 6) ── */}
        {/* ── COL 2: Visual Funnel (Span 6) ── */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full py-2 lg:py-8 px-2 lg:px-4 max-h-[800px]:py-1 relative z-20">
          {funnelSteps.map((step, i) => {
            // Color logic
            let status: Status = 'success'; // Default to success/yellow if no rate
            // @ts-ignore
            if (step.rate !== undefined && step.benchmarkKey) {
              // @ts-ignore
              const currentBenchmarkValue = benchmarks[step.benchmarkKey];
              status = getPerformanceStatus(step.rate, { min: currentBenchmarkValue });
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
                  className={`h-8 lg:h-[48px] max-h-[800px]:h-8 ${barColor} rounded-lg shadow-lg flex flex-col items-center justify-center relative transition-all duration-500 ease-out border border-white/10`}
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
                {/* Connector (Below the bar, connecting to next) - Only if not last */}
                {i < funnelSteps.length - 1 && (
                  <div className="relative flex flex-col items-center justify-center my-1 z-0 group/connector">
                    {/* Vertical Connecting Line (Background) */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white/10 -z-10 group-hover/connector:bg-white/20 transition-colors"></div>

                    {/* Only show rate if next step has one (which it strictly does in our data model) */}
                    {funnelSteps[i + 1].rate !== undefined && (() => {
                      const nextStep = funnelSteps[i + 1];
                      // @ts-ignore
                      const currentBenchmarkValue = benchmarks[nextStep.benchmarkKey];
                      return (
                        <>
                          {/* 1. Rate Display (Top) */}
                          <span className={`text-xl font-extrabold px-1.5 py-0 rounded shadow-sm relative z-10 bg-[#0F1B4E] border transition-transform group-hover/connector:scale-110 flex items-center gap-1 tabular-nums ${getStatusColor(
                            getPerformanceStatus(nextStep.rate!, { min: currentBenchmarkValue }),
                            'text'
                          )
                            } ${getStatusColor(
                              getPerformanceStatus(nextStep.rate!, { min: currentBenchmarkValue }),
                              'border'
                            )
                            }`}>
                            {formatRate(nextStep.rate!)}
                            {nextStep.rateTooltip && (
                              <div className="z-50 pointer-events-auto">
                                <Tooltip text={nextStep.rateTooltip!} />
                              </div>
                            )}
                          </span>

                          {/* 2. Arrow (Middle) */}
                          <div className="text-white/10 group-hover/connector:text-white/30 transition-colors z-0 my-0.5">
                            <ArrowDown size={14} />
                          </div>

                          {/* 3. Editable Benchmark Input (Bottom) */}
                          <div className="flex items-center gap-1 pointer-events-auto z-10 bg-[#0F1B4E] px-1 rounded border border-transparent hover:border-white/10 transition-colors mt-4 mb-2">
                            <span className="text-[9px] text-slate-500 font-medium">Meta:</span>
                            <input
                              type="number"
                              step="0.1"
                              className="w-10 bg-transparent text-[10px] text-slate-400 border-none focus:outline-none text-center transition-colors font-mono p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={currentBenchmarkValue}
                              onChange={(e) => {
                                // @ts-ignore
                                updateBenchmark(nextStep.benchmarkKey, Number(e.target.value))
                              }}
                            />
                            <span className="text-[9px] text-slate-600">%</span>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── COL 3: KPI Highlights (Span 3) ── */}
        <div className="lg:col-span-3 flex flex-col h-full gap-4 py-2 max-h-[800px]:gap-2 relative z-10">
          {kpis.map((kpi) => {
            // @ts-ignore
            const currentBenchmarkValue = benchmarks[kpi.benchmarkKey];
            const status = getPerformanceStatus(kpi.value, { min: currentBenchmarkValue });
            return (
              <div key={kpi.label} className={`flex-1 bg-[#1A275E] border rounded-xl p-4 max-h-[800px]:p-2 flex flex-col items-center justify-center text-center shadow-lg transition-all group relative overflow-visible ${getStatusColor(status, 'border')}`}>
                <div className={`absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl ${status === 'success' ? 'from-rei-green/5' : status === 'attention' ? 'from-[#FFAA17]/5' : 'from-red-500/5'}`} />

                <div className="flex items-center gap-2 mb-1 relative z-10">
                  <h3 className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
                    {kpi.label}
                  </h3>
                  {kpi.tooltip && <Tooltip text={kpi.tooltip} />}
                </div>

                <div className={`text-2xl lg:text-5xl font-black tracking-tight mb-1 lg:mb-2 relative z-10 tabular-nums ${getStatusColor(status, 'text')}`}>
                  {formatRate(kpi.value)}
                </div>

                <div className="bg-[#0F1B4E] rounded-full px-3 py-1 flex items-center gap-2 border border-white/5 relative z-10">
                  <Target size={10} className="text-slate-500" />
                  <span className="text-[10px] text-slate-400 font-bold">Meta:</span>
                  <div className="flex items-center gap-0.5">
                    <input
                      type="number"
                      step="0.1"
                      className="w-8 bg-transparent text-[11px] font-bold text-white border-b border-transparent hover:border-slate-600 focus:border-[#FFAA17] focus:outline-none text-center transition-colors font-mono p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={currentBenchmarkValue}
                      onChange={(e) => {
                        // @ts-ignore
                        updateBenchmark(kpi.benchmarkKey, Number(e.target.value))
                      }}
                    />
                    <span className="text-[9px] font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
