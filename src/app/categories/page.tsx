"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from 'next/link'

interface Category {
  id: number
  name: string
  name_sw: string
  description: string
  image_url: string
  restaurant_count: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user language preference
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setLanguage(user.language || 'en')
      } catch (error) {
        // Ignore error
      }
    }

    // Mock data for now (will be replaced with API call)
    const mockCategories: Category[] = [
      {
        id: 1,
        name: "Burgers",
        name_sw: "Hamburger",
        description: "Delicious burgers and sandwiches",
        image_url: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        restaurant_count: 15
      },
      {
        id: 2,
        name: "Pizza",
        name_sw: "Pizza",
        description: "Fresh pizzas with various toppings",
        image_url: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
        restaurant_count: 12
      },
      {
        id: 3,
        name: "Japanese",
        name_sw: "Kijapani",
        description: "Authentic Japanese cuisine",
        image_url: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
        restaurant_count: 8
      },
      {
        id: 4,
        name: "Italian",
        name_sw: "Kiitaliano",
        description: "Traditional Italian dishes",
        image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
        restaurant_count: 10
      },
      {
        id: 5,
        name: "Asian",
        name_sw: "Kiasia",
        description: "Various Asian cuisines",
        image_url: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg",
        restaurant_count: 18
      },
      {
        id: 6,
        name: "American",
        name_sw: "Kimarekani",
        description: "Classic American food",
        image_url: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
        restaurant_count: 14
      },
      {
        id: 7,
        name: "Mexican",
        name_sw: "Kimeksiko",
        description: "Spicy and flavorful Mexican dishes",
        image_url: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        restaurant_count: 9
      },
      {
        id: 8,
        name: "Indian",
        name_sw: "Kihindi",
        description: "Aromatic Indian curries and spices",
        image_url: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
        restaurant_count: 11
      },
      {
        id: 9,
        name: "Chinese",
        name_sw: "Kichina",
        description: "Traditional Chinese cuisine",
        image_url: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg",
        restaurant_count: 13
      },
      {
        id: 10,
        name: "Kenyan",
        name_sw: "Kikenya",
        description: "Local Kenyan traditional dishes",
        image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
        restaurant_count: 7
      },
      {
        id: 11,
        name: "Desserts",
        name_sw: "Vitindamlo",
        description: "Sweet treats and desserts",
        image_url: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
        restaurant_count: 6
      },
      {
        id: 12,
        name: "Healthy",
        name_sw: "Chakula cha Afya",
        description: "Nutritious and healthy options",
        image_url: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg",
        restaurant_count: 8
      }
    ]

    setCategories(mockCategories)
    setLoading(false)
  }, [])

  const t = (en: string, sw: string) => language === 'sw' ? sw : en

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('Loading categories...', 'Inapakia makundi...')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('Food Categories', 'Makundi ya Chakula')}
          </h1>
          <p className="text-gray-600">
            {t('Browse restaurants by cuisine type and find your favorite dishes', 'Vinjari migahawa kwa aina ya chakula na upate vyakula unavyovipenda')}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/restaurants?category=${category.name.toLowerCase()}`}>
              <Card className="overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
                <div className="relative h-48">
                  <img
                    src={category.image_url}
                    alt={language === 'sw' ? category.name_sw : category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      {language === 'sw' ? category.name_sw : category.name}
                    </h3>
                    <p className="text-sm opacity-90 mb-2">
                      {category.description}
                    </p>
                    <p className="text-xs opacity-75">
                      {category.restaurant_count} {t('restaurants', 'migahawa')}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Popular Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('Popular Categories', 'Makundi Maarufu')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link key={`popular-${category.id}`} href={`/restaurants?category=${category.name.toLowerCase()}`}>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                  <img
                    src={category.image_url}
                    alt={language === 'sw' ? category.name_sw : category.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {language === 'sw' ? category.name_sw : category.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {category.restaurant_count} {t('places', 'mahali')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#E32B44] mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">
                {t('Food Categories', 'Makundi ya Chakula')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#E32B44] mb-2">
                {categories.reduce((sum, cat) => sum + cat.restaurant_count, 0)}
              </div>
              <div className="text-gray-600">
                {t('Partner Restaurants', 'Migahawa Washirika')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#E32B44] mb-2">
                50+
              </div>
              <div className="text-gray-600">
                {t('Cities Served', 'Miji Inayohudumika')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
