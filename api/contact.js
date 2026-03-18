export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fname, lname, email, phone, service, message } = req.body;

  if (!fname || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FC Pro Services <noreply@fcproservicesllc.com>',
        to: ['frank.j@fcproservicesllc.com'],
        reply_to: email,
        subject: `New Quote Request — ${service || 'General'} | ${fname} ${lname}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#9b0a2c;padding:24px 32px;border-radius:8px 8px 0 0">
              <h2 style="color:#fff;margin:0">New Quote Request</h2>
              <p style="color:rgba(255,255,255,.8);margin:4px 0 0">FC Pro Services Website</p>
            </div>
            <div style="background:#f5f5f7;padding:32px;border-radius:0 0 8px 8px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#555;width:140px">Name</td><td style="padding:8px 0;font-weight:700">${fname} ${lname}</td></tr>
                <tr><td style="padding:8px 0;color:#555">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#555">Phone</td><td style="padding:8px 0">${phone || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#555">Service</td><td style="padding:8px 0">${service || '—'}</td></tr>
              </table>
              ${message ? `<div style="margin-top:20px;padding:16px;background:#fff;border-radius:6px;border-left:3px solid #9b0a2c"><p style="margin:0;color:#333">${message}</p></div>` : ''}
              <p style="margin-top:24px;font-size:12px;color:#999">Reply directly to this email to respond to ${fname}.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
