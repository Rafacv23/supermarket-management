import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Product } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Banknote,
  Barcode,
  Boxes,
  ClipboardList,
  PackageCheck,
} from "lucide-react"

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
        <Button variant="outline">
          <PackageCheck /> Recibir
        </Button>
        <Button variant="default">
          <ClipboardList size={16} />
          Subir
        </Button>
      </CardFooter>
    </Card>
  )
}
