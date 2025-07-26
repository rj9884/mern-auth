class mailOptions {
    constructor({ to, text, html, from = process.env.SENDER_EMAIL, subject }) {
        this.from = from;
        this.to = to;
        this.subject = subject || `Welcome ${to}`;
        this.text = text || "Welcome to Auth-mern";
        this.html = html || "";
    }
}

export {mailOptions};