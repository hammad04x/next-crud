import { NextResponse } from "next/server";
import db from "@/lib/db";
import { uploadImage } from "@/lib/uploadImage";

export async function GET() {
    try {
        const q = "SELECT * FROM users"
        const [data] = await db.query(q);
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();

        const name = formData.get("name");
        const file = formData.get("file");

        if (!name) {
            return NextResponse.json(
                { error: "Name and are required" },
                { status: 400 }
            );
        }

        const filename = await uploadImage(file);

        const q = "INSERT INTO users (name, profile) VALUES (?, ?)";
        const [result] = await db.query(q, [name, filename]);

        return NextResponse.json({
            success: true,
            insertId: result.insertId,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}