import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReportEmailData {
    userEmail: string;
    userName?: string;
    targetRole: string;
    experienceLevel: string;
    atsScore: number;
    summaryVerdict: string;
    reportUrl: string;
    keyIssues?: string[];
    topPriorities?: string[];
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function sendReportEmail(data: ReportEmailData) {
    const {
        userEmail,
        userName,
        targetRole,
        experienceLevel,
        atsScore,
        summaryVerdict,
        reportUrl,
        keyIssues = [],
        topPriorities = [],
    } = data;

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'team@mail.networkershome.com';
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'ResumeAI';

    // Score-based styling
    const scoreColor = atsScore >= 70 ? '#22c55e' : atsScore >= 50 ? '#eab308' : '#ef4444';
    const scoreLabel = atsScore >= 70 ? 'Strong' : atsScore >= 50 ? 'Needs Work' : 'Critical';

    // SANITIZE INPUTS
    const safeUserName = userName ? escapeHtml(userName) : '';
    const safeTargetRole = escapeHtml(targetRole);
    const safeExperience = escapeHtml(experienceLevel);
    const safeVerdict = escapeHtml(summaryVerdict);

    const issuesHtml = keyIssues.length > 0
        ? `
            <div style="margin: 20px 0; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 14px;">⚠️ Key Issues Found:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #78350f;">
                    ${keyIssues.slice(0, 5).map(issue => `<li style="margin-bottom: 6px;">${escapeHtml(issue)}</li>`).join('')}
                </ul>
            </div>
        `
        : '';

    const prioritiesHtml = topPriorities.length > 0
        ? `
            <div style="margin: 20px 0; padding: 16px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 12px 0; color: #1e40af; font-size: 14px;">🎯 Top Priorities:</h3>
                <ol style="margin: 0; padding-left: 20px; color: #1e3a8a;">
                    ${topPriorities.slice(0, 5).map(priority => `<li style="margin-bottom: 6px;">${escapeHtml(priority)}</li>`).join('')}
                </ol>
            </div>
        `
        : '';

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 12px 24px; border-radius: 12px;">
                    <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">${appName}</h1>
                </div>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <!-- Score Header -->
                <div style="background: linear-gradient(135deg, ${scoreColor}22, ${scoreColor}44); padding: 32px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                    <div style="display: inline-block; width: 100px; height: 100px; border-radius: 50%; background: white; box-shadow: 0 4px 12px ${scoreColor}40; line-height: 100px;">
                        <span style="font-size: 36px; font-weight: 800; color: ${scoreColor};">${atsScore}</span>
                    </div>
                    <p style="margin: 16px 0 0 0; font-size: 18px; font-weight: 600; color: ${scoreColor};">${scoreLabel}</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b;">ATS Compatibility Score</p>
                </div>

                <!-- Content -->
                <div style="padding: 32px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Hello${safeUserName ? ` ${safeUserName}` : ''},</p>
                    <h2 style="margin: 0 0 24px 0; font-size: 20px; color: #1e293b; font-weight: 600;">
                        Your Resume Analysis is Ready! 📊
                    </h2>

                    <!-- Role Info -->
                    <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                        <div style="flex: 1; background: #f1f5f9; padding: 16px; border-radius: 8px;">
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Target Role</p>
                            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">${safeTargetRole}</p>
                        </div>
                        <div style="flex: 1; background: #f1f5f9; padding: 16px; border-radius: 8px;">
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Experience</p>
                            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">${safeExperience}</p>
                        </div>
                    </div>

                    <!-- Summary -->
                    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
                        <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">${safeVerdict}</p>
                    </div>

                    ${issuesHtml}
                    ${prioritiesHtml}

                    <!-- CTA Button -->
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
                            View Full Report →
                        </a>
                    </div>

                    <p style="margin: 24px 0 0 0; font-size: 13px; color: #94a3b8; text-align: center;">
                        Click the button above to see your detailed analysis with actionable improvements.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
                    Powered by ${appName} | AI-Powered Resume Analysis
                </p>
                <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                    © ${new Date().getFullYear()} NetworkersHome. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: `${appName} <${fromEmail}>`,
            to: userEmail,
            subject: `📊 Your Resume Analysis: ${atsScore}/100 for ${targetRole}`,
            html: emailHtml,
        });

        if (error) {
            console.error('[Resend] Email send error:', error);
            return { success: false, error };
        }

        console.log('[Resend] Email sent successfully:', data?.id);
        return { success: true, id: data?.id };
    } catch (error) {
        console.error('[Resend] Failed to send email:', error);
        return { success: false, error };
    }
}
