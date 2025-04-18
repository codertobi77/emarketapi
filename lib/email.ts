import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

export async function sendEmailVerification(userId: string, email: string) {
  const token = uuidv4();

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerifyToken: token },
  });

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const verifyUrl = `http://localhost:3000/api/verify-email?token=${token}`;

  const info = await transporter.sendMail({
    from: '"Mon App 👻" <no-reply@monapp.com>',
    to: email,
    subject: 'Vérifie ton adresse email ✔',
    html: `
      <h1>Bienvenue 👋</h1>
      <p>Merci de t'être inscrit. Clique ci-dessous pour vérifier ton adresse email :</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });

  console.log('Preview:', nodemailer.getTestMessageUrl(info));
}
