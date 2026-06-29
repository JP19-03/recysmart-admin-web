"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RegisterAllySchema, RegisterAllyFormData } from "@/src/schemas";
import { useRegisterAlly } from "@/src/hooks/usePartners";
import { RegisterAllyForm } from "./RegisterAllyForm";
import { ApiError } from "@/src/utils";

interface RegisterAllyDialogProps {
  open: boolean;
  onClose: () => void;
}

export function RegisterAllyDialog({ open, onClose }: RegisterAllyDialogProps) {
  const form = useForm<RegisterAllyFormData>({
    resolver: zodResolver(RegisterAllySchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      companyName: "",
      ruc: "",
      logoUrl: "",
    },
  });

  const registerAlly = useRegisterAlly();

  if (!open) return null;

  const onSubmit = (data: RegisterAllyFormData) => {
    registerAlly.mutate(data, {
      onSuccess: () => {
        toast.success("¡Aliado Registrado!", {
          description: `La empresa "${data.companyName}" ha sido vinculada exitosamente.`,
        });
        form.reset();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          error.messages.forEach((msg) => toast.error(msg));
        } else {
          toast.error(error.message || "Error al registrar el aliado");
        }
      },
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      
      {/* Modal Dialog Card (rounded, shadow, max-w-lg) */}
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Accent Line (matching admin web color scheme) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900"></div>

        {/* Header Block with X close button */}
        <div className="flex justify-between items-center pb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Registrar Aliado Comercial</h3>
            <p className="text-xs text-slate-500 font-medium">
              Agrega una nueva empresa socia a la red RecySmart.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Renders dynamic child input elements */}
          <RegisterAllyForm form={form} isLoading={registerAlly.isPending} />

          {/* Action Footer row (mobile stacks, desktop side-by-side) */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={registerAlly.isPending}
              onClick={handleClose}
              className="h-10 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-all cursor-pointer disabled:opacity-50 text-center"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={registerAlly.isPending}
              className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg cursor-pointer shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-center"
            >
              {registerAlly.isPending ? "Registrando..." : "Registrar Aliado"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
