// app/api/seeds/route.ts
import { prisma } from '../../../lib/prisma'   // Adjust path if needed
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await prisma.product.createMany({
      data: [
        {
          name: "Oversized Logo Tee",
          category: "T-Shirt",
          price: 320000,
          image: "/tshirt.png",
          images: ["/tshirt.png", "/tshirt-back.png", "/tshirt-detail.png"],
          description: "Premium oversized cotton tee with signature logo print.",
          isActive: true,
        },
        {
          name: "Collective Heavyweight Tee",
          category: "T-Shirt",
          price: 320000,
          image: "/tshirt.png",
          images: ["/tshirt.png", "/tshirt-back.png", "/tshirt-detail.png"],
          description: "Heavyweight premium cotton with collective branding.",
          isActive: true,
        },
        {
          name: "Smoke Zip Sweatshirt",
          category: "Sweatshirt",
          price: 580000,
          image: "/sweatshirt.png",
          images: ["/sweatshirt.png", "/sweatshirt-back.png", "/sweatshirt-detail.png"],
          description: "Premium zip-up sweatshirt in signature smoke colorway.",
          isActive: true,
        },
        {
          name: "Track Sweatshirt — Mint",
          category: "Sweatshirt",
          price: 580000,
          image: "/sweatshirt.png",
          images: ["/sweatshirt.png", "/sweatshirt-back.png", "/sweatshirt-detail.png"],
          description: "Limited mint track sweatshirt.",
          isActive: true,
        },
        {
          name: "Collective Pullover Hoodie",
          category: "Hoodie",
          price: 650000,
          image: "/hoodie.png",
          images: ["/hoodie.png", "/hoodie-back.png", "/hoodie-detail.png"],
          description: "Heavyweight pullover hoodie with embroidered logo.",
          isActive: true,
        },
        {
          name: "Smoke Heavyweight Hoodie",
          category: "Hoodie",
          price: 650000,
          image: "/hoodie.png",
          images: ["/hoodie.png", "/hoodie-back.png", "/hoodie-detail.png"],
          description: "Ultra soft heavyweight hoodie in smoke color.",
          isActive: true,
        },
        {
          name: "Faith Tee — Black",
          category: "New Arrivals",
          price: 350000,
          image: "/tshirt.png",
          images: ["/tshirt.png", "/tshirt-back.png", "/tshirt-detail.png"],
          description: "Signature Faith collection tee.",
          isActive: true,
        },
        {
          name: "Smoke Crewneck Sweatshirt",
          category: "New Arrivals",
          price: 590000,
          image: "/sweatshirt.png",
          images: ["/sweatshirt.png", "/sweatshirt-back.png", "/sweatshirt-detail.png"],
          description: "Premium crewneck sweatshirt.",
          isActive: true,
        },
      ],
      skipDuplicates: true,
    })

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ 
      message: "✅ Products seeded successfully!", 
      count: products.length,
      products 
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}