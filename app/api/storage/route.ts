import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const client = new S3Client({
    region: "us-east-1",
    endpoint: "https://ynfumltvultubcyvahbb.storage.supabase.co/storage/v1/s3",
    credentials: {
        accessKeyId: "8e7c34806542f0732b02bb5c3424a1d4",
        secretAccessKey: "fbfc03e7b1998fcbd821018bbb6ee1ee33df08c005539f8f785daa500731d45c"
    },
    forcePathStyle: true
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!key) {
        return new NextResponse("Missing key", { status: 400 });
    }

    try {
        const bucketName = "GEOTUCO storage";
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const response = await client.send(command);

        if (!response.Body) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Determine Content-Type
        let contentType = response.ContentType;
        if (!contentType || contentType === 'application/octet-stream') {
            if (key.endsWith('.webp')) contentType = 'image/webp';
            else if (key.endsWith('.png')) contentType = 'image/png';
            else if (key.endsWith('.jpg') || key.endsWith('.jpeg')) contentType = 'image/jpeg';
        }

        // Convert to buffer to ensure data integrity
        const bytes = await response.Body.transformToByteArray();

        return new NextResponse(bytes, {
            headers: {
                "Content-Type": contentType || "image/webp",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });

    } catch (error: any) {
        console.error("S3 Proxy Error:", error);
        return new NextResponse(`Error fetching image: ${error.message}`, { status: 500 });
    }
}
