"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    language: 'en'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(formData.language === 'sw' ? 'Nenosiri hazifanani' : 'Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          language: formData.language,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
        // Redirect to home page
        router.push('/')
      } else {
        setError(formData.language === 'sw' ? data.message_sw : data.message)
      }
    } catch (error) {
      setError(formData.language === 'sw' ? 'Hitilafu ya mtandao' : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const t = (en: string, sw: string) => formData.language === 'sw' ? sw : en

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-[#E32B44]">
              {t('Join BiteBantu', 'Jiunge na BiteBantu')}
            </CardTitle>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="sw">SW</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            {t('Create your account to start ordering delicious food', 'Unda akaunti yako kuanza kuagiza chakula kitamu')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  {t('First Name', 'Jina la Kwanza')}
                </Label>
                <Input
                  id="first_name"
                  placeholder={t('John', 'Juma')}
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">
                  {t('Last Name', 'Jina la Mwisho')}
                </Label>
                <Input
                  id="last_name"
                  placeholder={t('Doe', 'Mwalimu')}
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {t('Email', 'Barua pepe')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('john@example.com', 'juma@mfano.com')}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                {t('Phone Number', 'Nambari ya Simu')}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('+254 700 000 000', '+254 700 000 000')}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {t('Password', 'Nenosiri')}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t('Enter your password', 'Ingiza nenosiri lako')}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t('Confirm Password', 'Thibitisha Nenosiri')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('Confirm your password', 'Thibitisha nenosiri lako')}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-[#E32B44] hover:bg-[#E32B44]/90"
              disabled={loading}
            >
              {loading ? t('Creating account...', 'Inaunda akaunti...') : t('Create Account', 'Unda Akaunti')}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('Already have an account?', 'Tayari una akaunti?')}{' '}
              <Link href="/login" className="text-[#E32B44] hover:underline">
                {t('Sign in', 'Ingia')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
