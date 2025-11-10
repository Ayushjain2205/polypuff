import { NextResponse } from "next/server";

import { SideshiftApiError, sideshiftFetch } from "@/lib/sideshift";

export async function GET() {
  try {
    const data = await sideshiftFetch("coins");
    return NextResponse.json(data);
  } catch (error) {
    console.error("SideShift coins route error:", error);

    if (error instanceof SideshiftApiError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.payload,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Unexpected error while fetching SideShift coins." },
      { status: 500 }
    );
  }
}
