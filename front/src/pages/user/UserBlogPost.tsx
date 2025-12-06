import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UserLayout from '../../layouts/UserLayout'
import { api } from '../../services/api'
import { authService } from '../../services/auth'
import type { BlogPost } from '../../types'

export default function UserBlogPost() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })

  const user = authService.getCurrentUser()
  const isAuthor = user?.id === post?.authorId

  useEffect(() => {
    if (id === 'new') {
      setIsEditing(true)
      setLoading(false)
    } else {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    if (!id || id === 'new') return

    try {
      const data = await api.get<BlogPost>(`/blog/posts/${id}`)
      setPost(data)
      setFormData({
        title: data.title,
        content: data.content,
      })
    } catch (error) {
      console.error('Failed to fetch post:', error)
      alert('게시글을 불러오는데 실패했습니다.')
      navigate('/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (id === 'new') {
        await api.post('/blog/posts', formData)
        alert('게시글이 작성되었습니다.')
      } else {
        await api.put(`/blog/posts/${id}`, formData)
        alert('게시글이 수정되었습니다.')
      }
      navigate('/blog')
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('게시글 저장에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await api.delete(`/blog/posts/${id}`)
      alert('게시글이 삭제되었습니다.')
      navigate('/blog')
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                제목
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                내용
              </label>
              <textarea
                id="content"
                rows={15}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {id === 'new' ? '작성' : '수정'}
              </button>
            </div>
          </form>
        ) : (
          <article className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{post?.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>{post?.author}</span>
                <span className="mx-2">·</span>
                <span>{post?.createdAt && new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{post?.content}</p>
              </div>

              {isAuthor && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </article>
        )}

        <div className="mt-6">
          <button
            onClick={() => navigate('/blog')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            ← 목록으로 돌아가기
          </button>
        </div>
      </div>
    </UserLayout>
  )
}
