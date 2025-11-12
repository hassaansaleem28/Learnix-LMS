import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import ejs from "ejs";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

async function sendMail(options: EmailOptions): Promise<void> {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { email, subject, template, data } = options;
    const templatePath = path.join(__dirname, "../mails", template);

    const html: string = await ejs.renderFile(templatePath, data);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject,
      html,
    });
  } catch (error) {}
}

export default sendMail;
