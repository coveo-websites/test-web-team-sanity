import {draftMode} from 'next/headers'
import {NextResponse, type NextRequest} from 'next/server'

export async function GET(request: NextRequest) {
  ;(await draftMode()).disable()
  // Only redirect to paths on this site.
  const to = request.nextUrl.searchParams.get('redirect') ?? '/'
  const safe = to.startsWith('/') && !to.startsWith('//') ? to : '/'
  return NextResponse.redirect(new URL(safe, request.url))
}
