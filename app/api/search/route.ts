import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { SearchService } from '@/features/search/search.service';
import { globalSearchSchema } from '@/features/search/search.validation';

/**
 * Utility to reliably extract the authenticated user ID from HttpOnly cookies.
 */
async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate incoming global search payload heavily
    const parsed = globalSearchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', details: parsed.error.format() }, 
        { status: 400 }
      );
    }

    const { query, filters, pagination } = parsed.data;

    // Execute the unified service pipeline
    const searchData = await SearchService.globalSearch(userId, query, filters, pagination);

    return NextResponse.json(
      { 
        success: true, 
        data: searchData,
        pagination: {
          currentPage: pagination?.page || 1,
          itemsPerPage: pagination?.limit || 20,
          totalItems: searchData.totalCount,
          totalPages: Math.ceil(searchData.totalCount / (pagination?.limit || 20)),
          hasNextPage: searchData.totalCount > (pagination?.page || 1) * (pagination?.limit || 20)
        }
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
