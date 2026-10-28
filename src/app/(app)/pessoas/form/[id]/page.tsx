"use client";

import { Cerimoniarios } from "@/types/Cerimoniarios";
import { requestBackend } from "@/util/request";
import { AxiosRequestConfig } from "axios";
import { Camera, Check, LoaderCircle, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CelebracaoTitulo } from "@/components/ui/primitives";

type FormularioPessoa = Omit<Cerimoniarios, "id">;

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10";

const Formulario = () => {
  const params = useParams<{ id: string }>();
  const idUsuario = params.id;
  const ehEditado = Boolean(idUsuario) && idUsuario !== "novo";
  const router = useRouter();
  const [carregando, setCarregando] = useState(ehEditado);
  const [salvando, setSalvando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormularioPessoa>();

  const imagem = useWatch({ control, name: "imagem" });

  useEffect(() => {
    if (!ehEditado) return;

    requestBackend({ url: `/cerimoniarios/${idUsuario}`, method: "GET" })
      .then((response) => reset(response.data as FormularioPessoa))
      .catch((error) => {
        console.error("Erro ao buscar os cerimoniais:", error);
        setErroEnvio("Não foi possível carregar os dados da pessoa.");
      })
      .finally(() => setCarregando(false));
  }, [ehEditado, idUsuario, reset]);

  const onSubmit = (data: FormularioPessoa) => {
    setErroEnvio("");
    setSalvando(true);

    const config: AxiosRequestConfig = {
      method: ehEditado ? "PUT" : "POST",
      url: ehEditado ? `/cerimoniarios/${idUsuario}` : "/cerimoniarios",
      data,
    };

    requestBackend(config)
      .then(() => router.push("/pessoas"))
      .catch((error) => {
        console.error("Erro ao salvar o cerimonial:", error);
        setErroEnvio("Não foi possível salvar os dados. Tente novamente.");
      })
      .finally(() => setSalvando(false));
  };

  const handleCancel = () => router.push("/pessoas");

  if (carregando) {
    return (
      <div className="flex min-h-96 items-center justify-center text-[var(--text-secondary)]">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
        Carregando pessoa...
      </div>
    );
  }

  function onSalvar(): void {
    if(ehEditado) {
      console.log('Salvar alterações')
    } else {
      console.log('Adicionar pessoa')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          aria-label="Voltar para pessoas"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <CelebracaoTitulo className="text-2xl">
            {ehEditado ? "Editar pessoa" : "Adicionar pessoa"}
          </CelebracaoTitulo>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Cadastre os dados da pessoa que participa do cerimonial.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="p-5 sm:p-7">
          <div className="grid gap-7 md:grid-cols-[180px_minmax(0,1fr)]">
            <div>
              <span className="block text-sm font-medium text-[var(--text-primary)]">Foto</span>
              <div className="mt-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-1)]">
                {imagem ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagem}
                    alt="Prévia da foto da pessoa"
                    className="h-full w-full object-cover"
                    onError={(event) => { event.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <Camera className="h-9 w-9 text-[var(--text-tertiary)]" aria-hidden="true" />
                )}
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--text-tertiary)]">
                Informe a URL de uma imagem pública.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="nome" className="text-sm font-medium text-[var(--text-primary)]">
                  Nome completo <span className="text-[var(--error)]">*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Ex.: Maria Oliveira"
                  className={fieldClass}
                  aria-invalid={Boolean(errors.nome)}
                  {...register("nome", {
                    required: "Informe o nome completo.",
                    minLength: { value: 3, message: "O nome deve ter pelo menos 3 caracteres." },
                  })}
                />
                {errors.nome && (
                  <p className="mt-1.5 text-xs text-[var(--error)]" role="alert">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="idade" className="text-sm font-medium text-[var(--text-primary)]">
                  Idade <span className="text-[var(--error)]">*</span>
                </label>
                <input
                  id="idade"
                  type="number"
                  min="0"
                  max="120"
                  inputMode="numeric"
                  placeholder="Ex.: 32"
                  className={fieldClass}
                  aria-invalid={Boolean(errors.idade)}
                  {...register("idade", {
                    required: "Informe a idade.",
                    validate: (value) => {
                      const idade = Number(value);
                      return (idade >= 0 && idade <= 120) || "Informe uma idade válida.";
                    },
                  })}
                />
                {errors.idade && (
                  <p className="mt-1.5 text-xs text-[var(--error)]" role="alert">
                    {errors.idade.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="telefone" className="text-sm font-medium text-[var(--text-primary)]">
                  Telefone <span className="text-[var(--error)]">*</span>
                </label>
                <input
                  id="telefone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  className={fieldClass}
                  aria-invalid={Boolean(errors.telefone)}
                  {...register("telefone", { required: "Informe o telefone." })}
                />
                {errors.telefone && (
                  <p className="mt-1.5 text-xs text-[var(--error)]" role="alert">
                    {errors.telefone.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="paroquia" className="text-sm font-medium text-[var(--text-primary)]">
                  Paróquia <span className="text-[var(--error)]">*</span>
                </label>
                <input
                  id="paroquia"
                  type="text"
                  placeholder="Ex.: Paróquia São José"
                  className={fieldClass}
                  aria-invalid={Boolean(errors.paroquia)}
                  {...register("paroquia", { required: "Informe a paróquia." })}
                />
                {errors.paroquia && (
                  <p className="mt-1.5 text-xs text-[var(--error)]" role="alert">
                    {errors.paroquia.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="imagem" className="text-sm font-medium text-[var(--text-primary)]">
                  URL da foto
                </label>
                <input
                  id="imagem"
                  type="url"
                  inputMode="url"
                  placeholder="https://..."
                  className={fieldClass}
                  aria-invalid={Boolean(errors.imagem)}
                  {...register("imagem")}
                />
              </div>
            </div>
          </div>

          {erroEnvio && (
            <p className="mt-6 rounded-xl bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)]" role="alert">
              {erroEnvio}
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando} onClick={onSalvar}>
              {salvando ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
              {salvando ? "Salvando..." : ehEditado ? "Salvar alterações" : "Adicionar pessoa"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default Formulario;
