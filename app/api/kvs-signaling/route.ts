"use server";

import { NextResponse } from "next/server";
import {
    KinesisVideoClient,
    GetSignalingChannelEndpointCommand,
    DescribeSignalingChannelCommand,
} from "@aws-sdk/client-kinesis-video";
import {
    KinesisVideoSignalingClient,
    GetIceServerConfigCommand,
} from "@aws-sdk/client-kinesis-video-signaling";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

export async function GET() {
    try {
        const region = process.env.AWS_REGION || "eu-west-3";
        const identityPoolId = process.env.AWS_IDENTITY_POOL_ID;
        const channelName = process.env.KVS_CHANNEL_NAME;

        if (!identityPoolId || !channelName) {
            return NextResponse.json(
                { error: "Missing AWS Identity Pool ID or channel name in environment variables" },
                { status: 500 }
            );
        }

        // Get credentials from Cognito Identity Pool (unauthenticated)
        const credentials = fromCognitoIdentityPool({
            identityPoolId,
            clientConfig: { region },
        });

        const kinesisVideoClient = new KinesisVideoClient({
            region,
            credentials,
        });

        // Get channel ARN
        const describeCommand = new DescribeSignalingChannelCommand({
            ChannelName: channelName,
        });
        const channelInfo = await kinesisVideoClient.send(describeCommand);
        const channelARN = channelInfo.ChannelInfo?.ChannelARN;

        if (!channelARN) {
            return NextResponse.json(
                { error: "Could not find signaling channel" },
                { status: 404 }
            );
        }

        // Get signaling channel endpoints
        const getEndpointCommand = new GetSignalingChannelEndpointCommand({
            ChannelARN: channelARN,
            SingleMasterChannelEndpointConfiguration: {
                Protocols: ["WSS", "HTTPS"],
                Role: "VIEWER",
            },
        });
        const endpointResponse = await kinesisVideoClient.send(getEndpointCommand);

        const endpoints: Record<string, string> = {};
        endpointResponse.ResourceEndpointList?.forEach((endpoint) => {
            if (endpoint.Protocol && endpoint.ResourceEndpoint) {
                endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            }
        });

        // Get ICE server configuration
        const kvsSignalingClient = new KinesisVideoSignalingClient({
            region,
            credentials,
            endpoint: endpoints.HTTPS,
        });

        const iceServerCommand = new GetIceServerConfigCommand({
            ChannelARN: channelARN,
        });
        const iceServerResponse = await kvsSignalingClient.send(iceServerCommand);

        // Get actual credentials to pass to client
        const resolvedCredentials = await credentials();

        return NextResponse.json({
            channelARN,
            channelName,
            region,
            endpoints,
            iceServers: iceServerResponse.IceServerList || [],
            credentials: {
                accessKeyId: resolvedCredentials.accessKeyId,
                secretAccessKey: resolvedCredentials.secretAccessKey,
                sessionToken: resolvedCredentials.sessionToken,
            },
        });
    } catch (error) {
        console.error("KVS Signaling Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
