import React from 'react'
import { ArrowRight, Shield, FileCodeIcon as FileContract, LayoutDashboard } from "lucide-react"
import { useAuth } from '../contexts/AuthContext'

export default function Owner() {
  const {login} = useAuth()
  return (
    <div className="">
      <section className="relative overflow-hidden mt-8 rounded-xl bg-indigo-600">
        <div className="py-16 relative z-10">
          <div className="text-center flex flex-col justify-center items-center gap-8 text-white mb-8">
            <div className="">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                List. Book. Earn.
              </h2>
              <p className="text-lg">
                Buat lapanganmu lebih mudah ditemukan hanya di Athlon!
              </p>
            </div>

            <button onClick={login} className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors">
              <ArrowRight size={18} />
              <span >Gabung Sekarang</span>
            </button>
          </div>
        </div>
      </section>
      <section>
        <div className="py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Grow Your Sports Business With Blockchain Simplicity
              </h2>
              <p className="text-gray-600 mb-10">
                Gabung bersama ratusan pemilik lapangan yang sudah memanfaatkan teknologi Web3. Proses mudah, transparan,
                dan aman—lapanganmu siap dipesan kapan saja, dari mana saja.
              </p>

              {/* Features */}
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Decentralized & Secure</h3>
                    <p className="text-gray-600">
                      Komisi jujur, tanpa biaya tambahan. Pendapatanmu langsung masuk dompet digital terverifikasi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FileContract size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Smart Contract Booking</h3>
                    <p className="text-gray-600">
                      Semua pemesanan diproses otomatis dan aman lewat teknologi blockchain—tanpa campur tangan pihak
                      ketiga.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <LayoutDashboard size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Realtime Dashboard</h3>
                    <p className="text-gray-600">
                      Kelola jadwal, pesanan, dan pemasukanmu dalam satu tampilan modern dan simpel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image and Stats */}
            <div className="relative">
              <div className=" rounded-3xl overflow-hidden">
                <img
                  src="/image-owner.png"
                  alt="Person using the Athion app"
                  className="w-full h-auto"
                />
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
