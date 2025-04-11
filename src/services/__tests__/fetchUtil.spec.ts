import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchJSON, postJSON } from '../fetchUtil'
import { API_BASE_URL } from '../config'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('fetchUtil', () => {
  const mockResponse = { data: 'mock data' }
  const mockJsonPromise = Promise.resolve(mockResponse)
  const mockFetchResponse = {
    json: () => mockJsonPromise,
    ok: true,
    status: 200
  } as unknown as Response

  beforeEach(() => {
    mockFetch.mockReset()
    mockFetch.mockResolvedValue(mockFetchResponse)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('fetchJSON', () => {
    it('should call fetch with the correct URL and options', async () => {
      const endpoint = '/test-endpoint'

      await fetchJSON(endpoint)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
    })

    it('should merge custom headers with default headers', async () => {
      const endpoint = '/test-endpoint'
      const customOptions = {
        headers: {
          'Authorization': 'Bearer token123'
        }
      }

      await fetchJSON(endpoint, customOptions)

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer token123'
        }
      })
    })

    it('should return the json response', async () => {
      const endpoint = '/test-endpoint'

      const result = await fetchJSON(endpoint)

      expect(result).toEqual(mockResponse)
    })

    it('should handle fetch errors properly', async () => {
      const endpoint = '/error-endpoint'
      const errorMessage = 'Network error'

      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      await expect(fetchJSON(endpoint)).rejects.toThrow(errorMessage)
    })

    it('should handle 404 error responses', async () => {
      const endpoint = '/not-found'
      const message = 'Resource not found'
      const details = { name: ['Resource not found'] }
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message, details })
      } as Response)

      await expect(fetchJSON(endpoint)).rejects.toThrow(message)
    })

    it('should handle client error responses', async () => {
      const endpoint = '/bad-request'
      const errorMessage = 'Invalid request format'
      const errorDetails = { email: ['Invalid email format'] }

      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: errorMessage, details: errorDetails })
      } as Response)

      await expect(fetchJSON(endpoint)).rejects.toThrow(errorMessage)
    })

    it('should handle server error responses', async () => {
      const endpoint = '/server-error'
      const defaultErrorMessage = 'Something went wrong, please try again later'

      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({})
      } as Response)

      await expect(fetchJSON(endpoint)).rejects.toThrow(defaultErrorMessage)
    })
  })

  describe('postJSON', () => {
    it('should call fetch with POST method and stringified body', async () => {
      const endpoint = '/test-post'
      const data = { name: 'Test', value: 123 }

      await postJSON(endpoint, data)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
    })

    it('should merge custom options with default options', async () => {
      const endpoint = '/test-post'
      const data = { name: 'Test' }
      const customOptions = {
        headers: {
          'X-Custom-Header': 'custom-value'
        },
        credentials: 'include' as RequestCredentials
      }

      await postJSON(endpoint, data, customOptions)

      expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Custom-Header': 'custom-value'
        },
        credentials: 'include'
      })
    })

    it('should return the json response', async () => {
      const endpoint = '/test-post'
      const data = { name: 'Test' }

      const result = await postJSON(endpoint, data)

      expect(result).toEqual(mockResponse)
    })

    it('should handle error responses in POST requests', async () => {
      const endpoint = '/bad-post'
      const data = { name: 'Test' }
      const errorMessage = 'Invalid data provided'
      const errorDetails = { name: ['Name too short'] }

      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: errorMessage, details: errorDetails })
      } as Response)

      await expect(postJSON(endpoint, data)).rejects.toThrow(errorMessage)
    })
  })
})
