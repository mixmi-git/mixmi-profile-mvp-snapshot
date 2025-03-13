'use client'

import { NavbarContainer } from '@/components/profile/NavbarContainer'

export default function TestNavbar() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* NavbarContainer at the top */}
      <div className="w-full">
        <NavbarContainer />
      </div>
      
      {/* Content area */}
      <main className="flex-grow p-8 mt-8">
        <div className="border-8 border-red-500 bg-blue-800 p-8 rounded-lg max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-yellow-300">Navbar Test Page</h1>
          <p className="mt-4 text-xl text-green-400">This page is used to test the NavbarContainer component.</p>
          <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg">
            Test Button
          </button>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="h-32 bg-red-500 rounded-lg flex items-center justify-center">Box 1</div>
            <div className="h-32 bg-green-500 rounded-lg flex items-center justify-center">Box 2</div>
            <div className="h-32 bg-blue-500 rounded-lg flex items-center justify-center">Box 3</div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-4 bg-gray-800 text-center text-white">
        Test Navbar Page Footer
      </footer>
    </div>
  )
} 