"use client"
import { initAnimations } from 'gclass-anims'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

export default function InitAnims() {
    const pathname = usePathname()
    useEffect(() => {
        initAnimations()
    },[pathname])
  return null
}
