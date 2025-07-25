import { MailService } from '@sendgrid/mail';

// Email service for sending photo report notifications
export class EmailService {
  private mailService: MailService;
  private fromEmail = 'noreply@cactilog.com';

  constructor() {
    this.mailService = new MailService();
    if (process.env.SENDGRID_API_KEY) {
      this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendPhotoReportNotification(
    adminEmail: string,
    reportDetails: {
      reportId: string;
      imageUrl: string;
      genus: string;
      species: string;
      reportType: string;
      description: string;
      reporterEmail?: string;
    }
  ): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured - email notification skipped');
      return false;
    }

    try {
      const emailSubject = `Cactilog Photo Report: ${reportDetails.genus} ${reportDetails.species}`;
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">Photo Report Submitted</h2>
          
          <div style="background: #f8fdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5016; margin-top: 0;">Report Details</h3>
            <p><strong>Species:</strong> ${reportDetails.genus} ${reportDetails.species}</p>
            <p><strong>Report Type:</strong> ${reportDetails.reportType.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Description:</strong> ${reportDetails.description || 'No description provided'}</p>
            <p><strong>Reporter:</strong> ${reportDetails.reporterEmail || 'Anonymous user'}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #2d5016;">Reported Image</h3>
            <img src="${reportDetails.imageUrl}" alt="Reported image" style="max-width: 300px; border-radius: 4px;" />
          </div>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Action Required:</strong> Please review this report in the Cactilog admin panel.</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
          
          <p style="color: #666; font-size: 14px;">
            This is an automated notification from Cactilog.<br>
            Report ID: ${reportDetails.reportId}
          </p>
        </div>
      `;

      await this.mailService.send({
        to: adminEmail,
        from: this.fromEmail,
        subject: emailSubject,
        html: emailHtml,
      });

      console.log(`✓ Photo report notification sent to ${adminEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send photo report email:', error);
      return false;
    }
  }

  async sendReportResolutionNotification(
    reporterEmail: string,
    reportDetails: {
      genus: string;
      species: string;
      resolution: string;
      adminNotes?: string;
    }
  ): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY || !reporterEmail) {
      return false;
    }

    try {
      const emailSubject = `Cactilog: Your photo report has been resolved`;
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">Photo Report Update</h2>
          
          <p>Thank you for helping improve Cactilog by reporting an image issue.</p>

          <div style="background: #f8fdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5016; margin-top: 0;">Report Resolution</h3>
            <p><strong>Species:</strong> ${reportDetails.genus} ${reportDetails.species}</p>
            <p><strong>Status:</strong> ${reportDetails.resolution.toUpperCase()}</p>
            ${reportDetails.adminNotes ? `<p><strong>Admin Notes:</strong> ${reportDetails.adminNotes}</p>` : ''}
          </div>

          <p>We appreciate your contribution to maintaining the quality of our botanical database.</p>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
          
          <p style="color: #666; font-size: 14px;">
            This is an automated notification from Cactilog.
          </p>
        </div>
      `;

      await this.mailService.send({
        to: reporterEmail,
        from: this.fromEmail,
        subject: emailSubject,
        html: emailHtml,
      });

      console.log(`✓ Report resolution notification sent to ${reporterEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send resolution notification:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();