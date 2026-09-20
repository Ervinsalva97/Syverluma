import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_FIREBASE_API_KEY no configurado' }, { status: 500 });
    }

    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + apiKey;

    const verifyRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!verifyRes.ok) {
      const errorData = await verifyRes.json().catch(() => ({}));
      console.error('🔥 Token de Firebase inválido:', errorData);
      return NextResponse.json({ error: 'Token no autorizado o expirado' }, { status: 401 });
    }

    const userData = await verifyRes.json();
    const user = userData.users?.[0];

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const expiresIn = 60 * 60 * 24 * 5; // 5 días en segundos
    const cookieStore = await cookies();
    
    cookieStore.set('syverluma_session', idToken, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ 
      status: 'success', 
      user: {
        uid: user.localId,
        email: user.email,
        emailVerified: user.emailVerified,
      } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 Error interno en el servidor de autenticación:", error);
    return NextResponse.json({ error: 'Error del servidor', details: String(error?.message || error) }, { status: 500 });
  }
}