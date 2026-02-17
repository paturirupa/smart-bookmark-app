import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Bookmarks({ user }) {
  const [bookmarks, setBookmarks] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const fetchBookmarks = useCallback(async () => {
    if (!user?.id) return
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
      return
    }

    setBookmarks(data || [])
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    
    fetchBookmarks()
    
    // Poll for updates every 2 seconds for real-time sync across tabs
    const interval = setInterval(() => {
      fetchBookmarks()
    }, 2000)

    return () => clearInterval(interval)
  }, [user?.id, fetchBookmarks])

  const addBookmark = async () => {
    if (!title || !url) return

    const { error } = await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id
      }
    ])

    if (error) {
      console.error('Error adding bookmark:', error)
      alert('Error adding bookmark: ' + error.message)
      return
    }
    
    setTitle('')
    setUrl('')
    await fetchBookmarks()
  }

  const deleteBookmark = async (id) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    
    if (error) {
      console.error('Error deleting bookmark:', error)
      alert('Error deleting bookmark: ' + error.message)
      return
    }
    
    await fetchBookmarks()
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Bookmarks</h2>
        <p className="text-gray-600">Manage and organize all your saved links</p>
      </div>

      {/* Add Bookmark Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-10 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V9.5m-13-4h10M8 13h4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Add New Bookmark</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., My Awesome Project"
              className="w-full border-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full border-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-black"
            />
          </div>
        </div>
        <button
          onClick={addBookmark}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
          </svg>
          Save Bookmark
        </button>
      </div>

      {/* Bookmarks List */}
      <div>
        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No bookmarks yet</p>
            <p className="text-gray-400">Start by adding your first bookmark above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookmarks.map(b => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border-l-4 border-blue-500 transition-all duration-200 transform hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-blue-600 hover:text-blue-800 break-words line-clamp-2 transition-colors"
                    >
                      {b.title}
                    </a>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h3.586L9.293 9.293a1 1 0 001.414 1.414L16 6.414V10a1 1 0 102 0V4a1 1 0 00-1-1h-6z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-4 truncate hover:text-gray-600 cursor-pointer" title={b.url}>
                  {b.url}
                </p>
                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                  </svg>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
