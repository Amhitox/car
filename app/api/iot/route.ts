import { NextResponse } from 'next/server';

export async function GET() {
    // Simulate fetching AWS IoT credentials
    return NextResponse.json({
        endpoint: "a3xxx-ats.iot.us-east-1.amazonaws.com",
        clientId: "pibot-dashboard-" + Math.random().toString(36).substring(7),
        region: "us-east-1",
        credentials: {
            accessKeyId: "mock-access-key",
            secretAccessKey: "mock-secret-key",
            sessionToken: "mock-session-token",
            expiration: new Date(Date.now() + 3600 * 1000).toISOString()
        }
    });
}
