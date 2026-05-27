import { NextResponse } from "next/server";

const sql = `
-- STARBOY BD Full Schema + CMS + Stats
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid PRIMARY KEY,
  "username" text NOT NULL,
  "phone" text NOT NULL,
  "email" text,
  "facebookId" text,
  "avatar" text,
  "role" text NOT NULL DEFAULT 'user',
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "image" text,
  "banner" text,
  "description" text,
  "featured" boolean NOT NULL DEFAULT false,
  "priority" integer NOT NULL DEFAULT 0,
  "icon" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "shortDescription" text,
  "fullDescription" text,
  "images" text[] DEFAULT '{}',
  "originalPrice" numeric NOT NULL DEFAULT 0,
  "offerPrice" numeric,
  "categories" uuid[] DEFAULT '{}',
  "tags" text[] DEFAULT '{}',
  "availability" text NOT NULL DEFAULT 'in_stock',
  "featured" boolean NOT NULL DEFAULT false,
  "trending" boolean NOT NULL DEFAULT false,
  "bestSeller" boolean NOT NULL DEFAULT false,
  "stockQuantity" integer NOT NULL DEFAULT 0,
  "specs" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "carts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" text NOT NULL,
  "productId" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "quantity" integer NOT NULL DEFAULT 1,
  "size" text,
  "color" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE("userId", "productId")
);

CREATE TABLE IF NOT EXISTS "wishlists" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" text NOT NULL,
  "productId" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE("userId", "productId")
);

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" text NOT NULL,
  "userName" text NOT NULL,
  "rating" integer NOT NULL DEFAULT 5,
  "comment" text NOT NULL,
  "productId" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" text NOT NULL,
  "userName" text NOT NULL,
  "productId" uuid REFERENCES "products"("id") ON DELETE SET NULL,
  "productName" text,
  "text" text NOT NULL,
  "sender" text NOT NULL DEFAULT 'user',
  "read" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "announcements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "content" text NOT NULL,
  "type" text NOT NULL DEFAULT 'bar',
  "active" boolean NOT NULL DEFAULT false,
  "ctaText" text,
  "ctaLink" text,
  "priority" integer NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" text NOT NULL,
  "items" jsonb NOT NULL DEFAULT '[]',
  "total" numeric NOT NULL DEFAULT 0,
  "status" text NOT NULL DEFAULT 'pending',
  "shippingAddress" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "stats" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "label" text NOT NULL,
  "value" text NOT NULL,
  "suffix" text NOT NULL DEFAULT '',
  "icon" text NOT NULL DEFAULT 'Users',
  "active" boolean NOT NULL DEFAULT true,
  "priority" integer NOT NULL DEFAULT 0,
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL UNIQUE,
  "value" text NOT NULL,
  "type" text NOT NULL DEFAULT 'text',
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Seed Categories
INSERT INTO "categories" ("name","slug","image","description","featured","priority") VALUES
  ('Urban Street','urban-street','https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800','Contemporary street style essentials for the modern man.',true,1),
  ('Premium Shirts','premium-shirts','https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800','Handcrafted shirts with premium fabrics and perfect fits.',true,2),
  ('Leather Goods','leather-goods','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800','Genuine leather belts, wallets, and accessories.',true,3)
ON CONFLICT("slug") DO NOTHING;

-- Seed Products with stock
INSERT INTO "products" ("name","slug","shortDescription","fullDescription","images","originalPrice","offerPrice","categories","tags","availability","featured","trending","bestSeller","stockQuantity","specs") VALUES
  ('Pink Poplin Shirt','pink-poplin-shirt','Premium pink poplin cotton shirt with tailored fit.','Crafted from 100% Egyptian cotton poplin, this shirt features a tailored modern fit, spread collar, and genuine mother-of-pearl buttons.','{"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200"}',2800,2200,'{}','{"shirt","cotton","formal"}','in_stock',true,false,true,50,'{"Fabric":"Egyptian Cotton","Fit":"Tailored"}'),
  ('M&S Light Blue Oxford','ms-light-blue-oxford','Classic light blue oxford shirt with modern silhouette.','The timeless Oxford shirt reimagined for the modern wardrobe. Features a button-down collar, chest pocket, and durable yet soft cotton weave.','{"https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1200"}',2600,null,'{}','{"shirt","oxford","classic"}','in_stock',true,true,false,30,'{"Fabric":"Oxford Cotton","Fit":"Regular"}'),
  ('Charcoal Premium Shirt','charcoal-premium-shirt','Dark charcoal premium shirt with micro-texture.','A statement piece in deep charcoal with subtle micro-texture. Features a slim fit, French placket, and curved hem.','{"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200"}',3200,2700,'{}','{"shirt","charcoal","slim"}','in_stock',true,false,false,20,'{"Fabric":"Premium Blend","Fit":"Slim"}'),
  ('M&S Poplin Check Shirt','ms-poplin-check-shirt','Refined check pattern poplin shirt for everyday elegance.','Balancing tradition with contemporary style, this check poplin shirt offers breathability and a crisp finish.','{"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200"}',2500,null,'{}','{"shirt","check","poplin"}','in_stock',false,true,true,40,'{"Fabric":"Poplin","Pattern":"Check"}'),
  ('Urban Street Hoodie','urban-street-hoodie','Heavyweight cotton hoodie with structured fit.','Built for the streets. This heavyweight cotton hoodie features a structured oversized fit, double-layered hood, and premium ribbed cuffs.','{"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200"}',3800,3200,'{}','{"hoodie","street","casual"}','in_stock',true,true,true,25,'{"Fabric":"Heavy Cotton","Weight":"450 GSM"}'),
  ('Leather Signature Belt','leather-signature-belt','Full-grain leather belt with brushed brass buckle.','Handcrafted from full-grain vegetable-tanned leather. Features a minimal brushed brass buckle and refined stitching.','{"https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200"}',1800,null,'{}','{"belt","leather","accessory"}','in_stock',true,false,false,60,'{"Leather":"Full Grain","Buckle":"Brass"}'),
  ('Classic Aviators','classic-aviators','Polarized aviator sunglasses with gold frames.','Timeless aviator silhouette with 24k gold-plated stainless steel frames and polarized lenses.','{"https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200"}',2400,1900,'{}','{"sunglasses","aviator","gold"}','in_stock',false,true,true,15,'{"Frame":"Stainless Steel","Lenses":"Polarized"}'),
  ('Structured Street Cap','structured-street-cap','Minimal structured cap with embroidered logo.','Six-panel structured cap in premium cotton twill. Features subtle embroidered branding, adjustable leather strap closure, and reinforced eyelets.','{"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200"}',1200,null,'{}','{"cap","street","minimal"}','in_stock',false,false,false,100,'{"Panels":"6","Fabric":"Cotton Twill"}')
ON CONFLICT("slug") DO NOTHING;

-- Seed Announcements
INSERT INTO "announcements" ("title","content","type","active","priority") VALUES
  ('Free Delivery','FREE DELIVERY ON ORDERS OVER 5,000 BDT | 100% SECURE PAYMENTS','bar',true,1)
ON CONFLICT DO NOTHING;

-- Seed Stats
INSERT INTO "stats" ("label","value","suffix","icon","active","priority") VALUES
  ('Happy Customers','15420','+','Users',true,1),
  ('Products Sold','89300','+','ShoppingCart',true,2),
  ('Premium Products','500','+','Package',true,3),
  ('Avg. Rating','4.9','/5','Star',true,4)
ON CONFLICT DO NOTHING;

-- Seed Settings
INSERT INTO "settings" ("key","value","type") VALUES
  ('hero_title','THE MODERN STANDARD.','text'),
  ('hero_subtitle','Elevate your style with premium, ready-to-wear collections crafted for the modern Bangladeshi gentleman.','text'),
  ('hero_cta_primary','Shop New Arrivals','text'),
  ('hero_cta_secondary','Explore Collections','text'),
  ('footer_outlet_text','You are welcome to our outlet','text'),
  ('footer_outlet_location','Korim mes, College road, Satkhira','text')
ON CONFLICT("key") DO NOTHING;
`;

export const runtime = "nodejs";

export async function POST() {
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    return NextResponse.json(
      { error: "SUPABASE_DB_URL not set" },
      { status: 500 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Client } = require("pg");

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(sql);
    await client.end();
    return NextResponse.json({
      success: true,
      message: "Database initialized and seeded",
    });
  } catch (err: any) {
    try {
      await client.end();
    } catch {
      /* ignore */
    }
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
