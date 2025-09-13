import type { DeleteSurveyResponse } from "@/types/api/survey";
import { NextResponse } from "next/server";
import { deleteSurvey } from "../../(Repository)/survey";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = String((await params).id);
  try {
    const survey = await deleteSurvey(id);
    const deleteSurveyResponse: DeleteSurveyResponse = {
      id: survey.id,
      message: "deleted successfully",
    };
    return NextResponse.json(deleteSurveyResponse, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }
}
