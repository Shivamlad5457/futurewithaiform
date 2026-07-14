import nodemailer from 'nodemailer';

export interface EmailData {
  name: string;
  mobile: string;
  email: string;
  instagram: string;
  company?: string;
  collaboration_type: string;
  video_idea: string;
  description: string;
  preferred_date: string;
  preferred_time: string;
  budget: number;
  deadline: string;
  reference_link?: string;
  editing_required: boolean;
  voiceover_required: boolean;
  thumbnail_required: boolean;
  script_required: boolean;
  priority: string;
}

export async function sendCollaborationEmail(data: EmailData): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.SMTP_TO_EMAIL || 'creator@example.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333333;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          padding: 24px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 24px;
        }
        .section {
          margin-bottom: 24px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #4f46e5;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          padding: 8px 0;
          vertical-align: top;
        }
        td.label {
          width: 160px;
          font-weight: 600;
          color: #4a5568;
        }
        td.value {
          color: #1a202c;
        }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }
        .badge-high { background-color: #fee2e2; color: #ef4444; }
        .badge-medium { background-color: #fef3c7; color: #d97706; }
        .badge-low { background-color: #f3f4f6; color: #4b5563; }
        .idea-box {
          background-color: #f3f4f6;
          border-left: 4px solid #6366f1;
          padding: 12px;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          margin-top: 8px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 16px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Collaboration Request!</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Creator Collaboration Hub</p>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Contact Information</div>
            <table>
              <tr>
                <td class="label">Full Name</td>
                <td class="value">${data.name}</td>
              </tr>
              <tr>
                <td class="label">Instagram</td>
                <td class="value"><a href="https://instagram.com/${data.instagram.replace('@', '')}" target="_blank">@${data.instagram.replace('@', '')}</a></td>
              </tr>
              <tr>
                <td class="label">Mobile</td>
                <td class="value">${data.mobile}</td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="value">${data.email}</td>
              </tr>
              <tr>
                <td class="label">Company</td>
                <td class="value">${data.company || 'N/A'}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Collaboration Details</div>
            <table>
              <tr>
                <td class="label">Type</td>
                <td class="value">${data.collaboration_type}</td>
              </tr>
              <tr>
                <td class="label">Priority</td>
                <td class="value">
                  <span class="badge badge-${data.priority.toLowerCase()}">${data.priority.toUpperCase()}</span>
                </td>
              </tr>
              <tr>
                <td class="label">Budget</td>
                <td class="value"><b>$${data.budget}</b></td>
              </tr>
              <tr>
                <td class="label">Preferred Date</td>
                <td class="value">${data.preferred_date}</td>
              </tr>
              <tr>
                <td class="label">Preferred Time</td>
                <td class="value">${data.preferred_time}</td>
              </tr>
              <tr>
                <td class="label">Deadline</td>
                <td class="value">${data.deadline}</td>
              </tr>
              <tr>
                <td class="label">Reference Link</td>
                <td class="value">${data.reference_link ? `<a href="${data.reference_link}" target="_blank">${data.reference_link}</a>` : 'N/A'}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Requirements</div>
            <div style="margin-top: 8px;">
              ${data.editing_required ? '✅ Video Editing Required <br>' : ''}
              ${data.voiceover_required ? '✅ Voiceover Required <br>' : ''}
              ${data.thumbnail_required ? '✅ Thumbnail Required <br>' : ''}
              ${data.script_required ? '✅ Script Required <br>' : ''}
              ${(!data.editing_required && !data.voiceover_required && !data.thumbnail_required && !data.script_required) ? 'None' : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Video Idea</div>
            <div class="idea-box">${data.video_idea.replace(/\n/g, '<br>')}</div>
          </div>

          <div class="section">
            <div class="section-title">Project Description</div>
            <p style="margin: 8px 0; line-height: 1.5; color: #4a5568;">${data.description.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated request sent from your Creator Collaboration Hub website.</p>
          <p>&copy; ${new Date().getFullYear()} Creator Collaboration Hub</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Collaboration Hub" <${smtpUser}>`,
        to: toEmail,
        subject: `New Collaboration Request: ${data.collaboration_type} with ${data.name}`,
        html: htmlContent,
      });

      console.log(`Real email sent successfully to ${toEmail}`);
      return true;
    } catch (err) {
      console.error('SMTP Error, failed to send real email:', err);
      // Fallback to console logging
    }
  }

  // Fallback / Development logging: print beautiful console notification
  console.log('\n======================================================');
  console.log('📬 NEW COLLABORATION REQUEST EMAIL (MOCK SEND)');
  console.log('======================================================');
  console.log(`To: ${toEmail}`);
  console.log(`Subject: New Collaboration Request: ${data.collaboration_type} with ${data.name}`);
  console.log('------------------------------------------------------');
  console.log(`Creator Details: ${data.name} (@${data.instagram.replace('@', '')})`);
  console.log(`Contact: ${data.mobile} | ${data.email}`);
  console.log(`Company: ${data.company || 'None'}`);
  console.log(`Type: ${data.collaboration_type} | Budget: $${data.budget}`);
  console.log(`Preferred: ${data.preferred_date} at ${data.preferred_time} | Deadline: ${data.deadline}`);
  console.log(`Requirements: Editing: ${data.editing_required}, Voiceover: ${data.voiceover_required}, Thumbnail: ${data.thumbnail_required}, Script: ${data.script_required}`);
  console.log(`Video Idea: ${data.video_idea}`);
  console.log(`Description: ${data.description}`);
  console.log('======================================================\n');

  return true;
}
