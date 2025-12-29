import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { command } = body;

        if (!['forward', 'backward', 'left', 'right', 'stop'].includes(command)) {
            return NextResponse.json({ error: 'Invalid command' }, { status: 400 });
        }

        // Simulate AWS Lambda invocation delay
        await new Promise(resolve => setTimeout(resolve, 200));

        console.log(`[Mock Lambda Trigger] Movement command sent: ${command}`);

        return NextResponse.json({
            success: true,
            message: `Executed command: ${command}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process command' }, { status: 500 });
    }
}
