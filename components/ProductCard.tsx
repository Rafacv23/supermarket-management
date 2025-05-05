import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Product } from "@prisma/client"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Banknote,
  Barcode,
  Boxes,
  ClipboardList,
  PackageCheck,
} from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import ReceiveProductForm from "@/components/forms/ReceiveProductForm"
import UploadProductForm from "@/components/forms/UploadProductForm"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="outline">{product.category}</Badge>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Barcode size={16} /> {product.barcode}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2"></div>
        <div className="grid grid-cols-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Boxes size={16} /> Almacen
          </p>
          <p className="font-bold">{product.stock}uds</p>
          {product.price && (
            <>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Banknote size={16} /> Precio
              </p>
              <p className="font-bold">10{product.price}€</p>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Drawer>
          <DrawerTrigger className={buttonVariants({ variant: "outline" })}>
            <PackageCheck size={16} /> Recibir
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Recepción de productos</DrawerTitle>
              <DrawerDescription>
                Añade todos los productos que hayas recibido.
              </DrawerDescription>
            </DrawerHeader>
            <ReceiveProductForm barcode={product.barcode} />
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger className={buttonVariants({ variant: "default" })}>
            <ClipboardList size={16} />
            Subir
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Subir productos</DrawerTitle>
              <DrawerDescription>
                Añade todos los productos que vayas a subir desde el almacen.
              </DrawerDescription>
            </DrawerHeader>
            <UploadProductForm barcode={product.barcode} />
          </DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  )
}
