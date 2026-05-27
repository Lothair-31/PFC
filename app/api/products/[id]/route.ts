// app/api/products/[id]/route.ts
import { prisma } from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }   // ← Updated for Next.js 16+
) {
  const { id } = await params   // ← Must await params now

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}