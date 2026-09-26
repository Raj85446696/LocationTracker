import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { latitude, longitude } = await request.json();

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return NextResponse.json(
        { message: "Invalid coordinates" },
        { status: 400 }
      );
    }

    console.log("SMTP HOST:", process.env.SMTP_HOST);
    console.log("SMTP PORT:", process.env.SMTP_PORT);
    console.log("SMTP USER:", process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    console.log("SMTP connection successful");

    const mapsUrl =
      `https://www.google.com/maps?q=${latitude},${longitude}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.TO_EMAIL,
      subject: "Location Shared",
      text: `
A user has shared their location.

Latitude: ${latitude}
Longitude: ${longitude}

Google Maps:
${mapsUrl}
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Location sent successfully",
    });

  } catch (error) {
    console.error("Email error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send location",
      },
      { status: 500 }
    );
  }
}