const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

// Función para leer y reemplazar el HTML de los templates
const generateEmailContent = (templatePath, data) => {
  let htmlTemplate = fs.readFileSync(templatePath, 'utf8')

  for (const key in data) {
    htmlTemplate = htmlTemplate.replace(`{{${key}}}`, data[key])
  }

  return htmlTemplate
}

// ========== FORMULARIO DE CONTACTO ==========
// Endpoint para el formulario de contacto
app.post('/api/contacto', async (req, res) => {
  const { name, email, phone, subject, message } = req.body
  const templatePath = path.join(__dirname, 'contactTemplate.html')
  const htmlContent = generateEmailContent(templatePath, { nombre: name, email, telefono: phone, asunto: subject, mensaje: message })

  try {
    await transporter.sendMail({
      from: `"HMDevs Web" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `INFORMACION DE CONTACTO: ${subject}`,
      html: htmlContent
    })

    res.status(200).json({ status: 'ok', message: 'Mensaje enviado correctamente' })
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    res.status(500).json({ status: 'error', message: 'Hubo un problema al enviar el mensaje' })
  }
})

// ========== FORMULARIO DE CONSULTA DE PROYECTO ==========
// Endpoint para la consulta de proyectos
app.post('/api/consulta', async (req, res) => {
  const { name, email, phone, projectType, description, technologies } = req.body
  const templatePath = path.join(__dirname, 'projectConsultationTemplate.html')
  const htmlContent = generateEmailContent(templatePath, { nombre: name, email, telefono: phone, proyecto: projectType, tecnologias: technologies.join(', '), descripcion: description })

  try {
    await transporter.sendMail({
      from: `"HMDevs Web" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: 'CONSULTA DE PROYECTO',
      html: htmlContent
    })

    res.status(200).json({ status: 'ok', message: 'Consulta enviada correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Error al enviar la consulta' })
  }
})

// ========== FORMULARIO DE PROYECTO ==========
// Endpoint para la propuesta de proyecto
app.post('/api/propuesta', async (req, res) => {
  const { name, email, phone, company, projectType, budget, timeline, description, technologies } = req.body
  const templatePath = path.join(__dirname, 'projectProposalTemplate.html')
  const htmlContent = generateEmailContent(templatePath, { nombre: name, email, telefono: phone, empresa: company, proyecto: projectType, presupuesto: budget, tiempo: timeline, tecnologias: technologies.join(', '), descripcion: description })

  try {
    await transporter.sendMail({
      from: `"HMDevs Web" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: 'PROPUESTA DE PROYECTO',
      html: htmlContent
    })

    res.status(200).json({ status: 'ok', message: 'Propuesta enviada correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Error al enviar la propuesta' })
  }
})

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
})
