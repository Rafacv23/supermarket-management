import Container from "@/components/Container"
import { ClipboardList } from "lucide-react"
import UploadProductForm from "@/components/forms/UploadProductForm"
import FormTrigger from "@/components/FormTrigger"
import UploadProductsList from "@/components/UploadProductsList"

export default function UploadPage() {
  return (
    <Container>
      <h1 className="flex items-center gap-2">
        <ClipboardList /> Subir mercancía
      </h1>
      <p>Sube los productos desde el almacen.</p>
      <FormTrigger
        title="Subir productos"
        icon={<ClipboardList size={16} />}
        form={<UploadProductForm />}
        description="Añade todos los productos que vayas a subir desde el almacen."
      />
      <UploadProductsList />
    </Container>
  )
}
