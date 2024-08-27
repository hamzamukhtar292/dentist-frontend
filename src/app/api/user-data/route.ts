// src/app/api/user-data/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ name: 'John Doe', email: 'johndoe@example.com' });
}
