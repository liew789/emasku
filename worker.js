const BNM_BASE = 'https://api.bnm.gov.my/public'
const ACCEPT = 'application/vnd.BNM.API.v1+json'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
  }
}

async function proxyBnm(request, url) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    })
  }

  if (request.method !== 'GET') {
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405, headers: corsHeaders() },
    )
  }

  const suffix = url.pathname.replace(/^\/api\/bnm\/?/, '')
  const target = suffix ? `${BNM_BASE}/${suffix}${url.search}` : `${BNM_BASE}${url.search}`

  try {
    const upstream = await fetch(target, {
      headers: {
        Accept: ACCEPT,
        'User-Agent': 'MyEmas-Worker-Proxy/1.0',
      },
    })

    const body = await upstream.text()

    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'public, max-age=300',
        ...corsHeaders(),
      },
    })
  } catch (error) {
    console.log('cwlog: BNM worker proxy failed', error)
    return Response.json(
      { error: 'BNM proxy failed', target },
      { status: 502, headers: corsHeaders() },
    )
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Must handle API before SPA asset fallback.
    if (url.pathname === '/api/bnm' || url.pathname.startsWith('/api/bnm/')) {
      return proxyBnm(request, url)
    }

    return env.ASSETS.fetch(request)
  },
}
