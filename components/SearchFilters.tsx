import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category } from "@prisma/client"

export default function SearchFilters({ category, setCategory }: any) {
  return (
    <nav>
      <ul>
        <li>Filtros</li>
        <form>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Categoría del producto" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Category).map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  onChange={() => setCategory(category)}
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
      </ul>
    </nav>
  )
}
