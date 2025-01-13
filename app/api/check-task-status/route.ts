import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = "sk-1bc48e8906a5465ab239fd699d25f5b1";
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks';

export async function GET(req: NextRequest) {
  try {
    const taskId = req.nextUrl.searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: '缺少任务ID' },
        { status: 400 }
      );
    }

    if (!DASHSCOPE_API_KEY) {
      return NextResponse.json(
        { success: false, error: '未配置 API Key' },
        { status: 500 }
      );
    }

    const response = await fetch(`${API_URL}/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const taskStatus = data.output?.task_status;
    const imageUrl = data.output?.results?.[0]?.url;

    return NextResponse.json({
      success: true,
      status: taskStatus,
      ...(imageUrl && { imageUrl })
    });

  } catch (error) {
    console.error('Error in check-task-status API:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
