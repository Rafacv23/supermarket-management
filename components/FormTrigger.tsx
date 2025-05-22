import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { buttonVariants } from "@/components/ui/button"
import { X } from "lucide-react"

interface Props extends React.ComponentPropsWithoutRef<"form"> {
  icon: React.ReactNode
  title?: string
  description: string
  form: React.ReactNode
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
}

export default function FormTrigger({
  icon,
  title,
  description,
  form,
  variant = "default",
}: Props) {
  return (
    <Drawer>
      <DrawerTrigger
        aria-label="Nuevo producto"
        className={buttonVariants({
          variant: variant ?? (title ? "default" : "secondary"),
        })}
      >
        {icon} {title}
      </DrawerTrigger>
      <DrawerContent className="h-[85dvh] px-6 sm:rounded-t-xl">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>{title || "Nuevo producto"}</DrawerTitle>
            <DrawerClose
              aria-label="Cerrar"
              className={buttonVariants({ variant: "secondary" })}
            >
              <X size={20} />
            </DrawerClose>
          </div>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto max-h-[calc(100dvh-140px)]">{form}</div>
      </DrawerContent>
    </Drawer>
  )
}
