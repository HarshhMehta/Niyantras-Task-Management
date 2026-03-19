import { useState, useEffect, useCallback } from 'react'

// Better error messages based on error type
function parseError(err) {
  if (!navigator.onLine) return 'No internet connection. Please check your network.'

  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }

  const status = err.response?.status
  if (status === 400) return 'Bad request. Please check your input.'
  if (status === 401) return 'Unauthorized. Please log in again.'
  if (status === 403) return 'Access denied.'
  if (status === 404) return 'Data not found.'
  if (status === 500) return 'Server error. Please try again later.'
  if (status === 503) return 'Service unavailable. Please try again later.'

  if (err.message === 'Network Error') return 'Network error. Please check your connection.'

  return err.message || 'Something went wrong. Please try again.'
}

const useFetch = (apiFn, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiFn()
        if (!cancelled) setData(response.data)
      } catch (err) {
        if (!cancelled) setError(parseError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [...deps, retryCount])

  // Auto retry when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (error) setRetryCount(c => c + 1)
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [error])

  const retry = () => setRetryCount(c => c + 1)

  return { data, loading, error, retry }
}

export default useFetch