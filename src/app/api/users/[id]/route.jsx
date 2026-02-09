import { NextResponse } from "next/server";
import db from "@/lib/db";
import { uploadImage } from "@/lib/uploadImage";


export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const q = "SELECT * FROM users WHERE id = ?"
        const [data] = await db.query(q,[id]);
        return NextResponse.json(data[0])
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        const q = "DELETE FROM users WHERE id = ?";
        const [result] = await db.query(q, [id]);
        console.log(result.affectedRows)

        return NextResponse.json({
            success: true,
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}


export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        const formData = await req.formData();
        const name = formData.get("name");
        const file = formData.get("file");

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        let profile = null;

        if (file && file.size > 0) {
            profile = await uploadImage(file);
        }

        const q = `
      UPDATE users
      SET name = COALESCE(?, name), profile = COALESCE(?, profile)
      WHERE id = ?
    `;

        const [result] = await db.query(q, [name, profile, id]);

        return NextResponse.json({
            success: true,
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}