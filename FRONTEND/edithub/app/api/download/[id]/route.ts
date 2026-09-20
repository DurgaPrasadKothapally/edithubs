import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MIME: Record<string,string> = { mp4:'video/mp4',webm:'video/webm',mov:'video/quicktime',mp3:'audio/mpeg',wav:'audio/wav',ogg:'audio/ogg',jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',gif:'image/gif',webp:'image/webp',pdf:'application/pdf',zip:'application/zip',rar:'application/vnd.rar' };
const IS = new Set(['mp4','webm','mov','mp3','wav','ogg','jpg','jpeg','png','gif','webp','pdf']);
const ext = (n: string) => n.split('.').pop()?.toLowerCase() ?? '';
const getMime = (n: string) => MIME[ext(n)] ?? 'application/octet-stream';
const isInline = (n: string) => IS.has(ext(n));

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const type = req.nextUrl.searchParams.get('type') || 'resource';
  try {
    const supabase = await createClient();
    let fileUrl = '', fileName = '', count = 0;
    if (type === 'tutorial_resource') {
      const { data, error } = await supabase.from('tutorial_resources').select('file_url,name,download_count').eq('id',id).single();
      if (error || !data) return NextResponse.json({ error:'Not found' },{ status:404 });
      fileUrl=data.file_url; fileName=data.name; count=data.download_count||0;
      await supabase.from('tutorial_resources').update({ download_count:count+1 }).eq('id',id);
    } else {
      const { data, error } = await supabase.from('resources').select('file_url,file_name,download_count').eq('id',id).single();
      if (error || !data) return NextResponse.json({ error:'Not found' },{ status:404 });
      fileUrl=data.file_url; fileName=data.file_name||'download'; count=data.download_count||0;
      await supabase.from('resources').update({ download_count:count+1 }).eq('id',id);
    }
    const mime=getMime(fileName); const inl=isInline(fileName);
    try {
      const r=await fetch(fileUrl); if(!r.ok) throw new Error('fetch');
      const buf=await r.arrayBuffer();
      const disp=inl?`inline; filename="${fileName}"`:`attachment; filename="${fileName}"`;
      return new NextResponse(buf,{ status:200, headers:{ 'Content-Type':mime,'Content-Disposition':disp,'Content-Length':String(buf.byteLength),'Cache-Control':'public,max-age=3600' } });
    } catch { return NextResponse.json({ url:fileUrl,fileName,mime,inline:inl }); }
  } catch(err){ console.error(err); return NextResponse.json({ error:'Server error' },{ status:500 }); }
}