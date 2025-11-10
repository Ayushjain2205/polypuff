import { NextRequest, NextResponse } from "next/server";

import {
  SideshiftApiError,
  getAffiliateId,
  sideshiftFetch,
} from "@/lib/sideshift";

interface QuotePayload {
  depositCoin: string;
  depositNetwork?: string;
  settleCoin: string;
  settleNetwork?: string;
  depositAmount?: string;
  settleAmount?: string;
  affiliateId?: string;
  [key: string]: unknown;
}

function normalizeAmountField(value: unknown) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "string") {
    return value;
  }

  throw new Error("Amounts must be provided as string or number values.");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuotePayload | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { depositCoin, settleCoin } = body;

    if (!depositCoin || typeof depositCoin !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `depositCoin`." },
        { status: 400 }
      );
    }

    if (!settleCoin || typeof settleCoin !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `settleCoin`." },
        { status: 400 }
      );
    }

    const depositAmount = normalizeAmountField(body.depositAmount);
    const settleAmount = normalizeAmountField(body.settleAmount);

    if (!depositAmount && !settleAmount) {
      return NextResponse.json(
        { error: "Provide either `depositAmount` or `settleAmount`." },
        { status: 400 }
      );
    }

    const payload: QuotePayload = {
      ...body,
      depositAmount,
      settleAmount,
    };

    if (!payload.affiliateId) {
      const affiliateId = getAffiliateId();
      if (affiliateId) {
        payload.affiliateId = affiliateId;
      }
    }

    const data = await sideshiftFetch("quotes", {
      method: "POST",
      requiresSecret: true,
      body: payload,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("SideShift quotes route error:", error);

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
      { error: "Unexpected error while requesting a SideShift quote." },
      { status: 500 }
    );
  }
}
