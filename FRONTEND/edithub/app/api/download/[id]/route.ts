import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get('type') || 'resource';

  try {
    const supabase = await createClient();

    if (type === 'tutorial_resource') {
      // Fetch the tutorial resource
      const { data, error } = await supabase
        .from('tutorial_resources')
        .select('file_url, name, download_count')
        .eq('id', id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      // Increment download count
      await supabase
        .from('tutorial_resources')
        .update({ download_count: (data.download_count || 0) + 1 })
        .eq('id', id);

      return NextResponse.json({ url: data.file_url });
    } else {
      // Fetch standalone resource
      const { data, error } = await supabase
        .from('resources')
        .select('file_url, file_name, download_count')
        .eq('id', id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      // Increment download count
      await supabase
        .from('resources')
        .update({ download_count: (data.download_count || 0) + 1 })
        .eq('id', id);

      return NextResponse.json({ url: data.file_url });
    }
  } catch (err) {
    console.error('Download error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
