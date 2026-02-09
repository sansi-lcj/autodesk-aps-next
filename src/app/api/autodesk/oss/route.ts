import { NextRequest, NextResponse } from 'next/server';
import { apsOSS } from '@/lib/autodesk';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const bucketKey = searchParams.get('bucketKey');
    const objectKey = searchParams.get('objectKey');
    const startsWith = searchParams.get('startsWith');

    if (action === 'buckets') {
      const buckets = await apsOSS.listBuckets();
      return NextResponse.json({ data: buckets });
    }

    if (action === 'objects' && bucketKey) {
      const objects = await apsOSS.listObjects(bucketKey, startsWith || undefined);
      return NextResponse.json({ data: objects });
    }

    if (action === 'details' && bucketKey && objectKey) {
      const details = await apsOSS.getObjectDetails(bucketKey, objectKey);
      return NextResponse.json(details);
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, bucketKey, objectKey, policyKey, contentType, size } = body;

    if (action === 'createBucket' && bucketKey) {
      const bucket = await apsOSS.createBucket(bucketKey, policyKey);
      return NextResponse.json(bucket);
    }

    if (action === 'getUploadUrl' && bucketKey && objectKey && contentType && size) {
      const uploadInfo = await apsOSS.getSignedUploadUrl(bucketKey, objectKey, contentType, size);
      return NextResponse.json(uploadInfo);
    }

    if (action === 'getDownloadUrl' && bucketKey && objectKey) {
      const downloadUrl = await apsOSS.getSignedDownloadUrl(bucketKey, objectKey);
      return NextResponse.json({ url: downloadUrl });
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bucketKey = searchParams.get('bucketKey');
    const objectKey = searchParams.get('objectKey');

    if (bucketKey && objectKey) {
      await apsOSS.deleteObject(bucketKey, objectKey);
      return NextResponse.json({ success: true });
    }

    if (bucketKey) {
      await apsOSS.deleteBucket(bucketKey);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}
