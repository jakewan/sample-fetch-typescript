type Header = [string, string]

interface CanFetch {
    doFetch(url: string, headers: Header[], mode: RequestMode): Promise<Response>
}

class Fetcher implements CanFetch {
    doFetch(url: string, headers: Header[], mode: RequestMode = 'cors'): Promise<Response> {
        const requestInit: RequestInit = {
            mode,
        }
        const request = new Request(url, requestInit)
        headers.forEach(pair => request.headers.append(...pair))
        return fetch(request)
    }
}

export { Fetcher }
