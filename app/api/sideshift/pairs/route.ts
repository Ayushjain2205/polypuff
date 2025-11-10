import { NextRequest, NextResponse } from "next/server";

import { SideshiftApiError, sideshiftFetch } from "@/lib/sideshift";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const depositCoin = searchParams.get("depositCoin") ?? undefined;
    const settleCoin = searchParams.get("settleCoin") ?? undefined;

    const data = await sideshiftFetch("pairs", {
      searchParams: {
        depositCoin,
        settleCoin,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("SideShift pairs route error:", error);

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
      { error: "Unexpected error while fetching SideShift pairs." },
      { status: 500 }
    );
  }
}
