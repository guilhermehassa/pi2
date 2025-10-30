import { NextResponse } from 'next/server';
import { deliveries } from '@/utils/data/delivery';

export async function GET() {
  try {
    const deliveryOptions = await deliveries();
    return NextResponse.json(deliveryOptions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deliveries' }, { status: 500 });
  }
}