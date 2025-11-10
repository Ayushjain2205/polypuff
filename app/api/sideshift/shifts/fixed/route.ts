import { NextRequest, NextResponse } from "next/server";

import {
  SideshiftApiError,
  getAffiliateId,
  sideshiftFetch,
} from "@/lib/sideshift";

interface FixedShiftPayload {
  quoteId: string;
  settleAddress: string;
  affiliateId?: string;
  refundAddress?: string;
  settleMemo?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FixedShiftPayload | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { quoteId, settleAddress } = body;

    if (!quoteId || typeof quoteId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `quoteId`." },
        { status: 400 }
      );
    }

    if (!settleAddress || typeof settleAddress !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `settleAddress`." },
        { status: 400 }
      );
    }

    const payload: FixedShiftPayload = {
      ...body,
    };

    if (!payload.affiliateId) {
      const affiliateId = getAffiliateId();
      if (affiliateId) {
        payload.affiliateId = affiliateId;
      }
    }

    const data = await sideshiftFetch(`shifts/fixed`, {
      method: "POST",
      requiresSecret: true,
      body: payload,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("SideShift fixed shift route error:", error);

    if (error instanceof SideshiftApiError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.payload,
        },
        { status: error.status }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Unexpected error while creating a SideShift shift." },
      { status: 500 }
    );
  }
}
