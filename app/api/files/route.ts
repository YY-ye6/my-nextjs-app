import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "未提供文件" }, { status: 400 })
    }

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只允许上传图片" }, { status: 400 })
    }

    // 检查文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "文件过大（最大 5MB）" }, { status: 400 })
    }

    // 保证上传目录存在
    await mkdir(UPLOAD_DIR, { recursive: true })

    // 生成唯一文件名
    const ext = file.name.split(".").pop()
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const filepath = join(UPLOAD_DIR, filename)

    // 写入文件
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    return NextResponse.json({
      url: `/uploads/${filename}`,
      name: file.name,
      type: file.type,
    })
  } catch (error) {
    console.error("文件上传错误:", error)
    return NextResponse.json({ error: "上传失败" }, { status: 500 })
  }
}
