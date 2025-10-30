import { NextResponse } from 'next/server';
import { getCategoryNameById } from '@/utils/data/categories';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('id');

  if (!categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  try {
    const categoryName = await getCategoryNameById(categoryId);
    return NextResponse.json({ name: categoryName });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category name' }, { status: 500 });
  }
}