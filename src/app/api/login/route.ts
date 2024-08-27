// src/app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Validate email and password (this is a placeholder; replace with real validation)
  if (email === 'user@example.com' && password === 'password') {
    const token = 'fake-jwt-token'; // Replace with real JWT generation
    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
