// app/api/proxy/products/route.js
import { NextResponse } from 'next/server';

// GET products from Express backend
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward the request to Express backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/full-products?${searchParams}`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Forward cookies if needed for authentication
          'Cookie': request.headers.get('cookie') || '',
        },
        // Don't cache API responses
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch products',
        error: error.message 
      },
      { status: 500 }
    );
  }
}