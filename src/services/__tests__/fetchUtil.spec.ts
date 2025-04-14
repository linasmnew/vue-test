import { describe, it, expect, vi, beforeEach } from 'vitest'
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

  describe('fetchJSON', () => {
    describe('when given an endpoint without options', () => {
      it('should fetch endpoint with default options', async () => {
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
    })

    describe('when given an endpoint with options', () => {
      it('should fetch endpoint with options', async () => {
        const endpoint = '/test-endpoint'
        const options = {
          headers: {
            'Authorization': 'Bearer token123'
          }
        }

        await fetchJSON(endpoint, options)

        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer token123'
          }
        })
      })
    })

    describe('response', () => {
      describe('when response is ok', () => {
        it('should return the json response', async () => {
          const endpoint = '/test-endpoint'
          const result = await fetchJSON(endpoint)

          expect(result).toEqual(mockResponse)
        })
      })

      describe('when response is not ok', () => {
        describe('when response is 5xx', () => {
          it('should throw a custom fetch error', async () => {
            const endpoint = '/test-endpoint'
            mockFetch.mockResolvedValueOnce({
              ok: false,
              status: 500,
              json: () => Promise.resolve()
            } as Response)

            await expect(fetchJSON(endpoint)).rejects.toSatisfy((error: FetchError) => {
              expect(error.message).toBe('Something went wrong, please try again later')
              expect(error.status).toBe(500)
              expect(error.details).toBeUndefined()
              return true
            })
          })
        })

        describe('when response is 404', () => {
          it('should throw a custom fetch error', async () => {
            const endpoint = '/test-endpoint'
            mockFetch.mockResolvedValueOnce({
              ok: false,
              status: 404,
              json: () => Promise.resolve({ message: 'Resource not found', details: { name: ['Resource not found'] } })
            } as Response)

            await expect(fetchJSON(endpoint)).rejects.toSatisfy((error: FetchError) => {
              expect(error.message).toBe('Resource not found')
              expect(error.status).toBe(404)
              expect(error.details).toEqual({ name: ['Resource not found'] })
              return true
            })
          })
        })

        describe('when response is 4xx', () => {
          it('should throw a custom fetch error', async () => {
            const endpoint = '/test-endpoint'
            mockFetch.mockResolvedValueOnce({
              ok: false,
              status: 400,
              json: () => Promise.resolve({ message: 'The request could not be processed.', details: { id: ['id must be an integer number'] } })
            } as Response)

            await expect(fetchJSON(endpoint)).rejects.toSatisfy((error: FetchError) => {
              expect(error.message).toBe('The request could not be processed.')
              expect(error.status).toBe(400)
              expect(error.details).toEqual({ id: ['id must be an integer number'] })
              return true
            })
          })
        })

      })
    })
  })

  describe('postJSON', () => {
    describe('when given an endpoint with data and no options', () => {
      it('should post data to endpoint with default options', async () => {
        const endpoint = '/test-endpoint'
        const data = { name: 'Test', value: 123 }
        await postJSON(endpoint, data)

        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data)
        })
      })
    })

    describe('when given an endpoint with data and options', () => {
      it('should post data to endpoint with options', async () => {
        const endpoint = '/test-post'
        const data = { name: 'Test', value: 123 }
        const options = {
          headers: {
            'Authorization': 'Bearer token123'
          }
        }
        await postJSON(endpoint, data, options)

        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer token123'
          },
          body: JSON.stringify(data)
        })
      })
    })

    describe('response', () => {
      describe('when response is ok', () => {
        it('should return the json response', async () => {
          const endpoint = '/test-endpoint'
          const data = { name: 'Test', value: 123 }
          const result = await postJSON(endpoint, data)

          expect(result).toEqual(mockResponse)
        })
      })

      describe('when response is not ok', () => {
        describe('when response is 5xx', () => {
          it('should throw a custom fetch error', async () => {
            const endpoint = '/test-endpoint'
            const data = { name: 'Test', value: 123 }
            mockFetch.mockResolvedValueOnce({
              ok: false,
              status: 500,
              json: () => Promise.resolve()
            } as Response)

            await expect(postJSON(endpoint, data)).rejects.toSatisfy((error: FetchError) => {
              expect(error.message).toBe('Something went wrong, please try again later')
              expect(error.status).toBe(500)
              expect(error.details).toBeUndefined()
              return true
            })
          })
        })

        describe('when response is 404', () => {
          it('should throw a custom fetch error', async () => {
            const endpoint = '/test-endpoint'
            const data = { name: 'Test', value: 123 }
            mockFetch.mockResolvedValueOnce({
              ok: false,
              status: 404,
              json: () => Promise.resolve({ message: 'Resource not found', details: { name: ['Resource not found'] } })
            } as Response)

            await expect(postJSON(endpoint, data)).rejects.toSatisfy((error: FetchError) => {
              expect(error.message).toBe('Resource not found')
              expect(error.status).toBe(404)
              expect(error.details).toEqual({ name: ['Resource not found'] })
              return true
            })
          })
        })

        describe('when response is 4xx', () => {
          it('should throw a custom fetch error', async () => {
            const endpoint = '/test-endpoint'
            const data = { name: 'Test', value: 123 }
            mockFetch.mockResolvedValueOnce({
              ok: false,
              status: 400,
              json: () => Promise.resolve({ message: 'The request could not be processed.', details: { id: ['id must be an integer number'] } })
            } as Response)

            await expect(postJSON(endpoint, data)).rejects.toSatisfy((error: FetchError) => {
              expect(error.message).toBe('The request could not be processed.')
              expect(error.status).toBe(400)
              expect(error.details).toEqual({ id: ['id must be an integer number'] })
              return true
            })
          })
        })

      })
    })


  })
})
