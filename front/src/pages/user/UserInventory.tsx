import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserLayout from '../../layouts/UserLayout'
import { api } from '../../services/api'
import { authService } from '../../services/auth'
import type { Product } from '../../types'

export default function UserInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const navigate = useNavigate()

  const categories = ['전체', '소주', '맥주', '막걸리', '와인', '위스키']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await api.get<Product[]>('/products')
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts =
    selectedCategory === '전체'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const handlePurchase = (product: Product) => {
    if (!authService.isAuthenticated()) {
      alert('로그인이 필요합니다.')
      navigate('/auth')
      return
    }

    navigate('/checkout', { state: { product } })
  }

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">재고</h1>

        <div className="mb-8">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">상품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                      <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-indigo-600">{product.price.toLocaleString()}원</span>
                    <span
                      className={`text-sm ${
                        product.stock > 10 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      재고 {product.stock}개
                    </span>
                  </div>
                  <button
                    onClick={() => handlePurchase(product)}
                    disabled={product.stock === 0}
                    className={`mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      product.stock === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                  >
                    {product.stock === 0 ? '품절' : '구매하기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  )
}
