import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import UserLayout from '../../layouts/UserLayout'
import { api } from '../../services/api'
import type { Product } from '../../types'

export default function UserCheckout() {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product as Product

  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  if (!product) {
    navigate('/inventory')
    return null
  }

  const totalPrice = product.price * quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > product.stock) {
      alert(`재고가 ${product.stock}개만 남았습니다.`)
      return
    }
    setQuantity(newQuantity)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/orders', {
        productId: product.id,
        quantity,
        totalPrice,
      })

      alert('주문이 완료되었습니다!')
      navigate('/inventory')
    } catch (error) {
      console.error('Failed to create order:', error)
      alert('주문에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">주문하기</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg">
                      <svg className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                {product.description && (
                  <p className="text-gray-700 mb-4">{product.description}</p>
                )}
                <div className="mb-6">
                  <p className="text-sm text-gray-500">단가</p>
                  <p className="text-2xl font-bold text-indigo-600">{product.price.toLocaleString()}원</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      수량
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-20 text-center border border-gray-300 rounded-md py-2"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">재고: {product.stock}개</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">수량</span>
                      <span className="text-gray-900">{quantity}개</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">단가</span>
                      <span className="text-gray-900">{product.price.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-lg font-bold text-gray-900">총 금액</span>
                      <span className="text-2xl font-bold text-indigo-600">{totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? '주문 중...' : '주문하기'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/inventory')}
                      className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md border border-gray-300"
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
