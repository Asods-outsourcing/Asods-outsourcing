'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TalentPoolForm from '@/components/talent-pool/TalentPoolForm'

export default function TalentPoolPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <TalentPoolForm />
      </main>
      <Footer />
    </div>
  )
}
