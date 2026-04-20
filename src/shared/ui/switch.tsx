"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/shared/lib/utils"

// Figma: Toggle Button (1679:5304) — 41×20px
// OFF: bg neutral-200, 흰 썸 왼쪽(x=2)
// ON:  bg cta-300,     흰 썸 오른쪽(x=23)
//
// 주의: data-[state=*]:translate-x-* 두 개를 cn()에 넘기면 tailwind-merge가
// 같은 그룹으로 보고 하나를 제거함 → checked prop으로 직접 분기
function Switch({
  className,
  checked,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      checked={checked}
      className={cn(
        "relative h-5 w-10.25 shrink-0 rounded-full outline-none transition-colors duration-200",
        checked ? "bg-cta-300" : "bg-neutral-200",
        "disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none absolute left-0 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: `translateX(${checked ? '23px' : '2px'})` }}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
