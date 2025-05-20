import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF } from '@/lib/pdfUtils'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    const text = await extractTextFromPDF(buffer)
    return NextResponse.json({ text })
  } catch (error: any) {
    console.error('PDF extract error:', error)
    return NextResponse.json({ error: 'Failed to extract text from PDF', details: error.message }, { status: 500 })
  }
}
