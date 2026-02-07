import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const q = "SELECT * FROM users"
        const [data] = await db.query(q);
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

