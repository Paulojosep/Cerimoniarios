"use client";

import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Card, CelebracaoTitulo } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CategoriaLabel, type Categoria } from "@/types/enums";
import { makePrivateRequest, requestBackend } from '@/util/request';
import { url } from 'inspector';
import { Cerimoniarios } from '@/types/Cerimoniarios';
import { extractInitialsFromName } from '@/lib/utils';

const pessoasMock = [
  {
    id: "1",
    nome: "Marcelo Costa",
    categoria: "CERIMONIALISTA" as Categoria,
    papel: "Coordenador",
    funcoes: ["Principal", "Palavra", "Credência"],
    status: "ATIVO" as const,
    celebracoesMes: 5,
    iniciais: "MC",
  },
  {
    id: "2",
    nome: "Juliana Oliveira",
    categoria: "CERIMONIALISTA" as Categoria,
    papel: "Servidor",
    funcoes: ["Principal", "Credência"],
    status: "ATIVO" as const,
    celebracoesMes: 3,
    iniciais: "JO",
  },
  {
    id: "3",
    nome: "Rafael Santos",
    categoria: "ACOLITO" as Categoria,
    papel: "Servidor",
    funcoes: ["Palavra", "Credência"],
    status: "ATIVO" as const,
    celebracoesMes: 2,
    iniciais: "RS",
  },
  {
    id: "4",
    nome: "Beatriz Lima",
    categoria: "COROINHA" as Categoria,
    papel: "Servidor",
    funcoes: ["Credência"],
    status: "ATIVO" as const,
    celebracoesMes: 4,
    iniciais: "BL",
  },
  {
    id: "5",
    nome: "Dona Cecília",
    categoria: "SACRISTAO" as Categoria,
    papel: "Servidor",
    funcoes: ["Credência"],
    status: "ATIVO" as const,
    celebracoesMes: 8,
    iniciais: "DC",
  },
  {
    id: "6",
    nome: "Pedro Henrique",
    categoria: "ACOLITO" as Categoria,
    papel: "Servidor",
    funcoes: ["Palavra"],
    status: "AFASTADO" as const,
    celebracoesMes: 0,
    iniciais: "PH",
  },
];

export default function PessoasPage() {

  const [cerimoniarios, setCerimoniarios] = useState<Cerimoniarios[]>([])

  useEffect(() => {
    requestBackend({url: `/Cerimoniarios/Listar`})
      .then((resp) => setCerimoniarios(resp.data));
  }, []);

  function btnAdicionarPessoa() {
    console.log('Adicionar Pessoa')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <CelebracaoTitulo className="text-2xl">Pessoas</CelebracaoTitulo>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {cerimoniarios.length} membros da equipe do cerimonial
          </p>
        </div>
        <Link href="/pessoas/form/novo">
          <Button>
            <Plus className="h-4 w-4" />
            Adicionar pessoa
          </Button>
        </Link>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] py-2.5 pl-9 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand)] focus:outline-none transition-all"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {cerimoniarios.map((cerimoniario) => (
          <Card key={cerimoniario.id}>
            <div className="flex items-start gap-3">
              <Avatar className="h-11 w-11 shrink-0 ring-0 shadow-sm">
                <AvatarFallback className="text-xs bg-[var(--brand)] text-white">
                  {extractInitialsFromName(cerimoniario.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {cerimoniario.nome}
                  </h3>
                  {/*pessoa.status === "AFASTADO" && (
                    <Badge variant="secondary" className="text-[10px]">
                      Afastado
                    </Badge>
                  )*/}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {/*CategoriaLabel[pessoa.categoria]} · {pessoa.papel*/}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {/*pessoa.funcoes.map((f) => (
                <Badge key={f} variant="secondary" className="text-[10px]">
                  {f}
                </Badge>
              ))*/}
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)]">
                {/*pessoa.celebracoesMes*/} celebrações este mês
              </span>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon-sm">
                  <Mail className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Phone className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}