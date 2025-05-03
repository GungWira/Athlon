import React from 'react'
import { Search, MapPin, ChevronDown, Activity } from 'lucide-react'

export default function Hero() {
  return (
       <section className="relative overflow-hidden mt-8 rounded-xl bg-indigo-600">
            
    
            <div className="py-16 relative z-10">
              <div className="text-center text-white mb-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Going Sport Today?</h2>
                <p className="text-lg">Temukan berbagai jenis fasilitas olahraga terbaik untuk dirimu hanya di Athlon!</p>
              </div>
    
              {/* Search Bar */}
              <div className="bg-white rounded-lg p-6 shadow-lg md:max-w-2xl lg:max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Cari nama"
                      className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
    
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select className="pl-10 pr-4 py-2 w-full border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Pilih Kota</option>
                      <option>Denpasar</option>
                      <option>Jakarta</option>
                      <option>Surabaya</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
    

                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Activity className="h-5 w-5 text-gray-400" />
                      </div>
                      <select className="pl-10 pr-4 py-2 w-full border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Pilih Olah Raga</option>
                        <option>Badminton</option>
                        <option>Tennis</option>
                        <option>Soccer</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
    
                    <button className=" bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Cari Sekarang
                    </button>

                </div>
              </div>
            </div>
          </section>
  )
}
