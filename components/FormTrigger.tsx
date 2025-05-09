import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button, buttonVariants } from "@/components/ui/button"
import { X } from "lucide-react"

interface Props extends React.ComponentPropsWithoutRef<"form"> {
  icon: React.ReactNode
  title?: string
  description: string
  form: React.ReactNode
}

export default function FormTrigger({ icon, title, description, form }: Props) {
  return (
    <Drawer repositionInputs>
      <DrawerTrigger className={buttonVariants({ variant: "default" })}>
        {icon} {title}
      </DrawerTrigger>
      <DrawerContent className="h-screen max-h-screen px-6 sm:rounded-t-xl">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>{title || "Nuevo producto"}</DrawerTitle>
            <DrawerClose>
              <Button variant="outline">
                <X size={20} />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {form}
      </DrawerContent>
    </Drawer>
  )
}
