"use client"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import React, { useEffect, useId, useRef, useState } from "react"

export default function MobileMenu({ items = [] }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const triggerRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false)
    }

    const desktop = window.matchMedia("(min-width: 1024px)")
    function onViewportChange(event) {
      if (event.matches) setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    desktop.addEventListener("change", onViewportChange)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      desktop.removeEventListener("change", onViewportChange)
    }
  }, [open])

  function closeMenu() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="group beveled-left click-hover amount-2 ease-expo absolute left-0 top-1/2 -translate-y-1/2 bg-teal-300 p-px"
      >
        <span className="beveled-left flex items-center justify-center bg-gray-800 p-2.5 text-teal-500 transition-colors group-hover:bg-emerald-100">
          <Menu size={20} strokeWidth={2.5} />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close menu"
            onClick={closeMenu}
            className="appear leave spawn-fade time-0.3 absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
          />

          <div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="appear leave clip-reveal-right ease-expo time-0.4 relative flex h-full w-[min(20rem,85vw)] flex-col border-r border-teal-400/30 bg-gray-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-teal-400/20 px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-teal-500">Navigation</p>
                <p className="mt-1 text-lg text-emerald-50">Menu</p>
              </div>

              <button
                ref={closeRef}
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="group beveled-right bg-teal-300 p-px transition-transform hover:scale-105"
              >
                <span className="beveled-right flex items-center justify-center bg-gray-800 p-2.5 text-teal-300 transition-colors group-hover:bg-gray-700">
                  <X size={18} strokeWidth={2.5} />
                </span>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-6">
              {items.map((item, index) => (
                <Link
                  key={item.title}
                  href={item.link}
                  onClick={closeMenu}
                  className="group flex items-center gap-4 border border-transparent px-3 py-3 text-lg lowercase tracking-wide text-teal-300 transition-colors hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-100"
                >
                  <span className="h-6 w-1.5 shrink-0  bg-teal-300 [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_6px),calc(100%_-_6px)_100%,0_100%)]" />
                  <span className="flex-1">{item.title}</span>

                </Link>
              ))}

              
            </nav>

            <div className="border-t border-teal-400/20 px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                node + next marketplace
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
