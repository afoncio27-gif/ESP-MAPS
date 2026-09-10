import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { BarChart3, TrendingUp, CheckCircle2, BookOpen, RotateCcw, Home, Printer } from 'lucide-react';

export const RelatoriosView: React.FC = () => {
  const { territorios, enderecos, visitas } = useApp();
  const { t, locale } = useI18n();

  const totalEnderecos = enderecos.filter((e) => e.ativo).length;
  const visitadosEnderecos = enderecos.filter((e) => e.ativo && e.status === 'visitado').length;
  const confirmados = enderecos.filter((e) => e.ativo && e.endereco_confirmado).length;

  const totalEstudos = visitas.filter((v) => v.resultado === 'estudo_biblico').length;
  const totalRevisitas = visitas.filter((v) => v.resultado === 'revisita').length;
  const totalAusentes = visitas.filter((v) => v.resultado === 'morador_ausente').length;
  const totalEstrangeiros = visitas.filter((v) => v.estrangeiro).length;

  const percCobertura = totalEnderecos > 0 ? Math.round((visitadosEnderecos / totalEnderecos) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>{t('nav.relatorios', 'Relatórios da Congregação')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Estatísticas de cobertura e resultados de pregação no território de língua hispana
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-2xs self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Imprimir Relatório</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Cobertura Geral
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{percCobertura}%</span>
            <span className="text-xs text-emerald-600 font-bold">concluído</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${percCobertura}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {visitadosEnderecos} de {totalEnderecos} endereços
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Estudos Bíblicos
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-700">{totalEstudos}</span>
            <span className="text-xs text-purple-600 font-bold">iniciados</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            Moradores que aceitaram cursos bíblicos regulares
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Revisitas Geradas
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-700">{totalRevisitas}</span>
            <span className="text-xs text-indigo-600 font-bold">visitas de retorno</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            Pessoas que demonstraram interesse no território
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Hispanos Localizados
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">{confirmados}</span>
            <span className="text-xs text-emerald-600 font-bold">verificados</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            Endereços confirmados com moradores que falam espanhol
          </p>
        </div>
      </div>

      {/* Breakdown per territory table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Demonstrativo por Território
          </h3>
          <span className="text-xs text-slate-400">Ano de Serviço Atual</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Território</th>
                <th className="py-3 px-4">Bairro</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Responsável</th>
                <th className="py-3 px-4">Endereços</th>
                <th className="py-3 px-4">Visitados</th>
                <th className="py-3 px-4">% Cobertura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {territorios.map((tItem) => {
                const prog =
                  tItem.total_enderecos > 0
                    ? Math.round((tItem.total_visitados / tItem.total_enderecos) * 100)
                    : 0;

                return (
                  <tr key={tItem.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {tItem.numero} - {tItem.nome}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{tItem.bairro}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tItem.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {tItem.publicador_nome || tItem.dirigente_nome || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{tItem.total_enderecos}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {tItem.total_visitados}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-600 w-9">
                          {prog}%
                        </span>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
