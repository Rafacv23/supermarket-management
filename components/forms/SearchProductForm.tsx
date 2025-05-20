"use client"

import { Camera, Loader, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  searchTerm: string
  setSearchTerm: (term: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  scanning: boolean
  setScanning: (value: boolean) => void
}

export default function SearchProductForm({
  searchTerm,
  setSearchTerm,
  onSubmit,
  loading,
  scanning,
  setScanning,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <p className="mb-2">Buscar productos</p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            type="search"
            value={searchTerm}
            disabled={loading}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nombre o código de barras"
            className="w-full"
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => setSearchTerm("")}
            disabled={loading}
            aria-label="Borrar"
            className={searchTerm ? "" : "invisible"}
          >
            <X size={16} />
          </Button>
          <Button
            type="button"
            variant={scanning ? "destructive" : "secondary"}
            onClick={() => setScanning(!scanning)}
            className="gap-2"
            disabled={loading}
            aria-label="Escanear"
          >
            <Camera size={16} />
            {scanning ? "Cerrar cámara" : "Escanear"}
          </Button>
        </div>
        <Button type="submit" className="gap-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader size={16} className="w-4 h-4 animate-spin" />
              Buscando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search size={16} className="w-4 h-4" />
              Buscar
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
