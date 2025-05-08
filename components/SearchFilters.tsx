import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category } from "@prisma/client"

interface SearchFiltersProps extends React.ComponentPropsWithoutRef<"form"> {
  category: Category | undefined
  setCategory: (category: Category) => void
}

export default function SearchFilters({
  category,
  setCategory,
}: SearchFiltersProps) {
  return (
    <nav>
      <h4>Categoría</h4>
      <form>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as Category)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Categoría del producto" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Category).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
    </nav>
  )
}
