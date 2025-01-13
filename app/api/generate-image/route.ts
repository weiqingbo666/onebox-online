import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = "sk-1bc48e8906a5465ab239fd699d25f5b1";
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: '缺少必要的参数' },
        { status: 400 }
      );
    }

    if (!DASHSCOPE_API_KEY) {
      return NextResponse.json(
        { success: false, error: '未配置 API Key' },
        { status: 500 }
      );
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'X-DashScope-Async': 'enable'
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          prompt: prompt
        },
        parameters: {
          style: '<auto>',
          size: '1024*1024',
          n: 1
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.output?.task_id) {
      return NextResponse.json({
        success: true,
        taskId: data.output.task_id
      });
    } else {
      throw new Error('No task ID in response');
    }

  } catch (error) {
    console.error('Error in generate-image API:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
