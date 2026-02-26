import { Resend } from 'resend';

type ContactEmailInput = {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
  submission: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    lang: 'es' | 'en';
  };
  metadata: {
    ip: string;
    userAgent: string;
  };
};

const resendClients = new Map<string, Resend>();

function getResendClient(apiKey: string) {
  const existing = resendClients.get(apiKey);
  if (existing) {
    return existing;
  }

  const client = new Resend(apiKey);
  resendClients.set(apiKey, client);
  return client;
}

export async function sendContactEmail(input: ContactEmailInput) {
  const resend = getResendClient(input.apiKey);
  const fullName = sanitizeSingleLine(
    `${input.submission.firstName} ${input.submission.lastName}`
  );
  const subject =
    input.submission.lang === 'es'
      ? `Nuevo contacto desde tu portafolio: ${fullName}`
      : `New contact from your portfolio: ${fullName}`;

  const text = [
    `Name: ${fullName}`,
    `Email: ${sanitizeSingleLine(input.submission.email)}`,
    `Language: ${sanitizeSingleLine(input.submission.lang)}`,
    `IP: ${sanitizeSingleLine(input.metadata.ip)}`,
    `User Agent: ${sanitizeSingleLine(input.metadata.userAgent)}`,
    '',
    'Message:',
    input.submission.message.trim(),
  ].join('\n');

  return resend.emails.send({
    from: input.fromEmail,
    to: [input.toEmail],
    replyTo: input.submission.email,
    subject,
    text,
  });
}

function sanitizeSingleLine(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

