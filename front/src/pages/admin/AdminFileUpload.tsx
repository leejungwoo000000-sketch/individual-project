import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { api } from '../../services/api'
import type { FileUpload } from '../../types'

export default function AdminFileUpload() {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const data = await api.get<FileUpload[]>('/admin/files')
      setFiles(data)
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadedFile = await api.uploadFile<FileUpload>('/admin/files/upload', selectedFile)
      setFiles([uploadedFile, ...files])
      alert('파일 업로드가 완료되었습니다.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
      alert('파일 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await api.delete(`/admin/files/${id}`)
      setFiles(files.filter((file) => file.id !== id))
    } catch (error) {
      console.error('Failed to delete file:', error)
      alert('파일 삭제에 실패했습니다.')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">파일 업로드</h1>
            <p className="mt-2 text-sm text-gray-700">파일을 업로드하고 관리합니다.</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">파일 업로드</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>업로드할 파일을 선택하세요.</p>
              </div>
              <div className="mt-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    disabled:opacity-50"
                />
                {uploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">업로드 중...</span>
                      <span className="text-sm text-gray-700">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">업로드된 파일 목록</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {files.length === 0 ? (
                <li className="px-4 py-8 text-center text-gray-500">
                  업로드된 파일이 없습니다.
                </li>
              ) : (
                files.map((file) => (
                  <li key={file.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <svg className="h-8 w-8 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(file.fileSize)} · 업로드: {new Date(file.uploadedAt).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">업로드: {file.uploadedBy}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <a
                            href={file.fileUrl}
                            download
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            다운로드
                          </a>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
