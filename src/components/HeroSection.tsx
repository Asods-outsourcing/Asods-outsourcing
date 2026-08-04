import React from 'react'

interface HeroSectionProps {
  title: string | React.ReactNode
  subtitle?: string
  backgroundImage?: string
  children?: React.ReactNode
  overlayOpacity?: number
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage = '/hero-background.jpg',
  children,
  overlayOpacity = 0.4,
}: HeroSectionProps) {
  return (
    <section
      className="py-24 bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        willChange: 'background-image',
      }}
    >
      {/* Overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      ></div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-5xl font-bold mb-4 text-white">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  )
}
