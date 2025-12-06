import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserLayout from '../../layouts/UserLayout'
import { api } from '../../services/api'
import { authService } from '../../services/auth'
import type { BlogPost } from '../../types'

export default function UserBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const isAuthenticated = authService.isAuthenticated()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const data = await api.get<BlogPost[]>('/blog/posts')
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">블로그</h1>
          {isAuthenticated && (
            <button
              onClick={() => navigate('/blog/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              글 작성
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">로딩 중...</div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {posts.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">아직 작성된 글이 없습니다.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <Link to={`/blog/${post.id}`}>
                      <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 mb-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </UserLayout>
  )
}
