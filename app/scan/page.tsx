import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera, Search } from "lucide-react"
import NewProductForm from "@/components/forms/NewProductForm"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { buttonVariants } from "@/components/ui/button"

export default function ScanPage() {
  const exampleProducts = [
    {
      name: "Leche",
      barcode: "234242424243",
      category: "lacteos",
      price: 100,
      stock: 10,
    },
    {
      name: "Huevos",
      barcode: "234242424243",
      category: "lacteos",
      price: 100,
      stock: 10,
    },
  ]

  return (
    <Container>
      <h1>Escanear productos</h1>
      <p>Escanea o añade nuevos productos.</p>
      <form>
        buscar productos
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Nombre del producto o código de barras"
          />
          <Button>
            <Camera />
          </Button>
          <Button type="submit">
            <Search />
          </Button>
        </div>
      </form>
      <Drawer>
        <DrawerTrigger className={buttonVariants({ variant: "default" })}>
          Añadir nuevo producto
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Añadir nuevo producto</DrawerTitle>
            <DrawerDescription>
              Añade nuevos productos a tu almacén.
            </DrawerDescription>
          </DrawerHeader>
          <NewProductForm />
        </DrawerContent>
      </Drawer>

      <div>
        <ul>
          {exampleProducts.map((product, index) => (
            <li key={index}>
              <Card>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.barcode}</CardDescription>
                  <CardDescription>{product.stock} en almacen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline">{product.category}</Button>
                    <Button variant="outline">{product.price}€</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Eliminar</Button>
                  <Button variant="outline">Pedir</Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
