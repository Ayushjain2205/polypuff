import { NextRequest, NextResponse } from "next/server";

import { SideshiftApiError, sideshiftFetch } from "@/lib/sideshift";

interface RouteParams {
  shiftId: string;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const { shiftId } = await context.params;

  if (!shiftId || typeof shiftId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid shift ID." },
      { status: 400 }
    );
  }

  try {
    const data = await sideshiftFetch(`shifts/${encodeURIComponent(shiftId)}`, {
      requiresSecret: true,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("SideShift shift status route error:", error);

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
      { error: "Unexpected error while fetching the SideShift shift status." },
      { status: 500 }
    );
  }
}
