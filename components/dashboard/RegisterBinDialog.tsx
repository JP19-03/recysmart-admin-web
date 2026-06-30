"use client";

import React, { useState, useEffect } from "react";
import { X, Cpu, AlertTriangle, Target } from "lucide-react";
import { toast } from "sonner";
import { useRegisterBin } from "@/src/hooks/useBins";
import { CreateSmartBinData } from "@/src/schemas";

interface RegisterBinDialogProps {
  open: boolean;
  onClose: () => void;
}

export function RegisterBinDialog({ open, onClose }: RegisterBinDialogProps) {
  const registerMutation = useRegisterBin();

  const [locationName, setLocationName] = useState("");
  const [maxCapacity, setMaxCapacity] = useState<number>(100);
  const [latitude, setLatitude] = useState<number>(-12.0463);
  const [longitude, setLongitude] = useState<number>(-77.0427);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form states when modal opens/closes
  useEffect(() => {
    if (open) {
      setLocationName("");
      setMaxCapacity(100);
      setLatitude(-12.0463);
      setLongitude(-77.0427);
      setFormError(null);
    }
  }, [open]);

  if (!open) return null;

  // Autofills the Parque de la Exposición demo credentials requested by the user
  const handleAutofillDemo = () => {
    setLocationName("Parque de la Exposición - Zona A");
    setMaxCapacity(200);
    setLatitude(-12.059432);
    setLongitude(-77.036041);
    toast.success("¡Coordenadas Demo Autocompletadas!", {
      description: "Parque de la Exposición cargado exitosamente.",
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!locationName.trim()) {
      setFormError("El nombre de la ubicación no puede estar vacío");
      return;
    }
    if (maxCapacity <= 0) {
      setFormError("La capacidad máxima debe ser mayor a 0 botellas");
      return;
    }

    try {
      const payload: CreateSmartBinData = {
        locationName,
        maxCapacity,
        latitude,
        longitude,
      };

      await registerMutation.mutateAsync(payload);
      toast.success("¡Dispositivo ESP32 Registrado!", {
        description: `El contenedor en "${locationName}" ha sido añadido a la red.`,
      });
      onClose();
    } catch (err: any) {
      setFormError(err?.message || "Error al registrar el nuevo contenedor inteligente.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 px-4">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in scale-in duration-200"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-base">Registrar Contenedor ESP32</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* Location Input */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nombre de Ubicación
            </label>
            <input
              type="text"
              placeholder="Ej: Parque de la Exposición - Zona A"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              required
            />
          </div>

          {/* Max Capacity Input */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Capacidad Máxima (Número de Botellas)
            </label>
            <input
              type="number"
              min="1"
              placeholder="Ej: 200"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              required
            />
          </div>

          {/* Coordinates Inputs */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Latitud
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="-12.059432"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Longitud
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="-77.036041"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Autofill Demo Button */}
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-slate-400" />
            Cargar Coordenadas Demo
          </button>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {registerMutation.isPending ? "Registrando..." : "Registrar Contenedor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
