import { NextRequest, NextResponse } from 'next/server';
import { apsDataManagement } from '@/lib/autodesk';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'hubs') {
      const hubs = await apsDataManagement.listHubs();
      return NextResponse.json({ data: hubs });
    }

    const hubId = searchParams.get('hubId');
    const projectId = searchParams.get('projectId');
    const folderId = searchParams.get('folderId');

    if (action === 'projects' && hubId) {
      const projects = await apsDataManagement.listProjects(hubId);
      return NextResponse.json({ data: projects });
    }

    if (action === 'folders' && hubId && projectId) {
      if (folderId) {
        const contents = await apsDataManagement.getFolderContents(projectId, folderId);
        return NextResponse.json({ data: contents });
      }
      const folders = await apsDataManagement.getTopFolders(hubId, projectId);
      return NextResponse.json({ data: folders });
    }

    if (action === 'versions' && projectId) {
      const itemId = searchParams.get('itemId');
      if (itemId) {
        const versions = await apsDataManagement.getItemVersions(projectId, itemId);
        return NextResponse.json({ data: versions });
      }
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
