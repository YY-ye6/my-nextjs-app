import Link from "next/link"
import { routes } from "@/lib/routes"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:py-24">
        {/* 头部 */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>欢迎使用</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              我的应用中心
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            选择一个应用开始探索
          </p>
        </div>

        {/* 应用卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.path}
                href={route.path}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* 渐变背景 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${route.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                {/* 内容 */}
                <div className="relative space-y-4">
                  {/* 图标 */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${route.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* 文字 */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {route.title}
                      <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {route.description}
                    </p>
                  </div>
                </div>

                {/* 装饰性光效 */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              </Link>
            )
          })}
        </div>

        {/* 底部提示 */}
        {routes.length === 0 && (
          <div className="text-center mt-12">
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl border border-dashed bg-muted/30">
              <div className="text-4xl">🚀</div>
              <div className="space-y-2">
                <h3 className="font-semibold">暂无应用</h3>
                <p className="text-sm text-muted-foreground">
                  在 <code className="px-2 py-1 bg-muted rounded text-xs">lib/routes.ts</code> 中添加新的路由配置
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
