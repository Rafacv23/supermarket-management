import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { buttonVariants } from "@/components/ui/button"

interface Props extends React.ComponentPropsWithoutRef<"form"> {
  icon: React.ReactNode
  title: string
  description: string
  form: React.ReactNode
}

export default function FormTrigger({ icon, title, description, form }: Props) {
  return (
    <Drawer repositionInputs>
      <DrawerTrigger className={buttonVariants({ variant: "default" })}>
        {icon} {title}
      </DrawerTrigger>
      <DrawerContent className="min-h-3/4 px-2 mb-8">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {form}
      </DrawerContent>
    </Drawer>
  )
}
