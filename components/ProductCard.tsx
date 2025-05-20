import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Product } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Barcode, Boxes, ClipboardList, PackageCheck } from "lucide-react"
import ReceiveProductForm from "@/components/forms/ReceiveProductForm"
import UploadProductForm from "@/components/forms/UploadProductForm"
import FormTrigger from "./FormTrigger"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <Badge>{product.category}</Badge>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Barcode size={16} /> {product.barcode}
        </CardDescription>
        <CardDescription className="flex items-center gap-2">
          {product.brand}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2"></div>
        <div className="grid grid-cols-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Boxes size={16} /> Almacen
          </p>
          <p className="font-bold">{product.stock}uds</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <FormTrigger
          icon={<PackageCheck size={16} />}
          title="Recibir"
          description="Añade todos los productos que hayas recibido"
          form={<ReceiveProductForm barcode={product.barcode} />}
        />
        <FormTrigger
          icon={<ClipboardList size={16} />}
          title="Subir"
          description="Añade todos los productos que vayas a subir desde el almacen"
          form={<UploadProductForm barcode={product.barcode} />}
        />
      </CardFooter>
    </Card>
  )
}
