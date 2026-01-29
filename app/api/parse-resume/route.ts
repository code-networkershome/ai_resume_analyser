import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { extractResumeFromFile } from "@/lib/parse-resume";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "Missing or invalid file" },
                { status: 400 }
            );
        }

        const lowerName = file.name.toLowerCase();
        if (!lowerName.endsWith(".pdf") && !lowerName.endsWith(".docx")) {
            return NextResponse.json(
                { error: "Only PDF and DOCX files are supported" },
                { status: 400 }
            );
        }

        const { text, insights } = await extractResumeFromFile(file);

        if (!text || text.trim().length < 50) {
            return NextResponse.json(
                { error: "Could not reliably extract text from file. Try pasting manually." },
                { status: 422 }
            );
        }

        return NextResponse.json({
            resumeText: text,
            parsingInsights: insights,
        });
    } catch (error: any) {
        console.error("Parse Resume API Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

