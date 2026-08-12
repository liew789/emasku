const BNM_BASE = 'https://api.bnm.gov.my/public'
const ACCEPT = 'application/vnd.BNM.API.v1+json'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
  }
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  if (context.request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  }

  const url = new URL(context.request.url)
  const parts = context.params.path
  const suffix = Array.isArray(parts)
    ? parts.join('/')
    : typeof parts === 'string'
      ? parts
      : ''

  const target = suffix ? `${BNM_BASE}/${suffix}${url.search}` : `${BNM_BASE}${url.search}`

  try {
    const upstream = await fetch(target, {
      headers: {
        Accept: ACCEPT,
        'User-Agent': 'MyEmas-Cloudflare-Proxy/1.0',
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
    console.log('cwlog: BNM proxy failed', error)
    return new Response(JSON.stringify({ error: 'BNM proxy failed', target }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  }
}
