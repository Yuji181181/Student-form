import { auth } from "@/auth";
import { surveyParamsSchema } from "@/schemas/api/survey";
import { updateSurveyRequestSchema } from "@/schemas/api/update";
import type { ResBody } from "@/types/api";
import type { Survey } from "@/types/api/survey";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getSurveyById } from "../../(Repository)/read";
import { updateSurvey } from "../../(Repository)/update";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const resolvedParams = await params;

    // パラメータのバリデーション
    const paramsValidationResult = surveyParamsSchema.safeParse(resolvedParams);

    if (!paramsValidationResult.success) {
      return NextResponse.json<ResBody<undefined>>(
        { message: "Bad Request" },
        { status: 400 },
      );
    }

    const survey = await getSurveyById(paramsValidationResult.data.id);

    if (!survey) {
      return NextResponse.json<ResBody<undefined>>(
        { message: "Survey not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ResBody<Survey>>(
      { message: "Success", data: survey },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json<ResBody<undefined>>(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    // 認証チェック
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json<ResBody<undefined>>(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const resolvedParams = await params;
    // UUIDのバリデーション
    const paramsValidationResult = surveyParamsSchema.safeParse(resolvedParams);

    if (!paramsValidationResult.success) {
      return NextResponse.json<ResBody<undefined>>(
        { message: "Bad Request" },
        { status: 400 },
      );
    }

    // 所有者チェック
    const existingSurvey = await getSurveyById(paramsValidationResult.data.id);

    if (!existingSurvey) {
      return NextResponse.json<ResBody<undefined>>(
        { message: "Survey not found" },
        { status: 404 },
      );
    }

    // 編集権限チェック
    if (existingSurvey.userId !== session.user.id) {
      return NextResponse.json<ResBody<undefined>>(
        { message: "Forbidden: You can only edit your own surveys" },
        { status: 403 },
      );
    }

    // 編集内容のバリデーション
    const body = await request.json();
    const bodyValidationResult = updateSurveyRequestSchema.safeParse(body);

    if (!bodyValidationResult.success) {
      return NextResponse.json<ResBody<undefined>>(
        { message: "Bad Request" },
        { status: 400 },
      );
    }

    const survey = await updateSurvey(
      paramsValidationResult.data.id,
      bodyValidationResult.data,
    );

    return NextResponse.json<ResBody<Survey>>(
      { message: "Success", data: survey },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json<ResBody<undefined>>(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
