// Written by Codex

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f2e9_0%,#edf4f7_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <Card className="w-full rounded-[2rem] border border-white/80 bg-white/85 py-0 shadow-[0_20px_60px_rgba(36,57,69,0.1)]">
          <CardContent className="space-y-6 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500">
              404 NOT FOUND
            </p>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                お探しのページが見つかりませんでした
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                URLが変更されたか、ページが削除された可能性があります。
                <br />
                トップページからもう一度お試しください。
              </p>
            </div>
            <div className="flex justify-center">
              <Button asChild size="lg" className="rounded-full px-5">
                <Link to="/">トップへ戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
