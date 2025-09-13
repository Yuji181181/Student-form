import { NextResponse } from "next/server";
import { getPointsHistory } from "../../(Repository)/point";

export async function GET() {
  // auth check can be added here
  try {
    const pointsHistory = await getPointsHistory();
    return NextResponse.json(pointsHistory, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "not found" }, { status: 500 });
  }
}
