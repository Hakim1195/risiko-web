// Game Store Service for Risk Game
// Handles in-game purchases, season passes, and bonuses

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface StoreItem {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  image?: string;
  features?: any;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPurchase {
  id: number;
  userId: number;
  itemId: number;
  quantity: number;
  totalPrice: number;
  purchaseDate: Date;
  item: StoreItem;
}

export interface SeasonPass {
  id: number;
  name: string;
  description: string;
  price: number;
  tier: string;
  durationWeeks: number;
  benefits: any;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export class StoreService {
  // Get all available store items
  static async getStoreItems(): Promise<StoreItem[]> {
    return await (prisma as any).storeItem.findMany({
      where: { available: true },
      orderBy: { price: 'asc' }
    });
  }

  // Get store item by ID
  static async getStoreItemById(id: number): Promise<StoreItem | null> {
    return await (prisma as any).storeItem.findUnique({
      where: { id }
    });
  }

  // Get all active season passes
  static async getSeasonPasses(): Promise<SeasonPass[]> {
    return await (prisma as any).seasonPass.findMany({
      where: { isActive: true }
    });
  }

  // Get user's active season passes
  static async getUserActiveSeasonPasses(userId: number): Promise<SeasonPass[]> {
    const now = new Date();
    return await (prisma as any).seasonPass.findMany({
      where: {
        userSeasonPasses: {
          some: {
            userId,
            isActive: true,
            expiresAt: { gte: now }
          }
        }
      }
    });
  }

  // Get user's purchase history
  static async getUserPurchaseHistory(userId: number): Promise<UserPurchase[]> {
    return await (prisma as any).userPurchase.findMany({
      where: { userId },
      include: { item: true },
      orderBy: { purchaseDate: 'desc' }
    });
  }

  // Get user's current balance
  static async getUserBalance(userId: number): Promise<number> {
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });
    return user?.balance || 0;
  }

  // Add balance to user account
  static async addBalance(userId: number, amount: number): Promise<boolean> {
    try {
      await (prisma as any).user.update({
        where: { id: userId },
        data: { balance: { increment: amount } }
      });
      return true;
    } catch (error) {
      console.error('Error adding balance:', error);
      return false;
    }
  }

  // Deduct balance from user account
  static async deductBalance(userId: number, amount: number): Promise<boolean> {
    try {
      const user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: { balance: true }
      });

      if (!user || user.balance < amount) {
        return false;
      }

      await (prisma as any).user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } }
      });
      return true;
    } catch (error) {
      console.error('Error deducting balance:', error);
      return false;
    }
  }

  // Purchase an item
  static async purchaseItem(
    userId: number,
    itemId: number,
    quantity: number = 1
  ): Promise<{ success: boolean; message: string; newBalance?: number }> {
    const item = await (prisma as any).storeItem.findUnique({
      where: { id: itemId }
    });

    if (!item || !item.available) {
      return { success: false, message: 'Item not available' };
    }

    const totalPrice = item.price * quantity;
    const userBalance = await this.getUserBalance(userId);

    if (userBalance < totalPrice) {
      return { success: false, message: 'Insufficient balance' };
    }

    try {
      // Deduct balance
      await (prisma as any).user.update({
        where: { id: userId },
        data: { balance: { decrement: totalPrice } }
      });

      // Create purchase record
      await (prisma as any).userPurchase.create({
        data: {
          userId,
          itemId,
          quantity,
          totalPrice,
          item: { connect: { id: itemId } }
        }
      });

      // Apply item benefits
      await this.applyItemBenefits(userId, item, quantity);

      return { 
        success: true, 
        message: 'Purchase successful!',
        newBalance: userBalance - totalPrice 
      };
    } catch (error) {
      console.error('Error purchasing item:', error);
      return { success: false, message: 'Purchase failed. Please try again.' };
    }
  }

  // Purchase a season pass
  static async purchaseSeasonPass(
    userId: number,
    seasonPassId: number
  ): Promise<{ success: boolean; message: string; newBalance?: number }> {
    const seasonPass = await (prisma as any).seasonPass.findUnique({
      where: { id: seasonPassId }
    });

    if (!seasonPass || !seasonPass.isActive) {
      return { success: false, message: 'Season pass not available' };
    }

    const userBalance = await this.getUserBalance(userId);

    if (userBalance < seasonPass.price) {
      return { success: false, message: 'Insufficient balance' };
    }

    try {
      // Deduct balance
      await (prisma as any).user.update({
        where: { id: userId },
        data: { balance: { decrement: seasonPass.price } }
      });

      // Create season pass record
      const durationMs = seasonPass.durationWeeks * 7 * 24 * 60 * 60 * 1000;
      const expiresAt = new Date(Date.now() + durationMs);

      await (prisma as any).userSeasonPass.create({
        data: {
          userId,
          seasonPassId,
          isActive: true,
          expiresAt
        }
      });

      return { 
        success: true, 
        message: 'Season pass purchased successfully!',
        newBalance: userBalance - seasonPass.price 
      };
    } catch (error) {
      console.error('Error purchasing season pass:', error);
      return { success: false, message: 'Purchase failed. Please try again.' };
    }
  }

  // Apply item benefits to user
  private static async applyItemBenefits(
    userId: number,
    item: StoreItem,
    quantity: number
  ): Promise<void> {
    if (!item.features) return;

    const features = item.features as any;

    // Apply bonus armies
    if (features.bonusArmies) {
      await (prisma as any).user.update({
        where: { id: userId },
        data: { bonusArmies: { increment: features.bonusArmies * quantity } }
      });
    }

    // Apply card multiplier
    if (features.cardMultiplier) {
      await (prisma as any).user.update({
        where: { id: userId },
        data: { cardMultiplier: { increment: features.cardMultiplier * quantity } }
      });
    }

    // Apply starting armies
    if (features.startingArmies) {
      await (prisma as any).user.update({
        where: { id: userId },
        data: { startingArmies: { increment: features.startingArmies * quantity } }
      });
    }

    // Apply special privileges
    if (features.specialPrivileges && Array.isArray(features.specialPrivileges)) {
      await (prisma as any).user.update({
        where: { id: userId },
        data: {
          specialPrivileges: {
            push: features.specialPrivileges
          }
        }
      });
    }
  }

  // Get user's active bonuses
  static async getUserBonuses(userId: number): Promise<any> {
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        bonusArmies: true,
        cardMultiplier: true,
        startingArmies: true,
        specialPrivileges: true
      }
    });

    return user || {
      bonusArmies: 0,
      cardMultiplier: 1,
      startingArmies: 0,
      specialPrivileges: []
    };
  }

  // Get store statistics
  static async getStoreStats(): Promise<any> {
    const totalItems = await (prisma as any).storeItem.count({
      where: { available: true }
    });

    const totalSeasonPasses = await (prisma as any).seasonPass.count({
      where: { isActive: true }
    });

    const totalRevenue = await (prisma as any).userPurchase.aggregate({
      _sum: { totalPrice: true }
    });

    return {
      totalItems,
      totalSeasonPasses,
      totalRevenue: totalRevenue._sum.totalPrice || 0
    };
  }

  // Check if user has active season pass
  static async hasActiveSeasonPass(userId: number): Promise<boolean> {
    const now = new Date();
    const count = await (prisma as any).userSeasonPass.count({
      where: {
        userId,
        isActive: true,
        expiresAt: { gte: now }
      }
    });
    return count > 0;
  }

  // Get user's season pass benefits
  static async getUserSeasonBenefits(userId: number): Promise<any> {
    const activePasses = await this.getUserActiveSeasonPasses(userId);
    
    if (activePasses.length === 0) {
      return { hasPass: false, benefits: {} };
    }

    // Combine benefits from all active passes
    const combinedBenefits = activePasses.reduce((acc: any, pass: any) => {
      return { ...acc, ...pass.benefits };
    }, {});

    return { 
      hasPass: true, 
      benefits: combinedBenefits,
      passes: activePasses
    };
  }
}
