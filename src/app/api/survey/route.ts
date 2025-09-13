import { auth } from "@/auth";
import { createSurveyRequestSchema } from "@/schemas/api/create";
import type { ResBody } from "@/types/api";
import type { Survey, SurveyList } from "@/types/api/survey";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createSurvey } from "../(Repository)/create";
import { getSurveys } from "../(Repository)/survey";

export const GET = async () => {
  try {
    const surveys = await getSurveys();

    return NextResponse.json<ResBody<SurveyList>>(
      { message: "Success", data: surveys },
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

export const POST = async (request: Request) => {
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

    // リクエストボディのバリデーション
    const body = await request.json();
    const validationResult = createSurveyRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json<ResBody<undefined>>(
        { message: "Bad Request" },
        { status: 400 },
      );
    }

    // 認証されたユーザーのIDを使用
    const survey = await createSurvey(session.user.id, validationResult.data);

    return NextResponse.json<ResBody<Survey>>(
      { message: "Success", data: survey },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json<ResBody<undefined>>(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
