import { NextRequest, NextResponse } from 'next/server';
import { apsModelDerivative } from '@/lib/autodesk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urn, formats } = body;

    if (!urn) {
      return NextResponse.json({ error: 'URN is required' }, { status: 400 });
    }

    const result = await apsModelDerivative.translateModel({
      input: {
        urn,
      },
      output: {
        formats: formats || [{ type: 'svf2', views: ['2d', '3d'] }],
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urn = searchParams.get('urn');
    const action = searchParams.get('action');

    if (!urn) {
      return NextResponse.json({ error: 'URN is required' }, { status: 400 });
    }

    if (action === 'manifest') {
      const manifest = await apsModelDerivative.getManifest(urn);
      return NextResponse.json(manifest);
    }

    if (action === 'metadata') {
      const metadata = await apsModelDerivative.getMetadata(urn);
      return NextResponse.json(metadata);
    }

    if (action === 'poll') {
      const manifest = await apsModelDerivative.pollForCompletion(urn);
      return NextResponse.json(manifest);
    }

    const metadata = await apsModelDerivative.getMetadata(urn);
    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}
