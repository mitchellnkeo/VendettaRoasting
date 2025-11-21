// Inventory management functions for Sanity products
import { sanityClient } from './sanity';

/**
 * Decrease inventory for a product in Sanity
 * @param productId - Sanity product ID (_id)
 * @param quantity - Quantity to decrease
 * @returns Updated inventory quantity or null if error
 */
export async function decreaseInventory(productId: string, quantity: number): Promise<number | null> {
  try {
    if (!process.env.SANITY_API_TOKEN) {
      console.warn('⚠️ SANITY_API_TOKEN not set. Inventory will not be updated.');
      return null;
    }

    // Fetch current product to get current inventory
    const product = await sanityClient.fetch(
      `*[_type == "product" && _id == $productId][0] {
        inventoryQuantity
      }`,
      { productId }
    );

    if (!product) {
      console.error(`Product not found: ${productId}`);
      return null;
    }

    const currentInventory = product.inventoryQuantity || 0;
    const newInventory = Math.max(0, currentInventory - quantity); // Don't go below 0

    // Update inventory in Sanity
    await sanityClient
      .patch(productId)
      .set({ inventoryQuantity: newInventory })
      .commit();

    console.log(`✅ Inventory updated for product ${productId}: ${currentInventory} → ${newInventory}`);
    return newInventory;
  } catch (error) {
    console.error('Error decreasing inventory:', error);
    return null;
  }
}

/**
 * Check if product has sufficient inventory
 * @param productId - Sanity product ID (_id)
 * @param requestedQuantity - Quantity requested
 * @returns Object with available status and current inventory
 */
export async function checkInventory(productId: string, requestedQuantity: number): Promise<{
  available: boolean;
  currentInventory: number;
  availableQuantity: number;
}> {
  try {
    const product = await sanityClient.fetch(
      `*[_type == "product" && _id == $productId][0] {
        inventoryQuantity,
        isActive
      }`,
      { productId }
    );

    if (!product || !product.isActive) {
      return {
        available: false,
        currentInventory: 0,
        availableQuantity: 0,
      };
    }

    const currentInventory = product.inventoryQuantity || 0;
    const availableQuantity = Math.min(currentInventory, requestedQuantity);

    return {
      available: currentInventory >= requestedQuantity,
      currentInventory,
      availableQuantity,
    };
  } catch (error) {
    console.error('Error checking inventory:', error);
    return {
      available: false,
      currentInventory: 0,
      availableQuantity: 0,
    };
  }
}

/**
 * Get all products with low stock (inventory <= threshold)
 * @param threshold - Low stock threshold (default: 10)
 * @returns Array of products with low stock
 */
export async function getLowStockProducts(threshold: number = 10): Promise<Array<{
  _id: string;
  name: string;
  sku: string;
  inventoryQuantity: number;
  lowStockThreshold: number;
}>> {
  try {
    const products = await sanityClient.fetch(
      `*[_type == "product" && isActive == true && inventoryQuantity <= $threshold] {
        _id,
        name,
        sku,
        inventoryQuantity,
        lowStockThreshold
      } | order(inventoryQuantity asc)`,
      { threshold }
    );

    return products || [];
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
}

/**
 * Get products that are out of stock
 * @returns Array of out of stock products
 */
export async function getOutOfStockProducts(): Promise<Array<{
  _id: string;
  name: string;
  sku: string;
  inventoryQuantity: number;
}>> {
  try {
    const products = await sanityClient.fetch(
      `*[_type == "product" && isActive == true && inventoryQuantity <= 0] {
        _id,
        name,
        sku,
        inventoryQuantity
      } | order(name asc)`
    );

    return products || [];
  } catch (error) {
    console.error('Error fetching out of stock products:', error);
    return [];
  }
}

