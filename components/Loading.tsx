import { Loader } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center gap-2 mt-4 text-muted-foreground">
      <Loader className="w-4 h-4 animate-spin" />
      Cargando...
    </div>
  )
}
