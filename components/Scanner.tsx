// components/BarcodeScannerWrapper.tsx
"use client"

import BarcodeScanner, { BarcodeStringFormat } from "react-qr-barcode-scanner" // or your scanner lib
import React from "react"

type Props = {
  onDetected: (code: string) => void
  width?: number
  height?: number
}

export default function Scanner({
  onDetected,
  width = 300,
  height = 100,
}: Props) {
  return (
    <div className="mt-4 max-w-sm border rounded-md overflow-hidden">
      <BarcodeScanner
        width={width}
        height={height}
        formats={[BarcodeStringFormat.EAN_13]}
        onUpdate={(err, result) => {
          if (result) {
            onDetected(result.getText())
          }
        }}
      />
    </div>
  )
}
