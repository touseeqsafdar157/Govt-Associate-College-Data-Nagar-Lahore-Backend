const nodemailer = require('nodemailer');

/**
 * Returns a configured nodemailer transporter.
 * Checks process.env first, then falls back to MongoDB SiteSettings (smtpEmail / smtpPassword).
 * Strictly guards against hanging with 8-second socket timeouts.
 */
async function getTransporter() {
  let user = process.env.EMAIL_USER || process.env.SMTP_USER;
  let pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    try {
      const Settings = require('../models/Settings');
      const settings = await Settings.findOne();
      if (settings) {
        if (!user && settings.smtpEmail) user = settings.smtpEmail.trim();
        if (!pass && settings.smtpPassword) pass = settings.smtpPassword.trim();
      }
    } catch (e) {
      console.error('[EmailService] Error reading settings for credentials:', e.message);
    }
  }

  if (!user || !pass) {
    console.warn('[EmailService] SMTP credentials not set (EMAIL_USER / EMAIL_PASS in Render or Admin Settings). Query recorded in database only.');
    return null;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const isGmail = host.includes('gmail') || (!process.env.SMTP_HOST && user.includes('gmail.com'));

  if (isGmail && !process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    });
  }

  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465 || process.env.SMTP_SECURE === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * Sends an email directly to a faculty member from the college portal.
 */
async function sendFacultyQueryEmail({
  facultyName,
  facultyEmail,
  senderName,
  senderEmail,
  senderPhone,
  subject,
  message,
  department,
  designation
}) {
  if (!facultyEmail) {
    return { success: false, reason: 'Faculty email is required' };
  }

  const transporter = await getTransporter();
  if (!transporter) {
    return {
      success: false,
      skipped: true,
      reason: 'SMTP credentials (EMAIL_USER / EMAIL_PASS) not configured. Inquiry saved in database.'
    };
  }

  const senderUser = process.env.EMAIL_USER || process.env.SMTP_USER || 'datanagargacw@gmail.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'Govt. Associate College for Women, Data Nagar';
  const fromAddress = `"${fromName}" <${senderUser}>`;

  const safeSubject = `[Faculty Inquiry] ${subject || 'New Message from College Portal'}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 26px 30px; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 13px; opacity: 0.95; }
    .badge { display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 9999px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 8px; }
    .content { padding: 30px; }
    .greeting { font-size: 15px; margin-top: 0; margin-bottom: 12px; }
    .info-card { background: #f8fafc; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px; border-left: 4px solid #0284c7; }
    .info-row { margin: 6px 0; font-size: 14px; }
    .info-label { font-weight: 600; color: #475569; width: 110px; display: inline-block; }
    .message-card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
    .button-container { text-align: center; margin: 24px 0 10px 0; }
    .reply-button { display: inline-block; background: #0284c7; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Faculty Inquiry Portal</span>
      <h1>Govt. Associate College for Women, Data Nagar Lahore</h1>
      <p>Direct Faculty Communication via College Website Portal</p>
    </div>
    <div class="content">
      <p class="greeting">Dear <strong>${facultyName || 'Faculty Member'}</strong>,</p>
      <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">
        You have received a new inquiry submitted through the college web portal:
      </p>
      
      <div class="info-card">
        <div class="info-row"><span class="info-label">Sender:</span> <strong>${senderName}</strong></div>
        <div class="info-row"><span class="info-label">Email:</span> <a href="mailto:${senderEmail}" style="color: #0284c7; text-decoration: none;">${senderEmail}</a></div>
        <div class="info-row"><span class="info-label">Phone:</span> ${senderPhone || 'Not provided'}</div>
        <div class="info-row"><span class="info-label">Department:</span> ${department || 'General'}</div>
        ${designation ? `<div class="info-row"><span class="info-label">Designation:</span> ${designation}</div>` : ''}
        <div class="info-row"><span class="info-label">Subject:</span> <strong>${subject}</strong></div>
      </div>

      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 8px;">Message / Query:</h3>
      <div class="message-card">${message}</div>

      <div class="button-container">
        <a href="mailto:${senderEmail}?subject=Re: ${encodeURIComponent(subject)}" class="reply-button">Reply Directly to ${senderName}</a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 10px;">
        Or simply hit "Reply" in your email client to respond to <strong>${senderEmail}</strong>.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>Govt. Associate College for Women (GACW)</strong></p>
      <p style="margin: 0 0 6px 0;">Ilahi Bakhsh Road, Data Nagar, Lahore | Phone: 042-37602172 | WhatsApp: 0319-7030016</p>
      <p style="margin: 0; color: #94a3b8;">This is an automated notification from the GACW Data Nagar web portal.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `Dear ${facultyName || 'Faculty Member'},\n\nYou have received a student/visitor inquiry via the GACW Data Nagar portal.\n\nFrom: ${senderName} <${senderEmail}>\nPhone: ${senderPhone || 'N/A'}\nDepartment: ${department || 'N/A'}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nYou can reply directly to this email to respond to ${senderName} (${senderEmail}).\nGovt. Associate College for Women, Data Nagar Lahore`;

  const mailOptions = {
    from: fromAddress,
    to: facultyEmail,
    replyTo: `"${senderName}" <${senderEmail}>`,
    subject: safeSubject,
    text: textContent,
    html: htmlContent
  };

  const collegeBackup = process.env.COLLEGE_BACKUP_EMAIL || process.env.EMAIL_USER;
  if (collegeBackup && collegeBackup !== facultyEmail) {
    mailOptions.bcc = collegeBackup;
  }

  const info = await transporter.sendMail(mailOptions);
  return {
    success: true,
    messageId: info.messageId
  };
}

module.exports = {
  getTransporter,
  sendFacultyQueryEmail
};
