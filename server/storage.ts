import { users, type User, type InsertUser } from "@shared/schema";
import { properties, type Property, type InsertProperty } from "@shared/schema";
import { contents, type Content, type InsertContent } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByUserId(userId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;

  // Content operations
  getContent(id: number): Promise<Content | undefined>;
  getContentsByPropertyId(propertyId: number): Promise<Content[]>;
  getContentsByUserId(userId: number): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getPropertiesByUserId(userId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.userId, userId));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set(property)
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty || undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
  const result = await db
    .delete(properties)
    .where(eq(properties.id, id));

  return result?.rowCount !== null && result?.rowCount > 0;
}


  // Content operations
  async getContent(id: number): Promise<Content | undefined> {
    const [content] = await db.select().from(contents).where(eq(contents.id, id));
    return content || undefined;
  }

  async getContentsByPropertyId(propertyId: number): Promise<Content[]> {
    return await db.select().from(contents).where(eq(contents.propertyId, propertyId));
  }

  async getContentsByUserId(userId: number): Promise<Content[]> {
    return await db.select().from(contents).where(eq(contents.userId, userId));
  }

  async createContent(content: InsertContent): Promise<Content> {
    const [newContent] = await db
      .insert(contents)
      .values(content)
      .returning();
    return newContent;
  }

  async updateContent(id: number, content: Partial<InsertContent>): Promise<Content | undefined> {
    const [updatedContent] = await db
      .update(contents)
      .set(content)
      .where(eq(contents.id, id))
      .returning();
    return updatedContent || undefined;
  }

 async deleteContent(id: number): Promise<boolean> {
  const result = await db
    .delete(contents)
    .where(eq(contents.id, id));

  return result?.rowCount !== null && result?.rowCount > 0;
}

// Temporary memory storage for demonstration
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private contents: Map<number, Content>;
  private userIdCounter: number;
  private propertyIdCounter: number;
  private contentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.contents = new Map();
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.contentIdCounter = 1;

    // Add a default user for testing
    const defaultUser: User = {
      id: this.userIdCounter++,
      username: 'demo',
      password: 'password',
    };
    this.users.set(defaultUser.id, defaultUser);

    // Add default properties for the demo user
    const property1: Property = {
      id: this.propertyIdCounter++,
      name: 'The Surry Hills House',
      location: 'Surry Hills, NSW, Australia',
      bedrooms: 3,
      bathrooms: 2.5,
      description: 'Charming terrace house in the heart of Surry Hills',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000',
      status: 'active',
      userId: defaultUser.id,
      amenities: ['Rooftop Terrace', 'Garden', 'BBQ', 'Smart Home'],
      brandVoice: 'Warm & Inviting',
      brandVoiceSummary: 'Comfortable and welcoming with a touch of local charm',
      useBrandVoiceDefault: true,
      savedHashtags: [],
      photos: null
      hostSignature: null,
    };
    this.properties.set(property1.id, property1);

    // No sample content - start with clean library
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByUserId(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => property.userId === userId);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const newProperty: Property = { 
      ...property, 
      id,
      amenities: property.amenities || [],
      brandVoice: property.brandVoice || '',
      brandVoiceSummary: property.brandVoiceSummary || '',
      useBrandVoiceDefault: property.useBrandVoiceDefault || false,
      savedHashtags: property.savedHashtags || [],
      photos: property.photos || null
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const existingProperty = this.properties.get(id);
    if (!existingProperty) return undefined;

    // Create an updated property with the new values
    const updatedProperty = { 
  ...existingProperty,
  ...property,
  // Ensure savedHashtags is properly assigned to this specific property
  savedHashtags: property.savedHashtags !== undefined
    ? property.savedHashtags
    : existingProperty.savedHashtags,
  hostSignature: property.hostSignature !== undefined
    ? property.hostSignature ?? null
    : existingProperty.hostSignature,
};
    
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async getContentsByPropertyId(propertyId: number): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(content => content.propertyId === propertyId);
  }

  async getContentsByUserId(userId: number): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(content => content.userId === userId);
  }

  async createContent(content: InsertContent): Promise<Content> {
    const id = this.contentIdCounter++;
    const newContent: Content = { 
      ...content, 
      id,
      brandVoice: null,
      imageUrl: null,
      dateGenerated: null,
      ctaEnhancements: null
    };
    this.contents.set(id, newContent);
    return newContent;
  }

  async updateContent(id: number, content: Partial<InsertContent>): Promise<Content | undefined> {
    const existingContent = this.contents.get(id);
    if (!existingContent) return undefined;

    const updatedContent = { ...existingContent, ...content };
    this.contents.set(id, updatedContent);
    return updatedContent;
  }

  async deleteContent(id: number): Promise<boolean> {
    return this.contents.delete(id);
  }
}

// Temporarily use memory storage until database is properly initialized
export const storage = new MemStorage();