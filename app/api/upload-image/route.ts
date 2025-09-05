import { NextRequest, NextResponse } from 'next/server';
import { uploadImageFromBase64 } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, base64Data } = body;

    if (!filename || !base64Data) {
      return NextResponse.json(
        { error: 'filename and base64Data are required' },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!base64Data.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid base64 image format' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = filename.split('.').pop() || 'png';
    const uniqueFilename = `image_${timestamp}.${extension}`;

    const publicUrl = await uploadImageFromBase64(uniqueFilename, base64Data);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}