import React from 'react'

export default function Boot() {
  // The base systemd log messages
  const baseLogs = [
    "Starting GClass Boot Sequence - GNU/Linux...",
    "Listening on Journal Socket (/dev/log).",
    "Listening on Journal Socket.",
    "Mounted Huge Pages File System.",
    "Mounted POSIX Message Queue File System.",
    "Mounted Kernel Debug File System.",
    "Mounted Kernel Trace File System.",
    "Starting Create List of Static Device Nodes...",
    "Starting Load Kernel Module configfs...",
    "Starting Load Kernel Module drm...",
    "Starting Load Kernel Module fuse...",
    "Mounted FUSE Control File System.",
    "Mounted Kernel Configuration File System.",
    "Started Journal Service.",
    "Started Remount Root and Kernel File Systems.",
    "Starting Coldplug All udev Devices...",
    "Started Coldplug All udev Devices.",
    "Starting Helper to synchronize boot up for ifupdown...",
    "Started GSAP Engine v3.15.0 (TextPlugin, ScrollTrigger, SplitText, DrawSVG, MotionPath, ScrambleText, Flip).",
    "Mounted Animation Registry (spawn-up/down/left/right, typewriter, scramble, count, clip-reveal).",
    "Started GClass Animation System - Tailwind-style utility layer.",
    "Starting Raise network interfaces...",
    "Reached target Network.",
    "Reached target Network is Online.",
    "Starting System Logging Service...",
    "Started System Logging Service.",
    "Starting D-Bus System Message Bus...",
    "Started D-Bus System Message Bus.",
    "Started User Login Management.",
    "Reached target System Initialization.",
    "Started Boot Animation (boot-up boot-time-4 boot-end-spawn-blur).",
    "Listening on boot-up (any .boot-up in DOM).",
    "Reached target Graphical Interface.",
    "Started Next.js Frontend (StrictMode).",
    "Started Node.js Backend API.",
    "Listening on GClass Boot Complete."
  ];

  // Repeat the logs to create a massive wall of text
  const wallOfText = Array(8).fill(baseLogs).flat();

  return (
    <div className='relative w-screen h-screen overflow-hidden boot-up boot-time-2 boot-end-curtain-vertical text-teal-300 font-mono bg-gray-800'> 
      
      {/* 
        The Background Wall of Text
      */}
      <div className='absolute inset-0 opacity-10 z-0 p-2 overflow-hidden pointer-events-none'>
        {/* We use a multi-column layout to make it look like a dense terminal */}
        <div className='columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 text-[10px] leading-tight w-full h-full scale-[1.3] origin-top-left'>
          {wallOfText.map((text, i) => (
            <div key={i} className="break-inside-avoid mb-1 whitespace-nowrap">
              {/* Systemd format: [  OK  ] Message */}
              <span className="text-green-400 font-bold tracking-tighter">[  OK  ] </span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* 
        The Foreground Loading Text
      */}
      <div className='absolute inset-0 flex items-center justify-center z-10 pointer-events-none'>
        <p className='typewriter text-2xl md:text-4xl font-bold tracking-widest  px-8 py-4 '>
          Loading marketplace...
        </p>
      </div>

    </div>
  )
}