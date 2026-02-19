import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all memory documents
export const getMemoryDocuments = query({
  args: {
    category: v.optional(v.union(
      v.literal("personal"),
      v.literal("project"),
      v.literal("learning"),
      v.literal("reference"),
      v.literal("archived")
    )),
    tags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { category, tags, limit }) => {
    let query = ctx.db.query("memory_documents");
    
    if (category) {
      query = query.filter((q) => q.eq(q.field("category"), category));
    }

    let documents = await query.order("desc").collect();
    
    // Filter by tags if provided
    if (tags && tags.length > 0) {
      documents = documents.filter(doc => 
        doc.tags && tags.some(tag => doc.tags.includes(tag))
      );
    }
    
    // Apply limit
    if (limit) {
      documents = documents.slice(0, limit);
    }

    // Join with user data
    const documentsWithDetails = await Promise.all(
      documents.map(async (doc) => {
        const author = doc.authorId 
          ? await ctx.db.get(doc.authorId)
          : null;
        
        return {
          ...doc,
          author,
        };
      })
    );

    return documentsWithDetails;
  },
});

// Search memory documents
export const searchMemoryDocuments = query({
  args: {
    searchQuery: v.string(),
    category: v.optional(v.union(
      v.literal("personal"),
      v.literal("project"),
      v.literal("learning"),
      v.literal("reference"),
      v.literal("archived")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { searchQuery, category, limit = 20 }) => {
    let query = ctx.db.query("memory_documents");
    
    if (category) {
      query = query.filter((q) => q.eq(q.field("category"), category));
    }
    
    const documents = await query.order("desc").collect();
    
    // Simple text search (in production, you'd use a proper search engine)
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const filteredDocuments = documents.filter(doc => {
      const searchText = `${doc.title} ${doc.content} ${doc.summary || ''} ${doc.tags?.join(' ') || ''}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });
    
    // Sort by relevance (simple scoring)
    const scoredDocuments = filteredDocuments.map(doc => {
      const searchText = `${doc.title} ${doc.content} ${doc.summary || ''}`.toLowerCase();
      let score = 0;
      
      // Title matches score higher
      searchTerms.forEach(term => {
        if (doc.title.toLowerCase().includes(term)) score += 3;
        if (doc.summary?.toLowerCase().includes(term)) score += 2;
        if (doc.content.toLowerCase().includes(term)) score += 1;
      });
      
      return { ...doc, relevanceScore: score };
    });
    
    const sortedDocuments = scoredDocuments
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    // Join with user data
    const documentsWithDetails = await Promise.all(
      sortedDocuments.map(async (doc) => {
        const author = doc.authorId 
          ? await ctx.db.get(doc.authorId)
          : null;
        
        return {
          ...doc,
          author,
        };
      })
    );

    return documentsWithDetails;
  },
});

// Get memory statistics
export const getMemoryStats = query({
  args: {},
  handler: async (ctx) => {
    const documents = await ctx.db.query("memory_documents").collect();
    
    const now = Date.now();
    const thisMonth = now - (30 * 24 * 60 * 60 * 1000);
    const thisWeek = now - (7 * 24 * 60 * 60 * 1000);
    
    return {
      total: documents.length,
      thisMonth: documents.filter(doc => doc.createdAt > thisMonth).length,
      thisWeek: documents.filter(doc => doc.createdAt > thisWeek).length,
      byCategory: {
        personal: documents.filter(d => d.category === "personal").length,
        project: documents.filter(d => d.category === "project").length,
        learning: documents.filter(d => d.category === "learning").length,
        reference: documents.filter(d => d.category === "reference").length,
        archived: documents.filter(d => d.category === "archived").length,
      },
      totalWordCount: documents.reduce((sum, doc) => sum + (doc.wordCount || 0), 0),
    };
  },
});

// Create memory document
export const createMemoryDocument = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    category: v.union(
      v.literal("personal"),
      v.literal("project"),
      v.literal("learning"),
      v.literal("reference"),
      v.literal("archived")
    ),
    tags: v.optional(v.array(v.string())),
    authorId: v.optional(v.id("users")),
    sourceUrl: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    relatedDocuments: v.optional(v.array(v.id("memory_documents"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Calculate word count
    const wordCount = args.content.split(/\s+/).length;
    
    const documentId = await ctx.db.insert("memory_documents", {
      ...args,
      wordCount,
      createdAt: now,
      updatedAt: now,
    });

    return documentId;
  },
});

// Update memory document
export const updateMemoryDocument = mutation({
  args: {
    documentId: v.id("memory_documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    summary: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("personal"),
      v.literal("project"),
      v.literal("learning"),
      v.literal("reference"),
      v.literal("archived")
    )),
    tags: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    relatedDocuments: v.optional(v.array(v.id("memory_documents"))),
  },
  handler: async (ctx, args) => {
    const { documentId, ...updates } = args;
    const now = Date.now();
    
    // Recalculate word count if content updated
    const wordCount = updates.content 
      ? updates.content.split(/\s+/).length 
      : undefined;
    
    await ctx.db.patch(documentId, {
      ...updates,
      ...(wordCount && { wordCount }),
      updatedAt: now,
    });

    return documentId;
  },
});

// Delete memory document
export const deleteMemoryDocument = mutation({
  args: {
    documentId: v.id("memory_documents"),
  },
  handler: async (ctx, { documentId }) => {
    await ctx.db.delete(documentId);
    return documentId;
  },
});

// Get recent documents
export const getRecentDocuments = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 10 }) => {
    const documents = await ctx.db.query("memory_documents")
      .order("desc")
      .take(limit);

    const documentsWithDetails = await Promise.all(
      documents.map(async (doc) => {
        const author = doc.authorId 
          ? await ctx.db.get(doc.authorId)
          : null;
        
        return {
          ...doc,
          author,
        };
      })
    );

    return documentsWithDetails;
  },
});

// Get document by ID
export const getMemoryDocument = query({
  args: { documentId: v.id("memory_documents") },
  handler: async (ctx, { documentId }) => {
    const document = await ctx.db.get(documentId);
    if (!document) return null;

    const author = document.authorId 
      ? await ctx.db.get(document.authorId)
      : null;

    // Get related documents
    const relatedDocs = document.relatedDocuments 
      ? await Promise.all(
          document.relatedDocuments.map(id => ctx.db.get(id))
        )
      : [];

    return {
      ...document,
      author,
      relatedDocuments: relatedDocs.filter(Boolean),
    };
  },
});