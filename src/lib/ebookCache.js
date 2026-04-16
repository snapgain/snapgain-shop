import { parseEbook } from './ebookParser';

class EbookCache {
  constructor() {
    this.chaptersMap = new Map();
    this.isLoaded = false;
    this.isLoading = false;
    this.error = null;
  }

  async initialize() {
    if (this.isLoaded) return;

    // If already loading, wait for chapters OR error state via interval polling
    if (this.isLoading) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (this.isLoaded) {
            clearInterval(interval);
            resolve();
          } else if (this.error) {
            clearInterval(interval);
            reject(this.error);
          }
        }, 50);
      });
    }

    this.isLoading = true;
    this.error = null;

    try {
      const parsedChapters = await parseEbook();
      parsedChapters.forEach(ch => {
        this.chaptersMap.set(ch.chapter_number, ch);
      });
      this.isLoaded = true;
      this.isLoading = false;
    } catch (err) {
      this.error = err;
      this.isLoading = false;
      throw err;
    }
  }

  // Alias to preserve any existing hook calls to init()
  async init() {
    return this.initialize();
  }

  getChapter(chapterNumber) {
    return this.chaptersMap.get(chapterNumber);
  }

  hasChapter(chapterNumber) {
    return !!this.getChapter(chapterNumber);
  }

  async getAllChapters() {
    await this.initialize();
    const chapters = [];
    for (const [num, ch] of this.chaptersMap.entries()) {
      chapters.push({
        chapter_number: num,
        title: ch.title,
        sections: ch.sections
      });
    }
    return chapters.sort((a, b) => a.chapter_number - b.chapter_number);
  }

  async getTotalChapters() {
    await this.initialize();
    return this.chaptersMap.size;
  }

  async getChapterContent(chapterNumber) {
    await this.initialize();
    const ch = this.getChapter(chapterNumber);
    if (!ch) return null;
    
    // Preload adjacent chapters in background
    this.preloadChapter(chapterNumber + 1);
    this.preloadChapter(chapterNumber - 1);
    
    return ch.content_html;
  }

  preloadChapter(chapterNumber) {
    // In this current implementation, all chapters are loaded into memory on initialize.
    // This method is retained for potential network-based lazy loading in the future.
    if (this.isLoaded && this.hasChapter(chapterNumber)) {
      // Already in memory
    }
  }

  invalidate() {
    this.chaptersMap.clear();
    this.isLoaded = false;
    this.isLoading = false;
    this.error = null;
  }
}

// Export a singleton instance
export const ebookCache = new EbookCache();