"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  language: string
}

export const Navigation = () => {
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState('en')
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setLanguage(parsedUser.language || 'en')
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  const t = (en: string, sw: string) => language === 'sw' ? sw : en

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#E32B44]">BiteBantu</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#E32B44] transition-colors">
              {t('Home', 'Nyumbani')}
            </Link>
            <Link href="/restaurants" className="text-gray-700 hover:text-[#E32B44] transition-colors">
              {t('Restaurants', 'Migahawa')}
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-[#E32B44] transition-colors">
              {t('Categories', 'Makundi')}
            </Link>
            {user && (
              <Link href="/orders" className="text-gray-700 hover:text-[#E32B44] transition-colors">
                {t('My Orders', 'Maagizo Yangu')}
              </Link>
            )}
          </div>

          {/* Right side - Auth buttons or User menu */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newLang = language === 'en' ? 'sw' : 'en'
                setLanguage(newLang)
                if (user) {
                  // Update user language preference
                  const updatedUser = { ...user, language: newLang }
                  setUser(updatedUser)
                  localStorage.setItem('user', JSON.stringify(updatedUser))
                }
              }}
              className="text-sm"
            >
              {language === 'en' ? 'SW' : 'EN'}
            </Button>

            {user ? (
              // User is logged in - show user menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#E32B44] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.first_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block">{user.first_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-gray-500">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      {t('Profile', 'Wasifu')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      {t('Order History', 'Historia ya Maagizo')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/addresses">
                      {t('Addresses', 'Anwani')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    {t('Sign Out', 'Toka')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // User is not logged in - show auth buttons
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">
                    {t('Log in', 'Ingia')}
                  </Link>
                </Button>
                <Button className="bg-[#E32B44] hover:bg-[#E32B44]/90" asChild>
                  <Link href="/signup">
                    {t('Sign up for free delivery', 'Jisajili kwa utoaji bure')}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
