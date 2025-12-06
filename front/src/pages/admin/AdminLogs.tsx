import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { api } from '../../services/api'
import type { ChatLog, DownloadLog } from '../../types'

export default function AdminLogs() {
  const [activeTab, setActiveTab] = useState<'chat' | 'download'>('chat')
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([])
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [activeTab])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      if (activeTab === 'chat') {
        const data = await api.get<ChatLog[]>('/admin/logs/chat')
        setChatLogs(data)
      } else {
        const data = await api.get<DownloadLog[]>('/admin/logs/download')
        setDownloadLogs(data)
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">로그 관리</h1>
            <p className="mt-2 text-sm text-gray-700">채팅 로그와 파일 다운로드 로그를 확인합니다.</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('chat')}
                className={`${
                  activeTab === 'chat'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                채팅 로그
              </button>
              <button
                onClick={() => setActiveTab('download')}
                className={`${
                  activeTab === 'download'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                다운로드 로그
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">로딩 중...</div>
            </div>
          ) : activeTab === 'chat' ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {chatLogs.length === 0 ? (
                  <li className="px-4 py-8 text-center text-gray-500">
                    채팅 로그가 없습니다.
                  </li>
                ) : (
                  chatLogs.map((log) => (
                    <li key={log.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600">{log.userName}</p>
                            <p className="text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>
                          </div>
                          <p className="mt-2 text-sm text-gray-700">{log.message}</p>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {downloadLogs.length === 0 ? (
                  <li className="px-4 py-8 text-center text-gray-500">
                    다운로드 로그가 없습니다.
                  </li>
                ) : (
                  downloadLogs.map((log) => (
                    <li key={log.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                          </div>
                          <div className="ml-4 min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{log.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {log.userName} · {new Date(log.downloadedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
