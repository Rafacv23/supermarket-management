import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Product } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, Barcode } from "lucide-react"
import UploadProductForm from "@/components/forms/UploadProductForm"
import FormTrigger from "./FormTrigger"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <Badge className="mb-2">{product.category}</Badge>
        <CardTitle className="mb-2">{product.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 mb-2">
          <Barcode size={16} /> {product.barcode}
        </CardDescription>
        <CardDescription className="flex items-center gap-2 mb-4">
          {product.brand}
        </CardDescription>
        <FormTrigger
          icon={<ArrowUp size={16} />}
          title="Subir"
          description="Añade todos los productos que vayas a subir desde el almacen"
          form={<UploadProductForm barcode={product.barcode} />}
        />
      </CardHeader>
    </Card>
  )
}
