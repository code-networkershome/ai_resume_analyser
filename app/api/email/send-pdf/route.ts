import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendReportEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            pdfBase64,
            targetRole,
            atsScore,
            summaryVerdict,
            reportUrl,
            keyIssues,
            topPriorities
        } = body;

        if (!pdfBase64) {
            return NextResponse.json({ error: "No PDF data provided" }, { status: 400 });
        }

        // Convert base64 to Buffer
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        console.log(`[Email API] Sending high-fidelity client-generated PDF report to ${session.user.email}...`);

        const result = await sendReportEmail({
            userEmail: session.user.email as string,
            userName: session.user.name as string,
            targetRole,
            experienceLevel: "Professional", // Fallback or pass from client
            atsScore,
            summaryVerdict: summaryVerdict || 'Your resume analysis is complete.',
            reportUrl,
            keyIssues,
            topPriorities,
            pdfBuffer,
        });

        if (result.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }
    } catch (error) {
        console.error("[Email API] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
