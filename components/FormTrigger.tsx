import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { buttonVariants } from "@/components/ui/button"

interface Props {
  icon: React.ReactNode
  title: string
  description: string
  form: React.ReactNode
}

export default function FormTrigger({ icon, title, description, form }: Props) {
  return (
    <Drawer>
      <DrawerTrigger className={buttonVariants({ variant: "outline" })}>
        {icon} {title}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {form}
      </DrawerContent>
    </Drawer>
  )
}
