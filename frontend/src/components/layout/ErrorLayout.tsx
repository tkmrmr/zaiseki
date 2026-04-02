import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { ErrorPageType } from "@/lib/type";

export default function ErrorLayout({
  errorPageType,
}: {
  errorPageType: ErrorPageType;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f2e9_0%,#edf4f7_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <Card className="w-full rounded-[2rem] border border-white/80 bg-white/85 py-0 shadow-[0_20px_60px_rgba(36,57,69,0.1)]">
          <CardContent className="space-y-6 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500">
              {errorPageType === "not-found" && "404 NOT FOUND"}
              {errorPageType === "unauthorized" && "401 UNAUTHORIZED"}
              {errorPageType === "forbidden" && "403 FORBIDDEN"}
              {errorPageType === "unknown" && "ERROR"}
            </p>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {errorPageType === "not-found" &&
                  "お探しのページが見つかりませんでした"}
                {errorPageType === "unauthorized" && "アクセスが拒否されました"}
                {errorPageType === "forbidden" &&
                  "アクセスが許可されていません"}
                {errorPageType === "unknown" && "予期せぬエラーが発生しました"}
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                {errorPageType === "not-found" &&
                  "URLが変更されたか、ページが削除された可能性があります。トップページからもう一度お試しください。"}
                {errorPageType === "unauthorized" &&
                  "このページにアクセスするには認証が必要です。"}
                {errorPageType === "forbidden" &&
                  "このページにアクセスする権限がありません。学内ネットワークからのアクセスか、管理者権限を確認してください。"}
                {errorPageType === "unknown" &&
                  "予期せぬエラーが発生しました。後でもう一度お試しください。"}
              </p>
            </div>
            {errorPageType === "not-found" && (
              <div className="flex justify-center">
                <Button asChild size="lg" className="rounded-full px-5">
                  <Link to="/">トップへ戻る</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
