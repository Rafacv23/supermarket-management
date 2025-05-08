"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Barcode, ClipboardList, House, PackageCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Navigation() {
  const pathname = usePathname()

  if (pathname === "/login") return null

  const isCurrentPath = (path: string) => pathname === path

  return (
    <footer
      className="row-start-3 rounded-2xl mb-2 mx-2 flex gap-2 flex-wrap items-center justify-center fixed bottom-0 left-0 right-0 bg-card text-card-foreground p-6"
      role="contentinfo"
    >
      <Link
        className={buttonVariants({
          variant: isCurrentPath("/") ? "default" : "secondary",
        })}
        href="/"
        title="Inicio"
      >
        {isCurrentPath("/") ? (
          <motion.span
            key="inicio"
            layoutId="active-nav"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <House size={20} />
            Inicio
          </motion.span>
        ) : (
          <House size={20} />
        )}
      </Link>

      <Link
        className={buttonVariants({
          variant: isCurrentPath("/scan") ? "default" : "secondary",
        })}
        href="/scan"
        title="Escanear producto"
      >
        {isCurrentPath("/scan") ? (
          <motion.span
            key="scan"
            layoutId="active-nav"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Barcode size={20} />
            Escanear
          </motion.span>
        ) : (
          <Barcode size={20} />
        )}
      </Link>

      <Link
        className={buttonVariants({
          variant: isCurrentPath("/receive") ? "default" : "secondary",
        })}
        href="/receive"
        title="Recepción de pedidos"
      >
        {isCurrentPath("/receive") ? (
          <motion.span
            key="receive"
            layoutId="active-nav"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <PackageCheck size={20} />
            Bajar
          </motion.span>
        ) : (
          <PackageCheck size={20} />
        )}
      </Link>

      <Link
        className={buttonVariants({
          variant: isCurrentPath("/upload") ? "default" : "secondary",
        })}
        href="/upload"
        title="Subir mercancía"
      >
        {isCurrentPath("/upload") ? (
          <motion.span
            key="upload"
            layoutId="active-nav"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <ClipboardList size={20} />
            Subir
          </motion.span>
        ) : (
          <ClipboardList size={20} />
        )}
      </Link>
    </footer>
  )
}
