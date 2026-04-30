const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const nodemailer = require("nodemailer");

// Transporter instellen
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Jamievos100@gmail.com",
    pass: "iofv bmdg jwds vdnc", // Je app-wachtwoord
  },
});

// Luister naar de collectie "contact_aanvragen"
exports.sendContactEmail = onDocumentCreated("contact_aanvragen/{docId}", async (event) => {
  const data = event.data.data(); // Zo haal je de data op in v2

  const mailOptions = {
    from: "Artquake Website <Jamievos100@gmail.com>",
    to: "Jamievos100@gmail.com", 
    subject: `Nieuw bericht van ${data.naam}`,
    html: `
      <h2>Nieuwe aanvraag via de website</h2>
      <p><strong>Naam:</strong> ${data.naam}</p>
      <p><strong>E-mail:</strong> ${data.email}</p>
      <p><strong>Telefoon:</strong> ${data.telefoon || 'Niet opgegeven'}</p>
      <p><strong>Bericht:</strong></p>
      <p>${data.bericht}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email succesvol verzonden voor document:", event.params.docId);
  } catch (error) {
    console.error("Fout bij verzenden email:", error);
  }
});