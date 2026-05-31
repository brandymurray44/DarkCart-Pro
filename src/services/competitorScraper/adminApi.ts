import prisma from "@/lib/db";

const SHOPIFY_API_VERSION = "2024-10";

export interface MerchantStoreData {
  products: Array<{
    id: string;
    title: string;
    price: number;
    variants: number;
    image?: string;
  }>;
  orders: Array<{
    id: string;
    total: number;
    createdAt: Date;
  }>;
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    salesVelocity: number; // orders per day
  };
}

export async function fetchMerchantStoreData(
  shopId: string
): Promise<MerchantStoreData | null> {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop || !shop.accessToken) {
      console.warn(`Shop ${shopId} not found or missing access token`);
      return null;
    }

    const products = await fetchShopifyProducts(
      shop.shopifyDomain,
      shop.accessToken
    );
    const orders = await fetchShopifyOrders(
      shop.shopifyDomain,
      shop.accessToken
    );

    // Calculate statistics
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate sales velocity (orders per day)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(
      (order) => new Date(order.createdAt) > thirtyDaysAgo
    );
    const salesVelocity = recentOrders.length / 30;

    return {
      products,
      orders,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        avgOrderValue,
        salesVelocity,
      },
    };
  } catch (error) {
    console.error(`Error fetching merchant store data for ${shopId}:`, error);
    return null;
  }
}

async function fetchShopifyProducts(
  shopDomain: string,
  accessToken: string
): Promise<
  Array<{
    id: string;
    title: string;
    price: number;
    variants: number;
    image?: string;
  }>
> {
  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=250&status=active`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      products?: Array<{
        id?: string;
        title?: string;
        variants?: Array<{ price?: string }>;
        images?: Array<{ src?: string }>;
      }>;
    };

    if (!data.products) {
      return [];
    }

    return data.products.map((product) => ({
      id: product.id || "",
      title: product.title || "Unknown",
      price: parseFloat(product.variants?.[0]?.price || "0") || 0,
      variants: product.variants?.length || 0,
      image: product.images?.[0]?.src,
    }));
  } catch (error) {
    console.error(
      `Failed to fetch products from ${shopDomain}:`,
      error
    );
    return [];
  }
}

async function fetchShopifyOrders(
  shopDomain: string,
  accessToken: string
): Promise<Array<{ id: string; total: number; createdAt: Date }>> {
  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/orders.json?limit=250&status=any&financial_status=paid`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      orders?: Array<{
        id?: string;
        total_price?: string;
        created_at?: string;
      }>;
    };

    if (!data.orders) {
      return [];
    }

    return data.orders.map((order) => ({
      id: order.id || "",
      total: parseFloat(order.total_price || "0") || 0,
      createdAt: new Date(order.created_at || Date.now()),
    }));
  } catch (error) {
    console.error(`Failed to fetch orders from ${shopDomain}:`, error);
    return [];
  }
}
